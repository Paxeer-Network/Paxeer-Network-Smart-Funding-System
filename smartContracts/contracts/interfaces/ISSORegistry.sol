// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

/**
 * @title ISSORegistry
 * @dev Interface for the network-wide SSO (Single Sign-On) session key registry.
 */
interface ISSORegistry {
    struct SessionKey {
        address signer;
        uint48 validAfter;
        uint48 validUntil;
        uint256 permissions;
        bool active;
    }

    /// @dev Permission bitmask constants
    /// PERMISSION_EXECUTE        = 1 << 0  (basic execute)
    /// PERMISSION_EXECUTE_BATCH  = 1 << 1  (batch execute)
    /// PERMISSION_TRANSFER_ETH   = 1 << 2  (native transfers)
    /// PERMISSION_TRANSFER_ERC20 = 1 << 3  (token transfers)
    /// PERMISSION_CALL_CONTRACT  = 1 << 4  (arbitrary contract calls)

    event SessionKeyRegistered(
        address indexed wallet,
        address indexed signer,
        uint48 validAfter,
        uint48 validUntil,
        uint256 permissions
    );

    event SessionKeyRevoked(address indexed wallet, address indexed signer);

    event SessionKeyUpdated(
        address indexed wallet,
        address indexed signer,
        uint48 validUntil,
        uint256 permissions
    );

    /// @dev Registers a session key for the calling wallet.
    function registerSessionKey(
        address signer,
        uint48 validAfter,
        uint48 validUntil,
        uint256 permissions
    ) external;

    /// @dev Revokes a session key for the calling wallet.
    function revokeSessionKey(address signer) external;

    /// @dev Validates whether a signer has a valid session key for a wallet with required permissions.
    function validateSessionKey(
        address wallet,
        address signer,
        uint256 requiredPermissions
    ) external view returns (bool);

    /// @dev Returns the session key details for a wallet and signer.
    function getSessionKey(address wallet, address signer) external view returns (SessionKey memory);

    /// @dev Returns all active session key signers for a wallet.
    function getActiveSigners(address wallet) external view returns (address[] memory);
}
