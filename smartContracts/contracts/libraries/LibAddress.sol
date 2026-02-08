// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

/**
 * @title LibAddress
 * @dev Utility functions for address operations.
 */
library LibAddress {
    error AddressInsufficientBalance(address account);
    error FailedInnerCall();
    error AddressEmptyCode(address target);

    /**
     * @dev Returns true if `account` is a contract.
     */
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    /**
     * @dev Sends `amount` of native currency to `recipient`, forwarding all available gas.
     * Reverts if the balance is insufficient or the call fails.
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        if (address(this).balance < amount) {
            revert AddressInsufficientBalance(address(this));
        }

        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert FailedInnerCall();
        }
    }

    /**
     * @dev Performs a low-level call to `target` with `data`, returning the result.
     * Reverts if the target has no code.
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0);
    }

    /**
     * @dev Performs a low-level call with value to `target` with `data`.
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        if (address(this).balance < value) {
            revert AddressInsufficientBalance(address(this));
        }
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return _verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Performs a static call to `target` with `data`.
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return _verifyCallResultFromTarget(target, success, returndata);
    }

    function _verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata
    ) private view returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            if (returndata.length == 0 && !isContract(target)) {
                revert AddressEmptyCode(target);
            }
            return returndata;
        }
    }

    function _revert(bytes memory returndata) private pure {
        if (returndata.length > 0) {
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert FailedInnerCall();
        }
    }
}
