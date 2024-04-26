// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "../src/AttributeVerifier.sol";

contract AttributeVerifierTest is Test {
    AttributeVerifier verifier;

    function setUp() public {
        verifier = new AttributeVerifier();
    }

    function testVerify() public {
        // Pre generated sample values
        bytes32 root = bytes32(0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28); // Sample root
        bytes32[11] memory proof = [
            bytes32(0x08fc7bec295e421b6c3eb5e02fcb29d0f7b10eeb66eef40cfa90334e4e323392),
            0x5b7fd1255ee7a29afe226a985d09ed1db5bc3e088535d4e00f9e6ab225660de4,
            0x160e5ccffcc96313fe63ba0b3e221a8dd3fc10ccbce2de81fa7d3ebf3d674680,
            0x79ba27da28e65437643d25847643c078dd376e5f3d2e03c2251013e2a54f73e5,
            0x8b446c10a4b15c28d509f359e07db3f814fce3a242a1fddc8a11652d5667fab7,
            0xfba46deafd168f3f4c274efca31e9b64ffca1e968d0a758320b411266a6aeec8,
            0x374a76c8fd7e854c3d2859380f11fd4a136799000308148be21b35f3ed7bcfa3,
            0xfb938b362eee1130e9d51adea733e22b38bd7f7a86409587e157e3b67982bbf2,
            0x1dff972fa730911b93af5eaf19130529652eea2e2d4195e7b7a45b249fd89c7f,
            0x54dccc5709a8acf21bc9e99b7d88399e6307e04c9552b70b4ef59db3716358bf,
            0xac7f510b795ec3394e05d08c6cd1dd43a082a9da913d2132df7b0e7906629a98
        ]; // Sample proof
        uint256 tokenId = 1; // Sample tokenId
        uint256 encodedAttributes = 9252; // Sample encodedAttributes

        bytes32[] memory t = new bytes32[](11);
        t[0] = proof[0];
        t[1] = proof[1];
        t[2] = proof[2];
        t[3] = proof[3];
        t[4] = proof[4];
        t[5] = proof[5];
        t[6] = proof[6];
        t[7] = proof[7];
        t[8] = proof[8];
        t[9] = proof[9];
        t[10] = proof[10];
        // Test the verify function
        bool result = verifier.verify(root, t, tokenId, encodedAttributes);
        assertTrue(result, "The verification should succeed.");
    }

    function testRevertVerifyOnWrongProof() public {
        // Pre generated sample values
        bytes32 root = bytes32(0xcba72fb67462937b6fa3a41e7bbad36cf169815ea7fe65f8a4b85fd8f5facb28); // Sample root
        bytes32[11] memory proof = [
            bytes32(0x08fc7bec295e421b6c3eb5e02fcb29d0f7b10eeb66eef40cfa90334e4e323392),
            0x5b7fd1255ee7a29afe226a985d09ed1db5bc3e088535d4e00f9e6ab225660de4,
            0x160e5ccffcc96313fe63ba0b3e221a8dd3fc10ccbce2de81fa7d3ebf3d674680,
            0x79ba27da28e65437643d25847643c078dd376e5f3d2e03c2251013e2a54f73e5,
            0x8b446c10a4b15c28d509f359e07db3f814fce3a242a1fddc8a11652d5667fab7,
            0xfba46deafd168f3f4c274efca31e9b64ffca1e968d0a758320b411266a6aeec8,
            0x374a76c8fd7e854c3d2859380f11fd4a136799000308148be21b35f3ed7bcfa3,
            0xfb938b362eee1130e9d51adea733e22b38bd7f7a86409587e157e3b67982bbf2,
            0x1dff972fa730911b93af5eaf19130529652eea2e2d4195e7b7a45b249fd89c7f,
            0x54dccc5709a8acf21bc9e99b7d88399e6307e04c9552b70b4ef59db3716358bf,
            0xac7f510b795ec3394e05d08c6cd1dd43a082a9da913d2132df7b0e7906629a98
        ]; // Sample proof
        uint256 tokenId = 2; // Sample tokenId // in purpose wrong id that doesn't belong to proof
        uint256 encodedAttributes = 9252; // Sample encodedAttributes

        bytes32[] memory t = new bytes32[](11);
        t[0] = proof[0];
        t[1] = proof[1];
        t[2] = proof[2];
        t[3] = proof[3];
        t[4] = proof[4];
        t[5] = proof[5];
        t[6] = proof[6];
        t[7] = proof[7];
        t[8] = proof[8];
        t[9] = proof[9];
        t[10] = proof[10];
        // Test the verify function
        vm.expectRevert("Invalid proof");
        verifier.verify(root, t, tokenId, encodedAttributes);
    }
}
