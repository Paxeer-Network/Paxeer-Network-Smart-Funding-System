// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../libraries/LibECDSA.sol";

/**
 * @dev Test harness that exposes LibECDSA internal functions.
 */
contract LibECDSAHarness {
    function recover(bytes32 hash, bytes memory signature) external pure returns (address) {
        return LibECDSA.recover(hash, signature);
    }

    function toEthSignedMessageHash(bytes32 messageHash) external pure returns (bytes32) {
        return LibECDSA.toEthSignedMessageHash(messageHash);
    }

    function toTypedDataHash(bytes32 domainSeparator, bytes32 structHash) external pure returns (bytes32) {
        return LibECDSA.toTypedDataHash(domainSeparator, structHash);
    }
}
