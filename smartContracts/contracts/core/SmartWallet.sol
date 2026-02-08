// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../interfaces/ISmartWallet.sol";
import "../interfaces/IEventEmitter.sol";
import "../interfaces/ISSORegistry.sol";
import "../interfaces/IERC20.sol";
import "../libraries/LibAddress.sol";
import "../libraries/LibECDSA.sol";
import "../security/ReentrancyGuard.sol";
import "../security/Pausable.sol";

/**
 * @title SmartWallet
 * @dev A contract-based wallet on the Paxeer EVM chain.
 *      Holds funds, executes transactions on behalf of the owner,
 *      tracks all transaction history, and reports every execution
 *      to the centralized EventEmitter for the network risk algorithm.
 *
 *      Supports:
 *      - Direct execution by the owner
 *      - Batch execution
 *      - Meta-transaction execution via SSO session key signatures
 *      - Native currency and ERC20 token management
 *      - Full transaction history tracking
 *
 *      Deployed as a minimal proxy (clone) by the WalletFactory.
 */
contract SmartWallet is ISmartWallet, ReentrancyGuard, Pausable {
    using LibAddress for address;
    using LibAddress for address payable;
    using LibECDSA for bytes32;

    // =========================================================================
    // Storage
    // =========================================================================

    /// @dev Wallet owner (the EOA that controls this wallet)
    address private _owner;

    /// @dev Centralized event emitter contract
    address private _eventEmitter;

    /// @dev SSO session key registry
    address private _ssoRegistry;

    /// @dev Factory contract that deployed this wallet
    address private _factory;

    /// @dev Transaction nonce (incremented after each execution)
    uint256 private _nonce;

    /// @dev Whether the wallet has been initialized
    bool private _initialized;

    /// @dev Transaction history: nonce => TransactionRecord
    mapping(uint256 => TransactionRecord) private _transactions;

    /// @dev EIP-712 domain separator (computed once at initialization)
    bytes32 private _domainSeparator;

    /// @dev Wallet metadata (ArgusID, OnchainID, UserAlias, socials)
    WalletMetadata private _metadata;

    // =========================================================================
    // Constants
    // =========================================================================

    /// @dev EIP-712 typehash for execute meta-transactions
    bytes32 public constant EXECUTE_TYPEHASH = keccak256(
        "Execute(address to,uint256 value,bytes data,uint256 nonce,uint256 deadline)"
    );

    /// @dev EIP-712 domain typehash
    bytes32 public constant DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    // =========================================================================
    // Errors
    // =========================================================================

    error AlreadyInitialized();
    error NotInitialized();
    error UnauthorizedCaller(address caller);
    error CallerNotFactory(address caller);
    error WalletAlreadyAssigned();
    error InvalidSignature();
    error ExpiredDeadline(uint256 deadline);
    error ArrayLengthMismatch();
    error ExecutionFailed(address to, uint256 value, bytes data);
    error InsufficientBalance(uint256 required, uint256 available);
    error InvalidMetadata();

    // =========================================================================
    // Modifiers
    // =========================================================================

    modifier onlyOwner() {
        if (msg.sender != _owner) {
            revert UnauthorizedCaller(msg.sender);
        }
        _;
    }

    modifier onlyFactory() {
        if (msg.sender != _factory) {
            revert CallerNotFactory(msg.sender);
        }
        _;
    }

    modifier onlyOwnerOrFactory() {
        if (msg.sender != _owner && msg.sender != _factory) {
            revert UnauthorizedCaller(msg.sender);
        }
        _;
    }

    modifier onlyOwnerOrSessionKey(uint256 requiredPermission) {
        if (msg.sender != _owner) {
            bool valid = ISSORegistry(_ssoRegistry).validateSessionKey(
                address(this),
                msg.sender,
                requiredPermission
            );
            if (!valid) {
                revert UnauthorizedCaller(msg.sender);
            }
        }
        _;
    }

    modifier onlyInitialized() {
        if (!_initialized) {
            revert NotInitialized();
        }
        _;
    }

    // =========================================================================
    // Initialization
    // =========================================================================

    /**
     * @dev Initializes the wallet. owner_ can be address(0) for pre-deployed wallets.
     *      msg.sender is stored as the factory for future privileged calls.
     */
    function initialize(
        address owner_,
        address eventEmitter_,
        address ssoRegistry_
    ) external override {
        if (_initialized) revert AlreadyInitialized();

        _owner = owner_;
        _eventEmitter = eventEmitter_;
        _ssoRegistry = ssoRegistry_;
        _factory = msg.sender;
        _initialized = true;

        _domainSeparator = keccak256(
            abi.encode(
                DOMAIN_TYPEHASH,
                keccak256("PaxeerSmartWallet"),
                keccak256("1"),
                block.chainid,
                address(this)
            )
        );
    }

    // =========================================================================
    // Execution
    // =========================================================================

    /**
     * @inheritdoc ISmartWallet
     */
    function execute(
        address to,
        uint256 value,
        bytes calldata data
    )
        external
        payable
        override
        onlyInitialized
        onlyOwnerOrSessionKey(1) // PERMISSION_EXECUTE
        nonReentrant
        whenNotPaused
        returns (bytes memory)
    {
        return _execute(to, value, data);
    }

    /**
     * @inheritdoc ISmartWallet
     */
    function executeBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas
    )
        external
        payable
        override
        onlyInitialized
        onlyOwnerOrSessionKey(2) // PERMISSION_EXECUTE_BATCH
        nonReentrant
        whenNotPaused
        returns (bytes[] memory results)
    {
        if (targets.length != values.length || targets.length != datas.length) {
            revert ArrayLengthMismatch();
        }

        results = new bytes[](targets.length);
        uint256 startNonce = _nonce;

        for (uint256 i = 0; i < targets.length; i++) {
            results[i] = _execute(targets[i], values[i], datas[i]);
        }

        emit BatchExecuted(targets.length, startNonce);
        return results;
    }

    /**
     * @inheritdoc ISmartWallet
     */
    function executeWithSignature(
        address to,
        uint256 value,
        bytes calldata data,
        uint256 deadline,
        bytes calldata signature
    )
        external
        payable
        override
        onlyInitialized
        nonReentrant
        whenNotPaused
        returns (bytes memory)
    {
        if (block.timestamp > deadline) {
            revert ExpiredDeadline(deadline);
        }

        // Build the EIP-712 digest
        bytes32 structHash = keccak256(
            abi.encode(
                EXECUTE_TYPEHASH,
                to,
                value,
                keccak256(data),
                _nonce,
                deadline
            )
        );
        bytes32 digest = LibECDSA.toTypedDataHash(_domainSeparator, structHash);
        address signer = digest.recover(signature);

        // Signer must be either the owner or a valid session key
        if (signer != _owner) {
            bool valid = ISSORegistry(_ssoRegistry).validateSessionKey(
                address(this),
                signer,
                1 // PERMISSION_EXECUTE
            );
            if (!valid) {
                revert InvalidSignature();
            }
        }

        return _execute(to, value, data);
    }

    // =========================================================================
    // Views
    // =========================================================================

    /**
     * @inheritdoc ISmartWallet
     */
    function getNonce() external view override returns (uint256) {
        return _nonce;
    }

    /**
     * @inheritdoc ISmartWallet
     */
    function getBalance() external view override returns (uint256) {
        return address(this).balance;
    }

    /**
     * @inheritdoc ISmartWallet
     */
    function getTokenBalance(address token) external view override returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    /**
     * @inheritdoc ISmartWallet
     */
    function getTransaction(uint256 txNonce) external view override returns (TransactionRecord memory) {
        return _transactions[txNonce];
    }

    /**
     * @inheritdoc ISmartWallet
     */
    function walletOwner() external view override returns (address) {
        return _owner;
    }

    /**
     * @inheritdoc ISmartWallet
     */
    function DOMAIN_SEPARATOR() external view override returns (bytes32) {
        return _domainSeparator;
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
    // Owner management
    // =========================================================================

    /**
     * @dev Transfers wallet ownership to a new address.
     */
    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert UnauthorizedCaller(address(0));
        _owner = newOwner;
    }

    /**
     * @dev Assigns an owner to an unassigned wallet. Only callable by the factory.
     *      Used in the pre-deploy + assign flow.
     */
    function assignOwner(address newOwner) external override onlyFactory {
        if (_owner != address(0)) revert WalletAlreadyAssigned();
        if (newOwner == address(0)) revert UnauthorizedCaller(address(0));
        _owner = newOwner;
        emit OwnerAssigned(newOwner);
    }

    /**
     * @dev Sets or updates wallet metadata. Callable by owner or factory.
     *      ArgusID, OnchainID, and UserAlias are required fields.
     */
    function setMetadata(WalletMetadata calldata metadata_) external override onlyOwnerOrFactory {
        if (bytes(metadata_.argusId).length == 0) revert InvalidMetadata();
        if (metadata_.onchainId == address(0)) revert InvalidMetadata();
        if (bytes(metadata_.userAlias).length == 0) revert InvalidMetadata();

        _metadata = metadata_;
        emit MetadataUpdated(metadata_.argusId, metadata_.onchainId, metadata_.userAlias);
    }

    /**
     * @dev Returns the wallet metadata.
     */
    function getMetadata() external view override returns (WalletMetadata memory) {
        return _metadata;
    }

    /**
     * @dev Returns whether this wallet has been assigned to an owner.
     */
    function isAssigned() external view override returns (bool) {
        return _owner != address(0);
    }

    /**
     * @dev Returns the factory address.
     */
    function factory() external view returns (address) {
        return _factory;
    }

    /**
     * @dev Pauses the wallet. Only callable by the owner.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the wallet. Only callable by the owner.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // =========================================================================
    // Receive
    // =========================================================================

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }

    // =========================================================================
    // Internal
    // =========================================================================

    /**
     * @dev Executes a single transaction, records it, and emits via the EventEmitter.
     */
    function _execute(
        address to,
        uint256 value,
        bytes calldata data
    ) internal returns (bytes memory) {
        uint256 currentNonce = _nonce;

        // Check balance for native transfers
        if (value > 0 && address(this).balance < value) {
            revert InsufficientBalance(value, address(this).balance);
        }

        // Execute the call
        (bool success, bytes memory returnData) = to.call{value: value}(data);

        // Record the transaction
        _transactions[currentNonce] = TransactionRecord({
            to: to,
            value: value,
            data: data,
            nonce: currentNonce,
            timestamp: block.timestamp,
            success: success
        });

        // Increment nonce
        unchecked {
            _nonce = currentNonce + 1;
        }

        // Emit the transaction event via the centralized EventEmitter
        // This is the hook for the risk algorithm
        IEventEmitter(_eventEmitter).emitTransaction(
            to,
            value,
            data,
            currentNonce,
            success,
            returnData
        );

        emit Executed(to, value, currentNonce, success);

        // Revert if the execution failed and no data was provided (simple transfer)
        if (!success && data.length == 0) {
            revert ExecutionFailed(to, value, data);
        }

        return returnData;
    }
}
