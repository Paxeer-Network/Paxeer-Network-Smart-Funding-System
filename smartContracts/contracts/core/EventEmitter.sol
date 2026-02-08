// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../interfaces/IEventEmitter.sol";
import "../security/Ownable.sol";
import "../security/Pausable.sol";

/**
 * @title EventEmitter
 * @dev Centralized transaction event emitter for the Paxeer network.
 *      All SmartWallets call this contract after every transaction execution.
 *      Events emitted here are consumed by the network's built-in risk algorithm.
 *
 *      Only wallets registered via the WalletFactory (or admin) can emit events.
 */
contract EventEmitter is IEventEmitter, Ownable, Pausable {
    /// @dev Address of the WalletFactory authorized to register wallets.
    address public factory;

    /// @dev Mapping of registered wallet addresses.
    mapping(address => bool) private _registeredWallets;

    /// @dev Mapping of wallet => owner for lookup.
    mapping(address => address) private _walletOwners;

    /// @dev Total transaction count across all wallets (global counter for analytics).
    uint256 public totalTransactions;

    error CallerNotRegisteredWallet();
    error CallerNotFactory();
    error WalletAlreadyRegistered(address wallet);
    error WalletNotRegistered(address wallet);

    modifier onlyRegisteredWallet() {
        if (!_registeredWallets[msg.sender]) {
            revert CallerNotRegisteredWallet();
        }
        _;
    }

    modifier onlyFactoryOrOwner() {
        if (msg.sender != factory && msg.sender != owner()) {
            revert CallerNotFactory();
        }
        _;
    }

    constructor(address _owner) Ownable(_owner) {}

    /**
     * @dev Sets the WalletFactory address. Can only be called by the owner.
     * @param _factory The address of the WalletFactory contract.
     */
    function setFactory(address _factory) external onlyOwner {
        factory = _factory;
    }

    /**
     * @inheritdoc IEventEmitter
     */
    function emitTransaction(
        address to,
        uint256 value,
        bytes calldata data,
        uint256 txNonce,
        bool success,
        bytes calldata returnData
    ) external override onlyRegisteredWallet whenNotPaused {
        unchecked {
            ++totalTransactions;
        }

        emit TransactionExecuted(
            msg.sender,
            to,
            value,
            data,
            txNonce,
            block.timestamp,
            success,
            returnData
        );
    }

    /**
     * @inheritdoc IEventEmitter
     */
    function registerWallet(address wallet, address walletOwner) external override onlyFactoryOrOwner {
        if (_registeredWallets[wallet]) {
            revert WalletAlreadyRegistered(wallet);
        }
        _registeredWallets[wallet] = true;
        _walletOwners[wallet] = walletOwner;

        emit WalletRegistered(wallet, walletOwner);
    }

    /**
     * @inheritdoc IEventEmitter
     */
    function deregisterWallet(address wallet) external override onlyFactoryOrOwner {
        if (!_registeredWallets[wallet]) {
            revert WalletNotRegistered(wallet);
        }
        _registeredWallets[wallet] = false;
        delete _walletOwners[wallet];

        emit WalletDeregistered(wallet);
    }

    /**
     * @inheritdoc IEventEmitter
     */
    function isRegisteredWallet(address wallet) external view override returns (bool) {
        return _registeredWallets[wallet];
    }

    /**
     * @dev Returns the owner of a registered wallet.
     */
    function walletOwnerOf(address wallet) external view returns (address) {
        return _walletOwners[wallet];
    }

    /**
     * @dev Pauses the event emitter. Only callable by the owner.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the event emitter. Only callable by the owner.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
