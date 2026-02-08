import { CONFIG } from "../config.js";

// =========================================================================
// Chain ID → Moralis chain name mapping
// =========================================================================

const CHAIN_NAME_MAP: Record<number, string> = {
  1: "eth",
  137: "polygon",
  56: "bsc",
  43114: "avalanche",
  42161: "arbitrum",
  10: "optimism",
  8453: "base",
  250: "fantom",
  25: "cronos",
  100: "gnosis",
  2025: "eth", // Paxeer – fallback to eth for stats (won't be indexed)
};

function getChainName(chainId: number): string {
  return CHAIN_NAME_MAP[chainId] || `0x${chainId.toString(16)}`;
}

// =========================================================================
// EVM – get total transaction count via wallet stats endpoint
// GET https://deep-index.moralis.io/api/v2.2/wallets/{address}/stats?chain=
// Returns: { transactions: { total: "805" }, ... }
// =========================================================================

export interface EvmWalletStats {
  nfts: string;
  collections: string;
  transactions: { total: string };
  nft_transfers: { total: string };
  token_transfers: { total: string };
}

export async function getEvmTransactionCount(
  address: string,
  chainId: number,
): Promise<number> {
  const chain = getChainName(chainId);

  try {
    const resp = await fetch(
      `https://deep-index.moralis.io/api/v2.2/wallets/${address}/stats?chain=${chain}`,
      {
        headers: {
          accept: "application/json",
          "X-API-Key": CONFIG.moralisApiKey,
        },
      },
    );

    if (!resp.ok) {
      throw new Error(`Moralis EVM stats API returned ${resp.status}`);
    }

    const data = (await resp.json()) as EvmWalletStats;
    return parseInt(data.transactions?.total || "0", 10);
  } catch (err: any) {
    console.error(
      `Moralis EVM stats fetch failed for ${address} on chain ${chain}:`,
      err.message,
    );
    return 0;
  }
}

// =========================================================================
// Solana – get swap count via swaps endpoint
// GET https://solana-gateway.moralis.io/account/mainnet/{address}/swaps
// Returns: { result: [...], cursor, page, pageSize }
// We paginate until we have enough or run out of pages.
// =========================================================================

interface SolanaSwapResponse {
  result: unknown[];
  cursor: string | null;
  page: number;
  pageSize: number;
}

export async function getSolanaTransactionCount(
  address: string,
): Promise<number> {
  let total = 0;
  let cursor: string | null = null;
  const maxPages = 4; // up to 100 swaps (25 per page)

  try {
    for (let page = 0; page < maxPages; page++) {
      const url = new URL(
        `https://solana-gateway.moralis.io/account/mainnet/${address}/swaps`,
      );
      url.searchParams.set("limit", "25");
      url.searchParams.set("order", "DESC");
      url.searchParams.set("transactionTypes", "buy,sell");
      if (cursor) url.searchParams.set("cursor", cursor);

      const resp = await fetch(url.toString(), {
        headers: {
          accept: "application/json",
          "X-API-Key": CONFIG.moralisApiKey,
        },
      });

      if (!resp.ok) {
        throw new Error(`Moralis Solana swaps API returned ${resp.status}`);
      }

      const data = (await resp.json()) as SolanaSwapResponse;
      total += (data.result || []).length;

      // If we already have enough for eligibility, stop early
      if (total >= CONFIG.minQualityTransactions) break;

      // No more pages
      if (!data.cursor) break;
      cursor = data.cursor;
    }
  } catch (err: any) {
    console.error(
      `Moralis Solana swaps fetch failed for ${address}:`,
      err.message,
    );
  }

  return total;
}
