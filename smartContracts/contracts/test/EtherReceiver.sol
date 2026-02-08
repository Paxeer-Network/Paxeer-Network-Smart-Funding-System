// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

/**
 * @dev Helper contract that can receive and reject ETH for testing.
 */
contract EtherReceiver {
    bool public rejectEther;
    uint256 public receivedAmount;

    function setRejectEther(bool _reject) external {
        rejectEther = _reject;
    }

    receive() external payable {
        if (rejectEther) {
            revert("Rejected");
        }
        receivedAmount += msg.value;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

/**
 * @dev Contract with no receive/fallback — always rejects ETH.
 */
contract EtherRejecter {
    // No receive or fallback — cannot receive ETH
}

/**
 * @dev Contract that stores calldata for verification.
 */
contract CallRecorder {
    bytes public lastCallData;
    uint256 public lastValue;
    uint256 public callCount;

    function record() external payable {
        lastCallData = msg.data;
        lastValue = msg.value;
        callCount++;
    }

    function echoUint(uint256 val) external pure returns (uint256) {
        return val * 2;
    }

    function failingFunction() external pure {
        revert("Intentional failure");
    }

    receive() external payable {
        lastValue = msg.value;
        callCount++;
    }
}
