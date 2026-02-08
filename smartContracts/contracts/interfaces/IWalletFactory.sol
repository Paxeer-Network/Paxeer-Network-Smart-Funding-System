// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

/**
 * @title IWalletFactory
 * @dev Interface for the SmartWallet factory and registry.
 */
interface IWalletFactory {
    event WalletCreated(address indexed owner, address indexed wallet, bytes32 salt);
    event WalletPreDeployed(address indexed wallet, uint256 index);
    event WalletAssigned(address indexed wallet, address indexed owner);

    /// @dev Creates a new SmartWallet for the given owner. Admin only. One wallet per owner.
    function createWallet(address owner) external returns (address wallet);

    /// @dev Creates a new SmartWallet with a custom salt. Admin only.
    function createWalletWithSalt(address owner, bytes32 salt) external returns (address wallet);

    /// @dev Pre-deploys a batch of wallets without owners. Admin only.
    function deployWallets(uint256 count) external returns (address[] memory wallets);

    /// @dev Assigns a pre-deployed unassigned wallet to an owner. Admin only.
    function assignWallet(address wallet, address newOwner) external;

    /// @dev Predicts the address of a wallet before deployment.
    function predictWalletAddress(address owner, bytes32 salt) external view returns (address predicted);

    /// @dev Returns the wallet address for a given owner. address(0) if none exists.
    function getWallet(address owner) external view returns (address wallet);

    /// @dev Returns whether a given address is a wallet deployed by this factory.
    function isWallet(address wallet) external view returns (bool);

    /// @dev Returns the total number of wallets created (assigned + unassigned).
    function totalWallets() external view returns (uint256);

    /// @dev Returns the number of unassigned pre-deployed wallets available.
    function unassignedWalletCount() external view returns (uint256);

    /// @dev Returns the unassigned wallet address at a given index.
    function unassignedWalletAt(uint256 index) external view returns (address);

    /// @dev Returns the SmartWallet implementation address.
    function implementation() external view returns (address);
}
