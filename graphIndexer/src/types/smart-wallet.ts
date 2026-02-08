// ── SmartWallet Types ──────────────────────────────────────────────

export type SmartWalletDOMAINSEPARATORReturn = `0x${string}`;

export type SmartWalletDOMAINTYPEHASHReturn = `0x${string}`;

export type SmartWalletEXECUTETYPEHASHReturn = `0x${string}`;

export type SmartWalletEventEmitterReturn = `0x${string}`;

export type SmartWalletFactoryReturn = `0x${string}`;

export type SmartWalletGetBalanceReturn = bigint;

export type SmartWalletGetMetadataReturn = {
  argusId: string;
  onchainId: `0x${string}`;
  userAlias: string;
  telegram: string;
  twitter: string;
  website: string;
  github: string;
  discord: string;
};

export type SmartWalletGetNonceReturn = bigint;

export interface SmartWalletGetTokenBalanceArgs {
  token: `0x${string}`;
}

export type SmartWalletGetTokenBalanceReturn = bigint;

export interface SmartWalletGetTransactionArgs {
  txNonce: bigint;
}

export type SmartWalletGetTransactionReturn = {
  to: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
  nonce: bigint;
  timestamp: bigint;
  success: boolean;
};

export type SmartWalletIsAssignedReturn = boolean;

export type SmartWalletPausedReturn = boolean;

export type SmartWalletSsoRegistryReturn = `0x${string}`;

export type SmartWalletWalletOwnerReturn = `0x${string}`;

export interface SmartWalletAssignOwnerArgs {
  newOwner: `0x${string}`;
}

export interface SmartWalletExecuteArgs {
  to: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
}

export type SmartWalletExecuteReturn = `0x${string}`;

export interface SmartWalletExecuteBatchArgs {
  targets: readonly `0x${string}`[];
  values: readonly bigint[];
  datas: readonly `0x${string}`[];
}

export type SmartWalletExecuteBatchReturn = readonly `0x${string}`[];

export interface SmartWalletExecuteWithSignatureArgs {
  to: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
  deadline: bigint;
  signature: `0x${string}`;
}

export type SmartWalletExecuteWithSignatureReturn = `0x${string}`;

export interface SmartWalletInitializeArgs {
  owner_: `0x${string}`;
  eventEmitter_: `0x${string}`;
  ssoRegistry_: `0x${string}`;
}

export interface SmartWalletSetMetadataArgs {
  metadata_: {
    argusId: string;
    onchainId: `0x${string}`;
    userAlias: string;
    telegram: string;
    twitter: string;
    website: string;
    github: string;
    discord: string;
  };
}

export interface SmartWalletTransferOwnershipArgs {
  newOwner: `0x${string}`;
}

export interface SmartWalletBatchExecutedEvent {
  count: bigint;
  startNonce: bigint;
}

export interface SmartWalletExecutedEvent {
  to: `0x${string}`; /* indexed */
  value: bigint;
  nonce: bigint;
  success: boolean;
}

export interface SmartWalletMetadataUpdatedEvent {
  argusId: string;
  onchainId: `0x${string}`; /* indexed */
  userAlias: string;
}

export interface SmartWalletOwnerAssignedEvent {
  owner: `0x${string}`; /* indexed */
}

export interface SmartWalletPausedEvent {
  account: `0x${string}`;
}

export interface SmartWalletReceivedEvent {
  from: `0x${string}`; /* indexed */
  value: bigint;
}

export interface SmartWalletSessionKeyAuthorizedEvent {
  signer: `0x${string}`; /* indexed */
}

export interface SmartWalletSessionKeyRevokedEvent {
  signer: `0x${string}`; /* indexed */
}

export interface SmartWalletUnpausedEvent {
  account: `0x${string}`;
}

export interface SmartWalletCallerNotFactoryError {
  caller: `0x${string}`;
}

export interface SmartWalletECDSAInvalidSignatureLengthError {
  length: bigint;
}

export interface SmartWalletECDSAInvalidSignatureSError {
  s: `0x${string}`;
}

export interface SmartWalletExecutionFailedError {
  to: `0x${string}`;
  value: bigint;
  data: `0x${string}`;
}

export interface SmartWalletExpiredDeadlineError {
  deadline: bigint;
}

export interface SmartWalletInsufficientBalanceError {
  required: bigint;
  available: bigint;
}

export interface SmartWalletUnauthorizedCallerError {
  caller: `0x${string}`;
}
