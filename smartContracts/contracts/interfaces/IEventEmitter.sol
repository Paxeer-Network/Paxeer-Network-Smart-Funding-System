// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

/**
 * @title IEventEmitter
 * @dev Interface for the centralized transaction event emitter.
 */
interface IEventEmitter {
    /// @dev Emitted for every transaction executed through a SmartWallet.
    event TransactionExecuted(
        address indexed wallet,
        address indexed to,
        uint256 value,
        bytes data,
        uint256 nonce,
        uint256 timestamp,
        bool success,
        bytes returnData
    );

    /// @dev Emitted when a wallet is registered with the emitter.
    event WalletRegistered(address indexed wallet, address indexed owner);

    /// @dev Emitted when a wallet is deregistered.
    event WalletDeregistered(address indexed wallet);

    /// @dev Called by a SmartWallet after each transaction execution.
    function emitTransaction(
        address to,
        uint256 value,
        bytes calldata data,
        uint256 txNonce,
        bool success,
        bytes calldata returnData
    ) external;

    /// @dev Registers a wallet as an authorized emitter. Called by the WalletFactory.
    function registerWallet(address wallet, address owner) external;

    /// @dev Deregisters a wallet. Called by admin or factory.
    function deregisterWallet(address wallet) external;

    /// @dev Returns whether a wallet is registered.
    function isRegisteredWallet(address wallet) external view returns (bool);
}
