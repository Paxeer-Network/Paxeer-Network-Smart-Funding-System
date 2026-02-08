// ── EventEmitter Types ──────────────────────────────────────────────

export type EventEmitterFactoryReturn = `0x${string}`;

export interface EventEmitterIsRegisteredWalletArgs {
  wallet: `0x${string}`;
}

export type EventEmitterIsRegisteredWalletReturn = boolean;

export type EventEmitterOwnerReturn = `0x${string}`;

export type EventEmitterPausedReturn = boolean;

export type EventEmitterTotalTransactionsReturn = bigint;

export interface EventEmitterWalletOwnerOfArgs {
  wallet: `0x${string}`;
}

export type EventEmitterWalletOwnerOfReturn = `0x${string}`;

export interface EventEmitterDeregisterWalletArgs {
  wallet: `0x${string}`;
}

export interface EventEmitterEmitTransactionArgs {
  to: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
  txNonce: bigint;
  success: boolean;
  returnData: `0x${string}`;
}

export interface EventEmitterRegisterWalletArgs {
  wallet: `0x${string}`;
  walletOwner: `0x${string}`;
}

export interface EventEmitterSetFactoryArgs {
  _factory: `0x${string}`;
}

export interface EventEmitterTransferOwnershipArgs {
  newOwner: `0x${string}`;
}

export interface EventEmitterOwnershipTransferredEvent {
  previousOwner: `0x${string}`; /* indexed */
  newOwner: `0x${string}`; /* indexed */
}

export interface EventEmitterPausedEvent {
  account: `0x${string}`;
}

export interface EventEmitterTransactionExecutedEvent {
  wallet: `0x${string}`; /* indexed */
  to: `0x${string}`; /* indexed */
  value: bigint;
  data: `0x${string}`;
  nonce: bigint;
  timestamp: bigint;
  success: boolean;
  returnData: `0x${string}`;
}

export interface EventEmitterUnpausedEvent {
  account: `0x${string}`;
}

export interface EventEmitterWalletDeregisteredEvent {
  wallet: `0x${string}`; /* indexed */
}

export interface EventEmitterWalletRegisteredEvent {
  wallet: `0x${string}`; /* indexed */
  owner: `0x${string}`; /* indexed */
}

export interface EventEmitterOwnableInvalidOwnerError {
  owner: `0x${string}`;
}

export interface EventEmitterOwnableUnauthorizedAccountError {
  account: `0x${string}`;
}

export interface EventEmitterWalletAlreadyRegisteredError {
  wallet: `0x${string}`;
}

export interface EventEmitterWalletNotRegisteredError {
  wallet: `0x${string}`;
}
