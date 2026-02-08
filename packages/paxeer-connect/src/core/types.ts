// ── Core SDK Types ───────────────────────────────────────────────────────────

export type Address = `0x${string}`;
export type Hex = `0x${string}`;

// ── Permission Flags ─────────────────────────────────────────────────────────

export type PermissionFlag =
  | 'EXECUTE'
  | 'EXECUTE_BATCH'
  | 'TRANSFER_ETH'
  | 'TRANSFER_ERC20'
  | 'CALL_CONTRACT';

// ── Client Configuration ─────────────────────────────────────────────────────

export interface PaxeerClientConfig {
  /** Protocol name shown in session key context, e.g. "Paxeer DEX" */
  appName: string;
  /** Unique protocol identifier used to scope session key storage */
  appId: string;
  /** Permissions this protocol requires from the SmartWallet */
  permissions: PermissionFlag[];
  /** Session key duration in seconds. Default: 86400 (24h). Max: 2592000 (30d) */
  sessionDuration?: number;
  /** Override default contract addresses (useful for testnet) */
  contracts?: {
    walletFactory?: Address;
    ssoRegistry?: Address;
    eventEmitter?: Address;
  };
  /** Override default RPC URL */
  rpcUrl?: string;
  /** Auto-connect session on initialization if a valid key exists */
  autoReconnect?: boolean;
}

// ── Wallet ───────────────────────────────────────────────────────────────────

export interface WalletMetadata {
  argusId: string;
  onchainId: Address;
  userAlias: string;
  telegram: string;
  twitter: string;
  website: string;
  github: string;
  discord: string;
}

export interface PaxeerWallet {
  /** The user's EOA address (MetaMask / injected provider) */
  owner: Address;
  /** The SmartWallet contract address holding the user's funds */
  smartWallet: Address;
  /** On-chain wallet metadata */
  metadata: WalletMetadata;
  /** Current transaction nonce */
  nonce: bigint;
  /** Native token balance in the SmartWallet */
  nativeBalance: bigint;
  /** Whether the wallet is currently connected */
  isConnected: boolean;
}

// ── Transactions ─────────────────────────────────────────────────────────────

export interface TxRequest {
  /** Target contract address */
  to: Address;
  /** Calldata (encoded function call). Defaults to '0x' for plain transfers */
  data?: Hex;
  /** Native value to send in wei. Defaults to 0n */
  value?: bigint;
}

export interface TxResult {
  /** Transaction hash */
  hash: Hex;
  /** SmartWallet nonce for this execution */
  nonce: bigint;
  /** Whether the inner execution succeeded */
  success: boolean;
  /** Return data from the executed call */
  returnData: Hex;
}

// ── Session Keys ─────────────────────────────────────────────────────────────

export interface SessionInfo {
  /** Ephemeral session key public address (the signer) */
  signer: Address;
  /** Permission bitmask registered on-chain */
  permissions: number;
  /** Unix timestamp — session is valid after this time */
  validAfter: number;
  /** Unix timestamp — session expires at this time */
  validUntil: number;
  /** Whether the session is currently active and within validity window */
  isActive: boolean;
  /** The appId that created this session */
  appId: string;
}

export interface StoredSessionKey {
  /** Ephemeral private key (hex, encrypted at rest) */
  privateKey: Hex;
  /** Ephemeral public address */
  signer: Address;
  /** SmartWallet this session key is registered for */
  smartWallet: Address;
  /** Permission bitmask */
  permissions: number;
  /** Unix timestamp */
  validAfter: number;
  /** Unix timestamp */
  validUntil: number;
  /** Protocol appId */
  appId: string;
}

// ── Events ───────────────────────────────────────────────────────────────────

export type PaxeerEvent =
  | 'connected'
  | 'disconnected'
  | 'sessionCreated'
  | 'sessionExpired'
  | 'txSubmitted'
  | 'txConfirmed'
  | 'txFailed'
  | 'error';

export type PaxeerEventMap = {
  connected: PaxeerWallet;
  disconnected: void;
  sessionCreated: SessionInfo;
  sessionExpired: SessionInfo;
  txSubmitted: TxResult;
  txConfirmed: TxResult;
  txFailed: { tx: TxRequest; error: Error };
  error: Error;
};

// ── EIP-1193 Provider (minimal interface) ────────────────────────────────────

export interface EIP1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?(event: string, handler: (...args: unknown[]) => void): void;
  removeListener?(event: string, handler: (...args: unknown[]) => void): void;
}
