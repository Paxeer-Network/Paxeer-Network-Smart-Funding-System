// ── Core SDK Barrel Export ────────────────────────────────────────────────────

export { PaxeerClient, createPaxeerClient } from './client';
export { WalletAdapter, paxeerChain } from './wallet-adapter';
export { SessionManager } from './session-manager';
export { TransactionRouter } from './transaction-router';
export { GasAbstractor, type GasStatus } from './gas-abstractor';

export {
  PERMISSIONS,
  MAX_SESSION_DURATION,
  MAX_KEYS_PER_WALLET,
  DEFAULT_SESSION_DURATION,
  permissionsToBitmask,
  bitmaskToPermissions,
  hasPermissions,
} from './permissions';

export {
  computeDomainSeparator,
  buildExecuteStructHash,
  buildExecuteDigest,
} from './eip712';

export {
  PaxeerError,
  WalletNotFoundError,
  WalletNotConnectedError,
  SessionExpiredError,
  SessionNotFoundError,
  InsufficientPermissionsError,
  InsufficientBalanceError,
  TransactionFailedError,
  ProviderError,
  ChainMismatchError,
} from './errors';

export type {
  Address,
  Hex,
  PermissionFlag,
  PaxeerClientConfig,
  PaxeerWallet,
  WalletMetadata,
  TxRequest,
  TxResult,
  SessionInfo,
  StoredSessionKey,
  EIP1193Provider,
  PaxeerEvent,
  PaxeerEventMap,
} from './types';
