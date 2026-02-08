// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../interfaces/ISSORegistry.sol";
import "../security/Ownable.sol";

/**
 * @title SSORegistry
 * @dev Network-wide Single Sign-On session key registry.
 *      Allows SmartWallet owners to register session keys (signers) with
 *      time-bound validity and granular permission bitmasks.
 *
 *      Session keys enable seamless cross-protocol SSO — a user signs in once
 *      and can interact across the Paxeer network without re-authenticating.
 */
contract SSORegistry is ISSORegistry, Ownable {
    /// @dev Permission constants
    uint256 public constant PERMISSION_EXECUTE = 1 << 0;
    uint256 public constant PERMISSION_EXECUTE_BATCH = 1 << 1;
    uint256 public constant PERMISSION_TRANSFER_ETH = 1 << 2;
    uint256 public constant PERMISSION_TRANSFER_ERC20 = 1 << 3;
    uint256 public constant PERMISSION_CALL_CONTRACT = 1 << 4;
    uint256 public constant PERMISSION_ALL = (1 << 5) - 1;

    /// @dev Maximum session duration: 30 days
    uint48 public constant MAX_SESSION_DURATION = 30 days;

    /// @dev Maximum session keys per wallet
    uint256 public constant MAX_KEYS_PER_WALLET = 10;

    /// @dev wallet => signer => SessionKey
    mapping(address => mapping(address => SessionKey)) private _sessionKeys;

    /// @dev wallet => list of signer addresses (for enumeration)
    mapping(address => address[]) private _walletSigners;

    /// @dev wallet => signer => index in _walletSigners array
    mapping(address => mapping(address => uint256)) private _signerIndex;

    /// @dev Authorized wallet contracts that can call registerSessionKey on behalf of owner
    mapping(address => bool) public authorizedCallers;

    error InvalidSigner();
    error InvalidDuration();
    error InvalidPermissions();
    error SessionKeyAlreadyExists(address signer);
    error SessionKeyNotFound(address signer);
    error MaxSessionKeysReached(address wallet);
    error CallerNotWalletOrOwner();

    modifier onlyWalletOwnerOrAuthorized(address wallet) {
        // The wallet itself can call, or an authorized caller
        if (msg.sender != wallet && !authorizedCallers[msg.sender]) {
            revert CallerNotWalletOrOwner();
        }
        _;
    }

    constructor(address _owner) Ownable(_owner) {}

    /**
     * @dev Authorizes a contract (e.g., SmartWallet) to register session keys.
     */
    function setAuthorizedCaller(address caller, bool authorized) external onlyOwner {
        authorizedCallers[caller] = authorized;
    }

    /**
     * @inheritdoc ISSORegistry
     */
    function registerSessionKey(
        address signer,
        uint48 validAfter,
        uint48 validUntil,
        uint256 permissions
    ) external override {
        _registerSessionKey(msg.sender, signer, validAfter, validUntil, permissions);
    }

    /**
     * @dev Register a session key for a specific wallet. Only callable by the wallet itself or authorized callers.
     */
    function registerSessionKeyFor(
        address wallet,
        address signer,
        uint48 validAfter,
        uint48 validUntil,
        uint256 permissions
    ) external onlyWalletOwnerOrAuthorized(wallet) {
        _registerSessionKey(wallet, signer, validAfter, validUntil, permissions);
    }

    /**
     * @inheritdoc ISSORegistry
     */
    function revokeSessionKey(address signer) external override {
        _revokeSessionKey(msg.sender, signer);
    }

    /**
     * @dev Revoke a session key for a specific wallet.
     */
    function revokeSessionKeyFor(
        address wallet,
        address signer
    ) external onlyWalletOwnerOrAuthorized(wallet) {
        _revokeSessionKey(wallet, signer);
    }

    /**
     * @inheritdoc ISSORegistry
     */
    function validateSessionKey(
        address wallet,
        address signer,
        uint256 requiredPermissions
    ) external view override returns (bool) {
        SessionKey storage key = _sessionKeys[wallet][signer];

        if (!key.active) return false;
        if (block.timestamp < key.validAfter) return false;
        if (block.timestamp > key.validUntil) return false;
        if ((key.permissions & requiredPermissions) != requiredPermissions) return false;

        return true;
    }

    /**
     * @inheritdoc ISSORegistry
     */
    function getSessionKey(address wallet, address signer) external view override returns (SessionKey memory) {
        return _sessionKeys[wallet][signer];
    }

    /**
     * @inheritdoc ISSORegistry
     */
    function getActiveSigners(address wallet) external view override returns (address[] memory) {
        address[] storage signers = _walletSigners[wallet];
        uint256 count = 0;

        // Count active signers
        for (uint256 i = 0; i < signers.length; i++) {
            SessionKey storage key = _sessionKeys[wallet][signers[i]];
            if (key.active && block.timestamp >= key.validAfter && block.timestamp <= key.validUntil) {
                count++;
            }
        }

        // Build result array
        address[] memory activeSigners = new address[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < signers.length; i++) {
            SessionKey storage key = _sessionKeys[wallet][signers[i]];
            if (key.active && block.timestamp >= key.validAfter && block.timestamp <= key.validUntil) {
                activeSigners[idx] = signers[i];
                idx++;
            }
        }

        return activeSigners;
    }

    // =========================================================================
    // Internal
    // =========================================================================

    function _registerSessionKey(
        address wallet,
        address signer,
        uint48 validAfter,
        uint48 validUntil,
        uint256 permissions
    ) internal {
        if (signer == address(0)) revert InvalidSigner();
        if (validUntil <= validAfter) revert InvalidDuration();
        if (validUntil - validAfter > MAX_SESSION_DURATION) revert InvalidDuration();
        if (permissions == 0 || permissions > PERMISSION_ALL) revert InvalidPermissions();

        SessionKey storage existing = _sessionKeys[wallet][signer];
        if (existing.active) revert SessionKeyAlreadyExists(signer);

        if (_walletSigners[wallet].length >= MAX_KEYS_PER_WALLET) {
            revert MaxSessionKeysReached(wallet);
        }

        _sessionKeys[wallet][signer] = SessionKey({
            signer: signer,
            validAfter: validAfter,
            validUntil: validUntil,
            permissions: permissions,
            active: true
        });

        _signerIndex[wallet][signer] = _walletSigners[wallet].length;
        _walletSigners[wallet].push(signer);

        emit SessionKeyRegistered(wallet, signer, validAfter, validUntil, permissions);
    }

    function _revokeSessionKey(address wallet, address signer) internal {
        SessionKey storage key = _sessionKeys[wallet][signer];
        if (!key.active) revert SessionKeyNotFound(signer);

        key.active = false;

        // Swap-and-pop from the signers array
        uint256 index = _signerIndex[wallet][signer];
        uint256 lastIndex = _walletSigners[wallet].length - 1;

        if (index != lastIndex) {
            address lastSigner = _walletSigners[wallet][lastIndex];
            _walletSigners[wallet][index] = lastSigner;
            _signerIndex[wallet][lastSigner] = index;
        }

        _walletSigners[wallet].pop();
        delete _signerIndex[wallet][signer];

        emit SessionKeyRevoked(wallet, signer);
    }
}
