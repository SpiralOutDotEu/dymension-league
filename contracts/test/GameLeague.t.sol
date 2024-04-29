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
}
