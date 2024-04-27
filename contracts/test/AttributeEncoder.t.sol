// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/AttributeEncoder.sol"; // Adjust the import path based on your project structure

contract AttributeEncoderTest is Test {
    AttributeEncoder encoder;

    function setUp() public {
        encoder = new AttributeEncoder();
    }

    function testEncodeDecodeAttributes() public view {
        uint capacity = 2;
        uint attack = 4;
        uint speed = 6;
        uint shield = 8;

        uint256 encoded = encoder.encodeAttributes(capacity, attack, speed, shield);
        (uint decodedCapacity, uint decodedAttack, uint decodedSpeed, uint decodedShield) = encoder.decodeAttributes(encoded);

        assertEq(decodedCapacity, capacity, "Mismatch in decoded capacity");
        assertEq(decodedAttack, attack, "Mismatch in decoded attack");
        assertEq(decodedSpeed, speed, "Mismatch in decoded speed");
        assertEq(decodedShield, shield, "Mismatch in decoded shield");
    }

    function testRevertIfAttributesOutOfBound() public {
        vm.expectRevert("Attributes must be between 2 and 17 inclusive.");
        encoder.encodeAttributes(18, 18, 18, 18); // Assuming 18 is out of the valid range
    }
}
