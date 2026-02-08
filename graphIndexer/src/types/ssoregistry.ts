// ── SSORegistry Types ──────────────────────────────────────────────

export type SSORegistryMAXKEYSPERWALLETReturn = bigint;

export type SSORegistryMAXSESSIONDURATIONReturn = bigint;

export type SSORegistryPERMISSIONALLReturn = bigint;

export type SSORegistryPERMISSIONCALLCONTRACTReturn = bigint;

export type SSORegistryPERMISSIONEXECUTEReturn = bigint;

export type SSORegistryPERMISSIONEXECUTEBATCHReturn = bigint;

export type SSORegistryPERMISSIONTRANSFERERC20Return = bigint;

export type SSORegistryPERMISSIONTRANSFERETHReturn = bigint;

export interface SSORegistryAuthorizedCallersArgs {
  arg0: `0x${string}`;
}

export type SSORegistryAuthorizedCallersReturn = boolean;

export interface SSORegistryGetActiveSignersArgs {
  wallet: `0x${string}`;
}

export type SSORegistryGetActiveSignersReturn = readonly `0x${string}`[];

export interface SSORegistryGetSessionKeyArgs {
  wallet: `0x${string}`;
  signer: `0x${string}`;
}

export type SSORegistryGetSessionKeyReturn = {
  signer: `0x${string}`;
  validAfter: bigint;
  validUntil: bigint;
  permissions: bigint;
  active: boolean;
};

export type SSORegistryOwnerReturn = `0x${string}`;

export interface SSORegistryValidateSessionKeyArgs {
  wallet: `0x${string}`;
  signer: `0x${string}`;
  requiredPermissions: bigint;
}

export type SSORegistryValidateSessionKeyReturn = boolean;

export interface SSORegistryRegisterSessionKeyArgs {
  signer: `0x${string}`;
  validAfter: bigint;
  validUntil: bigint;
  permissions: bigint;
}

export interface SSORegistryRegisterSessionKeyForArgs {
  wallet: `0x${string}`;
  signer: `0x${string}`;
  validAfter: bigint;
  validUntil: bigint;
  permissions: bigint;
}

export interface SSORegistryRevokeSessionKeyArgs {
  signer: `0x${string}`;
}

export interface SSORegistryRevokeSessionKeyForArgs {
  wallet: `0x${string}`;
  signer: `0x${string}`;
}

export interface SSORegistrySetAuthorizedCallerArgs {
  caller: `0x${string}`;
  authorized: boolean;
}

export interface SSORegistryTransferOwnershipArgs {
  newOwner: `0x${string}`;
}

export interface SSORegistryOwnershipTransferredEvent {
  previousOwner: `0x${string}`; /* indexed */
  newOwner: `0x${string}`; /* indexed */
}

export interface SSORegistrySessionKeyRegisteredEvent {
  wallet: `0x${string}`; /* indexed */
  signer: `0x${string}`; /* indexed */
  validAfter: bigint;
  validUntil: bigint;
  permissions: bigint;
}

export interface SSORegistrySessionKeyRevokedEvent {
  wallet: `0x${string}`; /* indexed */
  signer: `0x${string}`; /* indexed */
}

export interface SSORegistrySessionKeyUpdatedEvent {
  wallet: `0x${string}`; /* indexed */
  signer: `0x${string}`; /* indexed */
  validUntil: bigint;
  permissions: bigint;
}

export interface SSORegistryMaxSessionKeysReachedError {
  wallet: `0x${string}`;
}

export interface SSORegistryOwnableInvalidOwnerError {
  owner: `0x${string}`;
}

export interface SSORegistryOwnableUnauthorizedAccountError {
  account: `0x${string}`;
}

export interface SSORegistrySessionKeyAlreadyExistsError {
  signer: `0x${string}`;
}

export interface SSORegistrySessionKeyNotFoundError {
  signer: `0x${string}`;
}
