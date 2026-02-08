// ── Network / Chain Configuration ────────────────────────────────

export const PAXEER_NETWORK_CHAIN = {
  id: 125,
  name: 'Paxeer Network',
  rpc: 'https://public-rpc.paxeer.app/rpc',
  explorer: 'https://paxscan.paxeer.app',
} as const;

export const CHAINS = {
  125: PAXEER_NETWORK_CHAIN,
} as const;

export const RPC_URLS: Record<number, string> = {
  125: 'https://public-rpc.paxeer.app/rpc',
};

export const SUPPORTED_CHAIN_IDS = [125] as const;
export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number];
