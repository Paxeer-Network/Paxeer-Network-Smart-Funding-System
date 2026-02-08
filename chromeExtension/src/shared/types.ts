/* ── Extension RPC Method Names ── */
export type PxMethod =
  | "px_connect"
  | "px_accounts"
  | "px_sendTransaction"
  | "px_signMessage"
  | "px_chainId"
  | "eth_chainId"
  | "eth_accounts"
  | "eth_requestAccounts"
  | "eth_sendTransaction"
  | "personal_sign";

/* ── Messages between content-script ↔ background ── */
export interface ExtensionRequest {
  id: string;
  method: PxMethod | InternalMethod;
  params: unknown[];
  origin: string;
}

export interface ExtensionResponse {
  id: string;
  result?: unknown;
  error?: { code: number; message: string };
}

/* ── Internal popup ↔ background messages ── */
export type InternalMethod =
  | "internal_unlock"
  | "internal_lock"
  | "internal_getState"
  | "internal_getBalances"
  | "internal_getActivity"
  | "internal_getConnectedApps"
  | "internal_approveOrigin"
  | "internal_revokeOrigin"
  | "internal_setup"
  | "internal_changePin"
  | "internal_clearData"
  | "internal_createWallet"
  | "internal_importMnemonic"
  | "internal_importPrivateKey"
  | "internal_exportMnemonic"
  | "internal_exportPrivateKey"
  | "internal_deriveAccount"
  | "internal_getAccounts"
  | "internal_setActiveAccount"
  | "internal_deleteAccount"
  | "internal_linkSmartWallet";

/* ── EOA Account ── */
export interface WalletAccount {
  address: string;
  name: string;
  derivationPath: string;
  accountIndex: number;
}

/* ── Secure wallet storage (mnemonic + private keys encrypted) ── */
export interface SecureWalletStorage {
  encryptedMnemonic: string | null;
  accounts: Array<{
    address: string;
    encryptedPrivateKey: string;
    name: string;
    derivationPath: string;
    accountIndex: number;
  }>;
  activeAddress: string | null;
  nextAccountIndex: number;
}

/* ── Stored wallet data (encrypted parts handled separately) ── */
export interface WalletMeta {
  smartWalletAddress: string;
  ownerAddress: string;
  argusId: string;
}

export interface SessionKeyMeta {
  validAfter: number;
  validUntil: number;
  permissions: string;
}

export interface StoredData {
  walletMeta: WalletMeta | null;
  sessionKeyMeta: SessionKeyMeta | null;
  encryptedSessionKey: string | null;
  salt: string | null;
  approvedOrigins: string[];
  lockTimeoutMinutes: number;
}

/* ── Background state exposed to popup ── */
export interface ExtensionState {
  isSetup: boolean;
  isUnlocked: boolean;
  walletMeta: WalletMeta | null;
  sessionKeyMeta: SessionKeyMeta | null;
  approvedOrigins: string[];
}

/* ── Balance / activity types ── */
export interface BalanceInfo {
  totalUsd: string;
  nativeBalance: string;
  nativeUsd: string;
  holdings: TokenHolding[];
  lastUpdated: number;
}

export interface TokenHolding {
  symbol: string;
  name: string;
  balance: string;
  valueUsd: string;
  iconUrl?: string;
}

export interface TxRecord {
  hash: string;
  type: string;
  direction: "in" | "out";
  value: string;
  from: string;
  to: string;
  status: boolean;
  timestamp: string;
  gasFee: string;
}

/* ── Provider postMessage envelope ── */
export const PAXEER_MSG_SOURCE = "paxeer-provider" as const;
export const PAXEER_MSG_RESPONSE = "paxeer-response" as const;

export interface ProviderMessage {
  source: typeof PAXEER_MSG_SOURCE;
  payload: ExtensionRequest;
}

export interface ProviderResponse {
  source: typeof PAXEER_MSG_RESPONSE;
  payload: ExtensionResponse;
}
