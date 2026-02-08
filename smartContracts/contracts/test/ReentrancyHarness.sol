// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../security/ReentrancyGuard.sol";

/**
 * @dev Concrete implementation of ReentrancyGuard for testing.
 */
contract ReentrancyHarness is ReentrancyGuard {
    uint256 public counter;

    function protectedIncrement() external nonReentrant {
        counter++;
    }

    function unprotectedIncrement() external {
        counter++;
    }

    /// @dev Calls itself to test reentrancy
    function callSelf() external nonReentrant {
        (bool success, ) = address(this).call(
            abi.encodeWithSignature("protectedIncrement()")
        );
        // success should be false due to reentrancy guard
        require(!success, "Reentrancy should have been blocked");
        counter++;
    }

    /// @dev A nonReentrant function that calls another nonReentrant function on this contract
    function reentrantCall() external nonReentrant {
        this.protectedIncrement();
    }
}
