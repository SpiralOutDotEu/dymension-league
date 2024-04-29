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

    struct League {
        uint256 id;
        bool isActive;
        uint256 prizePool;
        mapping(uint256 => Game) games;
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

    mapping(uint256 => League) public leagues;
    mapping(uint256 => Team) public teams;
    mapping(address => uint256) public stakes;

    CosmoShips public cosmoShips;

    constructor(address _nftAddress) {
        cosmoShips = CosmoShips(_nftAddress);
    }

    function createTeam(uint256[] calldata nftIds, string calldata teamName) external {
        require(nftIds.length == 3, "Must stake exactly three NFTs");
        Team storage newTeam = teams[teamsCounter.current()];
        for (uint256 i = 0; i < nftIds.length; i++) {
            require(cosmoShips.ownerOf(nftIds[i]) == msg.sender, "Not the owner of the NFT");
            cosmoShips.transferFrom(msg.sender, address(this), nftIds[i]);
            newTeam.nftIds.push(nftIds[i]);
        }
        newTeam.owner = msg.sender;
        newTeam.name = teamName;
        teamsCounter.increment();
    }

    function getTeam(uint256 teamId) public view returns (string memory, uint256[] memory, address) {
        Team storage team = teams[teamId];
        return (team.name, team.nftIds, team.owner);
    }
}
