// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "../src/CosmoShips.sol";
import "../src/GameLeague.sol";
import "../src/IAttributeVerifier.sol";

contract mockVerifier is IAttributeVerifier {
    function verify(bytes32, bytes32[] calldata, uint256, uint256) public pure returns (bool) {
        return true;
    }
}

contract GameLeagueTest is Test {
    GameLeague gameLeague;
    CosmoShips cosmoShips;
    IAttributeVerifier verifier;
    address deployer;
    bytes32[] proof;
    uint256 constant mintPrice = 1;

    function setUp() public {
        deployer = address(this);
        verifier = new mockVerifier();
        cosmoShips = new CosmoShips("0x1", mintPrice, address(this), address(verifier));
        gameLeague = new GameLeague(address(cosmoShips));

        // mock proof to pass signature requirement
        proof = new bytes32[](1);
        proof[0] = bytes32(0xabcdef1234560000000000000000000000000000000000000000000000000000);
        assert(address(gameLeague) != address(0));
    }

    function testCreateTeam(string memory teamName, bool approveAll) public {
        address user = address(0x1);
        vm.deal(user, 10 ^ 18);

        vm.startPrank(user);
        // Mint some tokens
        cosmoShips.mint{value: mintPrice}(1, 1096, proof);
        cosmoShips.mint{value: mintPrice}(2, 1096, proof);
        cosmoShips.mint{value: mintPrice}(3, 1096, proof);

        // Approve the GameLeague contract to take NFTs
        // Approval can be one by one or for all at once
        if (!approveAll) {
            cosmoShips.approve(address(gameLeague), 1);
            cosmoShips.approve(address(gameLeague), 2);
            cosmoShips.approve(address(gameLeague), 3);
        } else {
            cosmoShips.setApprovalForAll(address(gameLeague), true);
        }

        // Create team and stake NFTs
        uint256[] memory nftIds = new uint256[](3);
        nftIds[0] = 1;
        nftIds[1] = 2;
        nftIds[2] = 3;

        gameLeague.createTeam(nftIds, teamName);
        vm.stopPrank();

        // Check that the NFTs are transferred to the GameLeague contract
        assertEq(cosmoShips.ownerOf(1), address(gameLeague), "NFT 1 should be staked");
        assertEq(cosmoShips.ownerOf(2), address(gameLeague), "NFT 2 should be staked");
        assertEq(cosmoShips.ownerOf(3), address(gameLeague), "NFT 3 should be staked");
        // Check that team is created with correct values
        (string memory retrievedName, uint256[] memory retrievedNftIds, address retrievedOwner) = gameLeague.getTeam(0);
        assertEq(retrievedName, teamName, "Not correct teamName");
        assertEq(retrievedOwner, user, "Owner of the team does not match");
        assertEq(retrievedNftIds.length, 3, "Number of NFTs in the team should be 3");
        assertEq(retrievedNftIds[0], 1, "NFT ID at index 0 should be 1");
        assertEq(retrievedNftIds[1], 2, "NFT ID at index 1 should be 2");
        assertEq(retrievedNftIds[2], 3, "NFT ID at index 2 should be 3");
    }

    function testInitializeLeague(uint256 _prizePool) public {
        _prizePool = bound(_prizePool, 10 ^ 18, 10 ^ 23);
        vm.deal(deployer, _prizePool + 10 * 10 ^ 18);

        // Initially, we should be able to start a league
        vm.prank(deployer);
        gameLeague.initializeLeague{value: _prizePool}();
        (, GameLeague.LeagueState state,,) = gameLeague.getLeague(1);
        assertEq(uint256(state), uint256(GameLeague.LeagueState.Initiated));

        // Expect revert on trying to initialize another league when one is active
        vm.expectRevert("Previous league not concluded");
        gameLeague.initializeLeague{value: _prizePool}();
        vm.stopPrank();
    }

    function tokenMint(address recipient, uint256[] memory tokenIds, uint256[] memory attributes) internal {
        require(tokenIds.length == attributes.length, "Token IDs and attributes length mismatch");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            vm.prank(recipient);
            cosmoShips.mint{value: mintPrice}(tokenIds[i], attributes[i], proof);
        }
    }

    function testEnrollToLeague() public {
        vm.deal(deployer, 2 ether);
        vm.prank(deployer);
        gameLeague.initializeLeague{value: 1 ether}();

        // mint some tokens to user so that it can create a team
        address user = address(0x1);
        vm.deal(user, 3 * mintPrice + 100 ^ 18);
        uint256[] memory ids = new uint256[](3);
        uint256[] memory attrs = new uint256[](3);
        ids[0] = 1;
        ids[1] = 2;
        ids[2] = 3;
        attrs[0] = 1096;
        attrs[1] = 9768;
        attrs[2] = 17000;
        tokenMint(user, ids, attrs);

        vm.startPrank(user);
        cosmoShips.setApprovalForAll(address(gameLeague), true);
        // create a team
        uint256 teamId = gameLeague.createTeam(ids, "Team-A");
        // enroll team to league
        gameLeague.enrollToLeague(teamId);
        vm.stopPrank();

        // Check if the team was enrolled
        assertTrue(gameLeague.isTeamEnrolled(teamId, gameLeague.currentLeagueId()));
    }

    function testEndEnrollmentAndStartBetting() public {
        // Setup: Assume leagueId of 1 and it is currently in the Enrollment state
        gameLeague.initializeLeague{value: 1 ether}();
        uint256 leagueId = gameLeague.currentLeagueId();

        // Test transition to Betting state
        gameLeague.endEnrollmentAndStartBetting(leagueId);

        // Check if the state has transitioned to Betting
        (, GameLeague.LeagueState state,,) = gameLeague.getLeague(leagueId);
        assert(state == GameLeague.LeagueState.BetsOpen);

        // Try to call the function when the league is not in Enrollment state
        vm.expectRevert("League is not in enrollment state");
        gameLeague.endEnrollmentAndStartBetting(leagueId);
    }
}
