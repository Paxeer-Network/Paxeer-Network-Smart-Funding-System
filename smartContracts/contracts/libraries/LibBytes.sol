// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

/**
 * @title LibBytes
 * @dev Utility functions for byte manipulation.
 */
library LibBytes {
    error BytesSliceOutOfBounds();
    error BytesSliceOverflow();

    /**
     * @dev Extracts a bytes slice from `data` starting at `start` with length `length`.
     */
    function slice(
        bytes memory data,
        uint256 start,
        uint256 length
    ) internal pure returns (bytes memory) {
        if (length + 31 < length) revert BytesSliceOverflow();
        if (start + length > data.length) revert BytesSliceOutOfBounds();

        bytes memory result = new bytes(length);
        assembly {
            let src := add(add(data, 0x20), start)
            let dest := add(result, 0x20)
            for {
                let i := 0
            } lt(i, length) {
                i := add(i, 0x20)
            } {
                mstore(add(dest, i), mload(add(src, i)))
            }
        }
        return result;
    }

    /**
     * @dev Reads an address from `data` at position `index`.
     */
    function readAddress(bytes memory data, uint256 index) internal pure returns (address result) {
        if (index + 20 > data.length) revert BytesSliceOutOfBounds();
        assembly {
            result := shr(96, mload(add(add(data, 0x20), index)))
        }
    }

    /**
     * @dev Reads a uint256 from `data` at position `index`.
     */
    function readUint256(bytes memory data, uint256 index) internal pure returns (uint256 result) {
        if (index + 32 > data.length) revert BytesSliceOutOfBounds();
        assembly {
            result := mload(add(add(data, 0x20), index))
        }
    }

    /**
     * @dev Reads a bytes4 selector from `data`.
     */
    function readSelector(bytes memory data) internal pure returns (bytes4 selector) {
        if (data.length < 4) revert BytesSliceOutOfBounds();
        assembly {
            selector := mload(add(data, 0x20))
        }
    }
}
