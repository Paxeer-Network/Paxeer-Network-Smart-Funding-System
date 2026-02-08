// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../interfaces/ISmartWallet.sol";

/**
 * @dev Attacker contract that attempts reentrancy on SmartWallet.
 */
contract ReentrancyAttacker {
    address public target;
    uint256 public attackCount;
    bool public attacking;

    constructor(address _target) {
        target = _target;
    }

    function attack() external payable {
        attacking = true;
        attackCount = 0;
        // Call the wallet to send us ETH, which will trigger receive()
        ISmartWallet(target).execute(address(this), msg.value, "");
    }

    receive() external payable {
        if (attacking && attackCount < 3) {
            attackCount++;
            // Attempt reentrant call
            try ISmartWallet(target).execute(address(this), 0.1 ether, "") {
            } catch {
                attacking = false;
            }
        }
    }
}
