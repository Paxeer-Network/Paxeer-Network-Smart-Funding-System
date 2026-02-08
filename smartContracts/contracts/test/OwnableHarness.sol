// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../security/Ownable.sol";

/**
 * @dev Concrete implementation of Ownable for testing.
 */
contract OwnableHarness is Ownable {
    uint256 public protectedValue;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setProtectedValue(uint256 val) external onlyOwner {
        protectedValue = val;
    }
}
