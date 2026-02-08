// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../security/Pausable.sol";

/**
 * @dev Concrete implementation of Pausable for testing.
 */
contract PausableHarness is Pausable {
    uint256 public counter;

    function incrementWhenNotPaused() external whenNotPaused {
        counter++;
    }

    function incrementWhenPaused() external whenPaused {
        counter++;
    }

    function pause() external {
        _pause();
    }

    function unpause() external {
        _unpause();
    }
}
