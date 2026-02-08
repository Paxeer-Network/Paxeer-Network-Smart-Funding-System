// ── WalletFactory Types ──────────────────────────────────────────────

export type WalletFactoryEventEmitterReturn = `0x${string}`;

export interface WalletFactoryGetWalletArgs {
  owner_: `0x${string}`;
}

export type WalletFactoryGetWalletReturn = `0x${string}`;

export type WalletFactoryImplementationReturn = `0x${string}`;

export interface WalletFactoryIsWalletArgs {
  wallet: `0x${string}`;
}

export type WalletFactoryIsWalletReturn = boolean;

export type WalletFactoryOwnerReturn = `0x${string}`;

export type WalletFactoryPausedReturn = boolean;

export interface WalletFactoryPredictWalletAddressArgs {
  owner_: `0x${string}`;
  salt: `0x${string}`;
}

export type WalletFactoryPredictWalletAddressReturn = `0x${string}`;

export type WalletFactorySsoRegistryReturn = `0x${string}`;

export type WalletFactoryTotalWalletsReturn = bigint;

export interface WalletFactoryUnassignedWalletAtArgs {
  index: bigint;
}

export type WalletFactoryUnassignedWalletAtReturn = `0x${string}`;

export type WalletFactoryUnassignedWalletCountReturn = bigint;

export interface WalletFactoryAssignWalletArgs {
  wallet: `0x${string}`;
  newOwner: `0x${string}`;
}

export interface WalletFactoryCreateWalletArgs {
  owner_: `0x${string}`;
}

export type WalletFactoryCreateWalletReturn = `0x${string}`;

export interface WalletFactoryCreateWalletWithSaltArgs {
  owner_: `0x${string}`;
  salt: `0x${string}`;
}

export type WalletFactoryCreateWalletWithSaltReturn = `0x${string}`;

export interface WalletFactoryDeployWalletsArgs {
  count: bigint;
}

export type WalletFactoryDeployWalletsReturn = readonly `0x${string}`[];

export interface WalletFactorySetEventEmitterArgs {
  newEventEmitter: `0x${string}`;
}

export interface WalletFactorySetImplementationArgs {
  newImplementation: `0x${string}`;
}

export interface WalletFactorySetSSORegistryArgs {
  newSSORegistry: `0x${string}`;
}

export interface WalletFactoryTransferOwnershipArgs {
  newOwner: `0x${string}`;
}

export interface WalletFactoryOwnershipTransferredEvent {
  previousOwner: `0x${string}`; /* indexed */
  newOwner: `0x${string}`; /* indexed */
}

export interface WalletFactoryPausedEvent {
  account: `0x${string}`;
}

export interface WalletFactoryUnpausedEvent {
  account: `0x${string}`;
}

export interface WalletFactoryWalletAssignedEvent {
  wallet: `0x${string}`; /* indexed */
  owner: `0x${string}`; /* indexed */
}

export interface WalletFactoryWalletCreatedEvent {
  owner: `0x${string}`; /* indexed */
  wallet: `0x${string}`; /* indexed */
  salt: `0x${string}`;
}

export interface WalletFactoryWalletPreDeployedEvent {
  wallet: `0x${string}`; /* indexed */
  index: bigint;
}

export interface WalletFactoryOwnableInvalidOwnerError {
  owner: `0x${string}`;
}

export interface WalletFactoryOwnableUnauthorizedAccountError {
  account: `0x${string}`;
}

export interface WalletFactoryWalletAlreadyExistsError {
  owner: `0x${string}`;
  existingWallet: `0x${string}`;
}

export interface WalletFactoryWalletNotFromFactoryError {
  wallet: `0x${string}`;
}

export interface WalletFactoryWalletNotUnassignedError {
  wallet: `0x${string}`;
}
