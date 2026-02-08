// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../libraries/LibAddress.sol";

/**
 * @dev Test harness that exposes LibAddress internal functions.
 */
contract LibAddressHarness {
    using LibAddress for address;
    using LibAddress for address payable;

    function isContract(address account) external view returns (bool) {
        return account.isContract();
    }

    function sendValue(address payable recipient, uint256 amount) external {
        recipient.sendValue(amount);
    }

    function functionCall(address target, bytes memory data) external returns (bytes memory) {
        return target.functionCall(data);
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) external returns (bytes memory) {
        return target.functionCallWithValue(data, value);
    }

    function functionStaticCall(address target, bytes memory data) external view returns (bytes memory) {
        return target.functionStaticCall(data);
    }

    receive() external payable {}
}
