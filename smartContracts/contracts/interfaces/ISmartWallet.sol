// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

/**
 * @title ISmartWallet
 * @dev Interface for the Paxeer Smart Wallet contract.
 */
interface ISmartWallet {
    struct TransactionRecord {
        address to;
        uint256 value;
        bytes data;
        uint256 nonce;
        uint256 timestamp;
        bool success;
    }

    struct WalletMetadata {
        string argusId;       // Required: UUID assigned by Paxeer system
        address onchainId;    // Required: user's self-custodial wallet that owns this SmartWallet
        string userAlias;     // Required: onchain username
        string telegram;      // Optional
        string twitter;       // Optional
        string website;       // Optional
        string github;        // Optional
        string discord;       // Optional
    }

    event Executed(address indexed to, uint256 value, uint256 nonce, bool success);
    event BatchExecuted(uint256 count, uint256 startNonce);
    event Received(address indexed from, uint256 value);
    event SessionKeyAuthorized(address indexed signer);
    event SessionKeyRevoked(address indexed signer);
    event OwnerAssigned(address indexed owner);
    event MetadataUpdated(string argusId, address indexed onchainId, string userAlias);

    /// @dev Initializes the wallet (called once by the factory).
    function initialize(
        address owner,
        address eventEmitter,
        address ssoRegistry
    ) external;

    /// @dev Executes a single transaction. Only callable by owner or authorized session key.
    function execute(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory);

    /// @dev Executes a batch of transactions atomically.
    function executeBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas
    ) external payable returns (bytes[] memory);

    /// @dev Executes a transaction via a signed message (meta-tx for SSO).
    function executeWithSignature(
        address to,
        uint256 value,
        bytes calldata data,
        uint256 deadline,
        bytes calldata signature
    ) external payable returns (bytes memory);

    /// @dev Returns the current nonce.
    function getNonce() external view returns (uint256);

    /// @dev Returns native balance held by this wallet.
    function getBalance() external view returns (uint256);

    /// @dev Returns an ERC20 token balance held by this wallet.
    function getTokenBalance(address token) external view returns (uint256);

    /// @dev Returns the transaction record at a given nonce.
    function getTransaction(uint256 txNonce) external view returns (TransactionRecord memory);

    /// @dev Returns the wallet owner.
    function walletOwner() external view returns (address);

    /// @dev Returns the domain separator for EIP-712 signing.
    function DOMAIN_SEPARATOR() external view returns (bytes32);

    /// @dev Assigns an owner to an unassigned wallet. Only callable by the factory.
    function assignOwner(address newOwner) external;

    /// @dev Sets or updates wallet metadata. Only callable by owner or factory.
    function setMetadata(WalletMetadata calldata metadata_) external;

    /// @dev Returns the wallet metadata.
    function getMetadata() external view returns (WalletMetadata memory);

    /// @dev Returns whether this wallet has been assigned to an owner.
    function isAssigned() external view returns (bool);
}
