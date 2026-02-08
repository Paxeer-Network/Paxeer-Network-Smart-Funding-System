// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../libraries/LibBytes.sol";

/**
 * @dev Test harness that exposes LibBytes internal functions.
 */
contract LibBytesHarness {
    function slice(bytes memory data, uint256 start, uint256 length) external pure returns (bytes memory) {
        return LibBytes.slice(data, start, length);
    }

    function readAddress(bytes memory data, uint256 index) external pure returns (address) {
        return LibBytes.readAddress(data, index);
    }

    function readUint256(bytes memory data, uint256 index) external pure returns (uint256) {
        return LibBytes.readUint256(data, index);
    }

    function readSelector(bytes memory data) external pure returns (bytes4) {
        return LibBytes.readSelector(data);
    }
}
