/**
 * Paxeer-specific type declarations.
 * Shared domain types used across multiple workspaces.
 */

/** Paxeer Network constants */
declare const PAXEER_CHAIN_ID = 125;
declare const PAXEER_RPC_URL = "https://public-rpc.paxeer.app/rpc";

/** Smart Wallet metadata stored on-chain */
interface SmartWalletMetadata {
  argusId: string;
  onchainId: string;
  userAlias: string;
  socials: string;
}

/** User record from the backend database */
interface PaxeerUser {
  id: string;
  address: string;
  email?: string;
  chainType: "evm" | "solana";
  network: string;
  chainId: number;
  eligible: boolean;
  signupComplete: boolean;
  smartWallet?: string;
  funded: boolean;
  argusId?: string;
  createdAt: string;
  updatedAt: string;
}

/** Session key stored in SSORegistry */
interface SessionKey {
  key: Address;
  wallet: Address;
  permissions: bigint;
  expiry: number;
  appId: string;
}

/** Token holding from user-stats API */
interface TokenHolding {
  contract_address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance_raw: string;
  balance: string;
  price_usd: string;
  value_usd: string;
  icon_url?: string;
}

/** Transaction item from user-stats API */
interface TransactionItem {
  tx_hash: string;
  block_number: number;
  timestamp: string;
  from_address: string;
  to_address: string;
  value: string;
  value_raw: string;
  gas_used: string;
  gas_price: string;
  gas_fee: string;
  status: boolean;
  direction: "in" | "out" | "self";
  tx_type: string;
}
