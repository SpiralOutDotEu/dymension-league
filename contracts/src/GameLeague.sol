// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "openzeppelin-contracts/contracts/token/ERC721/utils/ERC721Holder.sol";
import "openzeppelin-contracts/contracts/utils/Counters.sol";
import "./CosmoShips.sol";

contract GameLeague is ERC721Holder {
    using Counters for Counters.Counter;

    Counters.Counter private leagueIdCounter;
    Counters.Counter private gameIdCounter;
    Counters.Counter private teamsCounter;

    enum LeagueState {
        Idle,
        Initiated,
        EnrollmentClosed,
        BetsOpen,
        Running,
        Distribution,
        Concluded
    }

    struct League {
        uint256 id;
        LeagueState state;
        uint256 prizePool;
        uint256[] enrolledTeams;
        mapping(uint256 => bool) teamsMap;
        mapping(uint256 => Game) games;
        mapping(uint256 => uint256) totalBetsOnTeam;
        mapping(address => mapping(uint256 => uint256)) userBetsOnTeam;
        mapping(address => uint256[]) userBetTeams;
        mapping(address => uint256) claimableRewards;
        uint256 totalBetsInLeague;
    }

    struct Game {
        uint256 id;
        uint256 team1;
        uint256 team2;
        uint256 winner;
        GameType gameType;
    }

    struct Team {
        uint256[] nftIds;
        address owner;
        string name;
    }

    enum GameType {
        Racing,
        Battle
    }

    uint256 public currentLeagueId;
    mapping(uint256 => League) public leagues;
    mapping(uint256 => Team) public teams;
    mapping(address => uint256) public stakes;

    CosmoShips public cosmoShips;

    constructor(address _nftAddress) {
        cosmoShips = CosmoShips(_nftAddress);
    }

    function createTeam(uint256[] calldata nftIds, string calldata teamName) external returns (uint256) {
        require(nftIds.length == 3, "Must stake exactly three NFTs");
        uint256 newTeamId = teamsCounter.current();
        Team storage newTeam = teams[newTeamId];
        for (uint256 i = 0; i < nftIds.length; i++) {
            require(cosmoShips.ownerOf(nftIds[i]) == msg.sender, "Not the owner of the NFT");
            cosmoShips.transferFrom(msg.sender, address(this), nftIds[i]);
            newTeam.nftIds.push(nftIds[i]);
        }
        newTeam.owner = msg.sender;
        newTeam.name = teamName;
        teamsCounter.increment();
        return newTeamId;
    }

    function getTeam(uint256 teamId) public view returns (string memory, uint256[] memory, address) {
        Team storage team = teams[teamId];
        return (team.name, team.nftIds, team.owner);
    }

    function initializeLeague() external payable {
        require(
            leagues[currentLeagueId].state == LeagueState.Concluded || currentLeagueId == 0,
            "Previous league not concluded"
        );

        currentLeagueId++;
        League storage newLeague = leagues[currentLeagueId];
        newLeague.id = currentLeagueId;
        newLeague.state = LeagueState.Initiated;
        newLeague.prizePool = msg.value;
    }

    function getLeague(uint256 leagueId)
        external
        view
        returns (uint256 id, LeagueState state, uint256 prizePool, uint256[] memory enrolledTeams, uint256 totalBetsInLeague)
    {
        League storage league = leagues[leagueId];
        return (league.id, league.state, league.prizePool, league.enrolledTeams, league.totalBetsInLeague);
    }

    function enrollToLeague(uint256 teamId) external {
        require(leagues[currentLeagueId].state == LeagueState.Initiated, "Enrollment is closed");
        (,, address retrievedOwner) = getTeam(teamId);
        require(msg.sender == retrievedOwner, "Not team owner");
        leagues[currentLeagueId].enrolledTeams.push(teamId);
        leagues[currentLeagueId].teamsMap[teamId] = true;
    }

    function isTeamEnrolled(uint256 teamId, uint256 leagueId) external view returns (bool) {
        return leagues[leagueId].teamsMap[teamId];
    }

    // Function to end team enrollment and start the betting period
    function endEnrollmentAndStartBetting(uint256 leagueId) external {
        League storage league = leagues[leagueId];
        require(league.state == LeagueState.Initiated, "League is not in enrollment state");
        league.state = LeagueState.BetsOpen;
    }

    function placeBet(uint256 leagueId, uint256 teamId, uint256 amount) external {
        League storage league = leagues[leagueId];
        require(league.state == LeagueState.BetsOpen, "Betting is not active");
        require(league.teamsMap[teamId], "Team does not exist in this league");

        // If it's the first bet on this team by the user for this league, add to the list
        if (league.userBetsOnTeam[msg.sender][teamId] == 0) {
            league.userBetTeams[msg.sender].push(teamId);
        }

        // Update the bet amount
        league.userBetsOnTeam[msg.sender][teamId] += amount;

        // Update the total bets for the team and the league
        league.totalBetsOnTeam[teamId] += amount;
        league.totalBetsInLeague += amount;
    }

    // Function to get all bet details for a user in a specific league
    function getUserBets(uint256 leagueId, address user)
        public
        view
        returns (uint256[] memory teamIds, uint256[] memory betAmounts)
    {
        League storage league = leagues[leagueId];
        uint256[] storage betTeams = league.userBetTeams[user];
        uint256 numBets = betTeams.length;
        require(league.userBetTeams[msg.sender].length > 0, "No bets placed");

        teamIds = new uint256[](numBets);
        betAmounts = new uint256[](numBets);

        for (uint256 i = 0; i < numBets; i++) {
            uint256 teamId = betTeams[i];
            if (league.userBetsOnTeam[user][teamId] > 0) {
                teamIds[i] = teamId;
                betAmounts[i] = league.userBetsOnTeam[user][teamId];
            } else {
                // This else block should theoretically never be hit since teamIds should only be added if a bet is made.
                revert("Bet data corrupted or uninitialized bet found.");
            }
        }

        return (teamIds, betAmounts);
    }
}
