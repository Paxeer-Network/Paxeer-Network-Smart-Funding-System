// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../interfaces/IWalletFactory.sol";
import "../interfaces/ISmartWallet.sol";
import "../interfaces/IEventEmitter.sol";
import "../security/Ownable.sol";
import "../security/Pausable.sol";

/**
 * @title WalletFactory
 * @dev Factory contract for deploying SmartWallet instances as minimal proxy clones.
 *      Uses CREATE2 for deterministic wallet addresses.
 *      Maintains a registry of all deployed wallets and enforces one wallet per owner.
 *      Automatically registers each new wallet with the EventEmitter.
 */
contract WalletFactory is IWalletFactory, Ownable, Pausable {
    // =========================================================================
    // Storage
    // =========================================================================

    /// @dev SmartWallet implementation contract (the logic target for clones)
    address private _implementation;

    /// @dev EventEmitter contract address
    address private _eventEmitter;

    /// @dev SSO Registry contract address
    address private _ssoRegistry;

    /// @dev owner => wallet address
    mapping(address => address) private _ownerToWallet;

    /// @dev wallet address => is a factory-deployed wallet
    mapping(address => bool) private _isWallet;

    /// @dev Total number of wallets deployed (assigned + unassigned)
    uint256 private _totalWallets;

    /// @dev Array of unassigned pre-deployed wallet addresses
    address[] private _unassignedWallets;

    /// @dev wallet address => index in _unassignedWallets (1-indexed, 0 = not in array)
    mapping(address => uint256) private _unassignedIndex;

    /// @dev Running counter used as salt for pre-deployed wallets
    uint256 private _deployNonce;

    // =========================================================================
    // Errors
    // =========================================================================

    error WalletAlreadyExists(address owner, address existingWallet);
    error InvalidOwner();
    error InvalidImplementation();
    error CloneDeploymentFailed();
    error WalletNotUnassigned(address wallet);
    error InvalidBatchCount();
    error WalletNotFromFactory(address wallet);

    // =========================================================================
    // Constructor
    // =========================================================================

    constructor(
        address owner_,
        address implementation_,
        address eventEmitter_,
        address ssoRegistry_
    ) Ownable(owner_) {
        if (implementation_ == address(0)) revert InvalidImplementation();
        _implementation = implementation_;
        _eventEmitter = eventEmitter_;
        _ssoRegistry = ssoRegistry_;
    }

    // =========================================================================
    // Factory methods
    // =========================================================================

    /**
     * @inheritdoc IWalletFactory
     */
    function createWallet(address owner_) external override onlyOwner whenNotPaused returns (address wallet) {
        bytes32 salt = keccak256(abi.encodePacked(owner_));
        return _createWallet(owner_, salt);
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function createWalletWithSalt(
        address owner_,
        bytes32 salt
    ) external override onlyOwner whenNotPaused returns (address wallet) {
        return _createWallet(owner_, salt);
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function deployWallets(uint256 count) external override onlyOwner whenNotPaused returns (address[] memory wallets) {
        if (count == 0) revert InvalidBatchCount();

        wallets = new address[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 nonce = _deployNonce;
            unchecked { ++_deployNonce; }

            bytes32 salt = keccak256(abi.encodePacked("pre-deploy", nonce));
            bytes32 finalSalt = keccak256(abi.encodePacked(address(0), salt));

            // Deploy a minimal proxy clone via CREATE2
            address wallet = _cloneDeterministic(_implementation, finalSalt);

            // Initialize without an owner (address(0))
            ISmartWallet(wallet).initialize(address(0), _eventEmitter, _ssoRegistry);

            // Track as factory wallet
            _isWallet[wallet] = true;
            unchecked { ++_totalWallets; }

            // Add to unassigned pool
            _unassignedWallets.push(wallet);
            _unassignedIndex[wallet] = _unassignedWallets.length; // 1-indexed

            wallets[i] = wallet;

            emit WalletPreDeployed(wallet, _unassignedWallets.length - 1);
        }
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function assignWallet(
        address wallet,
        address newOwner
    ) external override onlyOwner whenNotPaused {
        if (newOwner == address(0)) revert InvalidOwner();
        if (!_isWallet[wallet]) revert WalletNotFromFactory(wallet);
        if (_unassignedIndex[wallet] == 0) revert WalletNotUnassigned(wallet);
        if (_ownerToWallet[newOwner] != address(0)) {
            revert WalletAlreadyExists(newOwner, _ownerToWallet[newOwner]);
        }

        // Remove from unassigned pool (swap-and-pop)
        uint256 idx = _unassignedIndex[wallet] - 1; // convert to 0-indexed
        uint256 lastIdx = _unassignedWallets.length - 1;
        if (idx != lastIdx) {
            address lastWallet = _unassignedWallets[lastIdx];
            _unassignedWallets[idx] = lastWallet;
            _unassignedIndex[lastWallet] = idx + 1; // keep 1-indexed
        }
        _unassignedWallets.pop();
        delete _unassignedIndex[wallet];

        // Assign owner on the wallet contract
        ISmartWallet(wallet).assignOwner(newOwner);

        // Map owner => wallet
        _ownerToWallet[newOwner] = wallet;

        // Register with EventEmitter
        IEventEmitter(_eventEmitter).registerWallet(wallet, newOwner);

        emit WalletAssigned(wallet, newOwner);
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function predictWalletAddress(
        address owner_,
        bytes32 salt
    ) external view override returns (address predicted) {
        bytes32 finalSalt = keccak256(abi.encodePacked(owner_, salt));
        bytes memory bytecode = _cloneBytecode(_implementation);
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), finalSalt, keccak256(bytecode))
        );
        return address(uint160(uint256(hash)));
    }

    // =========================================================================
    // Views
    // =========================================================================

    /**
     * @inheritdoc IWalletFactory
     */
    function getWallet(address owner_) external view override returns (address) {
        return _ownerToWallet[owner_];
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function isWallet(address wallet) external view override returns (bool) {
        return _isWallet[wallet];
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function totalWallets() external view override returns (uint256) {
        return _totalWallets;
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function unassignedWalletCount() external view override returns (uint256) {
        return _unassignedWallets.length;
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function unassignedWalletAt(uint256 index) external view override returns (address) {
        return _unassignedWallets[index];
    }

    /**
     * @inheritdoc IWalletFactory
     */
    function implementation() external view override returns (address) {
        return _implementation;
    }

    /**
     * @dev Returns the event emitter address.
     */
    function eventEmitter() external view returns (address) {
        return _eventEmitter;
    }

    /**
     * @dev Returns the SSO registry address.
     */
    function ssoRegistry() external view returns (address) {
        return _ssoRegistry;
    }

    // =========================================================================
    // Admin
    // =========================================================================

    /**
     * @dev Updates the SmartWallet implementation for future deployments.
     *      Does not affect already-deployed wallets.
     */
    function setImplementation(address newImplementation) external onlyOwner {
        if (newImplementation == address(0)) revert InvalidImplementation();
        _implementation = newImplementation;
    }

    /**
     * @dev Updates the EventEmitter address for future deployments.
     */
    function setEventEmitter(address newEventEmitter) external onlyOwner {
        _eventEmitter = newEventEmitter;
    }

    /**
     * @dev Updates the SSO Registry address for future deployments.
     */
    function setSSORegistry(address newSSORegistry) external onlyOwner {
        _ssoRegistry = newSSORegistry;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // =========================================================================
    // Internal
    // =========================================================================

    function _createWallet(address owner_, bytes32 salt) internal returns (address wallet) {
        if (owner_ == address(0)) revert InvalidOwner();
        if (_ownerToWallet[owner_] != address(0)) {
            revert WalletAlreadyExists(owner_, _ownerToWallet[owner_]);
        }

        bytes32 finalSalt = keccak256(abi.encodePacked(owner_, salt));

        // Deploy a minimal proxy clone via CREATE2
        wallet = _cloneDeterministic(_implementation, finalSalt);

        // Initialize the wallet
        ISmartWallet(wallet).initialize(owner_, _eventEmitter, _ssoRegistry);

        // Register in factory state
        _ownerToWallet[owner_] = wallet;
        _isWallet[wallet] = true;

        unchecked {
            ++_totalWallets;
        }

        // Register the wallet with the EventEmitter
        IEventEmitter(_eventEmitter).registerWallet(wallet, owner_);

        emit WalletCreated(owner_, wallet, salt);
    }

    /**
     * @dev Deploys a minimal proxy (EIP-1167 clone) using CREATE2.
     */
    function _cloneDeterministic(address impl, bytes32 salt) internal returns (address instance) {
        bytes memory bytecode = _cloneBytecode(impl);
        assembly {
            instance := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }
        if (instance == address(0)) revert CloneDeploymentFailed();
    }

    /**
     * @dev Returns the EIP-1167 minimal proxy bytecode for `impl`.
     */
    function _cloneBytecode(address impl) internal pure returns (bytes memory) {
        return abi.encodePacked(
            hex"3d602d80600a3d3981f3363d3d373d3d3d363d73",
            impl,
            hex"5af43d82803e903d91602b57fd5bf3"
        );
    }
}
