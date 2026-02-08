const SUBGRAPH_URL =
  import.meta.env.VITE_SUBGRAPH_URL ||
  "http://localhost:8000/subgraphs/name/paxeer/smart-wallets";

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors) {
    throw new Error(json.errors[0]?.message || "Subgraph query failed");
  }
  return json.data as T;
}

// ── Types ────────────────────────────────────────────────────────────────

export interface SubgraphTransaction {
  id: string;
  wallet: string;
  to: string;
  value: string;
  nonce: string;
  success: boolean;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface SubgraphWalletCreated {
  id: string;
  owner: string;
  wallet: string;
  salt: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface SubgraphWalletAssigned {
  id: string;
  wallet: string;
  owner: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface SubgraphWalletPreDeployed {
  id: string;
  wallet: string;
  index: string;
  blockTimestamp: string;
}

export interface SubgraphSessionKey {
  id: string;
  wallet: string;
  signer: string;
  validAfter: string;
  validUntil: string;
  permissions: string;
  blockTimestamp: string;
}

export interface WalletStats {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  totalValueSent: string;
  recentTransactions: SubgraphTransaction[];
}

// ── Queries ──────────────────────────────────────────────────────────────

export async function getWalletTransactions(
  walletAddress: string,
  first = 50,
): Promise<SubgraphTransaction[]> {
  const data = await gql<{
    eventEmitterTransactionExecuteds: SubgraphTransaction[];
  }>(
    `query WalletTxs($wallet: Bytes!, $first: Int!) {
      eventEmitterTransactionExecuteds(
        where: { wallet: $wallet }
        orderBy: blockTimestamp
        orderDirection: desc
        first: $first
      ) {
        id
        wallet
        to
        value
        nonce
        success
        blockNumber
        blockTimestamp
        transactionHash
      }
    }`,
    { wallet: walletAddress.toLowerCase(), first },
  );
  return data.eventEmitterTransactionExecuteds;
}

export async function getWalletStats(
  walletAddress: string,
): Promise<WalletStats> {
  const txs = await getWalletTransactions(walletAddress, 100);
  const successful = txs.filter((t) => t.success);
  const failed = txs.filter((t) => !t.success);
  const totalValue = txs.reduce(
    (sum, t) => sum + BigInt(t.value),
    0n,
  );

  return {
    totalTransactions: txs.length,
    successfulTransactions: successful.length,
    failedTransactions: failed.length,
    totalValueSent: totalValue.toString(),
    recentTransactions: txs.slice(0, 20),
  };
}

export async function getGlobalStats(): Promise<{
  totalWallets: number;
  totalTransactions: number;
  recentWallets: SubgraphWalletCreated[];
  recentAssignments: SubgraphWalletAssigned[];
  recentPreDeploys: SubgraphWalletPreDeployed[];
}> {
  // First query: get counts via pagination cursors (skip-based counting)
  // This avoids fetching 1000+ IDs just to count them.
  const countData = await gql<{
    walletCount: { id: string }[];
    preDeployCount: { id: string }[];
    txCount: { id: string }[];
  }>(
    `{
      walletCount: walletFactoryWalletCreateds(first: 1, orderBy: blockTimestamp, orderDirection: desc) { id }
      preDeployCount: walletFactoryWalletPreDeployeds(first: 1, orderBy: blockTimestamp, orderDirection: desc) { id }
      txCount: eventEmitterTransactionExecuteds(first: 1, orderBy: blockTimestamp, orderDirection: desc) { id }
    }`,
  );

  // Get recent items for display
  const data = await gql<{
    walletFactoryWalletCreateds: SubgraphWalletCreated[];
    walletFactoryWalletAssigneds: SubgraphWalletAssigned[];
    walletFactoryWalletPreDeployeds: SubgraphWalletPreDeployed[];
  }>(
    `{
      walletFactoryWalletCreateds(orderBy: blockTimestamp, orderDirection: desc, first: 10) {
        id owner wallet salt blockTimestamp transactionHash
      }
      walletFactoryWalletAssigneds(orderBy: blockTimestamp, orderDirection: desc, first: 10) {
        id wallet owner blockTimestamp transactionHash
      }
      walletFactoryWalletPreDeployeds(orderBy: blockTimestamp, orderDirection: desc, first: 10) {
        id wallet index blockTimestamp
      }
    }`,
  );

  // Use _meta or aggregate entities if available. For now, use the recent lists
  // as a lower bound. The subgraph should define counter entities for true totals.
  const totalWallets =
    data.walletFactoryWalletCreateds.length +
    data.walletFactoryWalletPreDeployeds.length;

  return {
    totalWallets,
    totalTransactions: countData.txCount.length > 0 ? -1 : 0, // -1 = "has txs, count unavailable"
    recentWallets: data.walletFactoryWalletCreateds,
    recentAssignments: data.walletFactoryWalletAssigneds,
    recentPreDeploys: data.walletFactoryWalletPreDeployeds,
  };
}

export async function getSessionKeys(
  walletAddress: string,
): Promise<SubgraphSessionKey[]> {
  const data = await gql<{
    ssoregistrySessionKeyRegistereds: SubgraphSessionKey[];
  }>(
    `query Keys($wallet: Bytes!) {
      ssoregistrySessionKeyRegistereds(
        where: { wallet: $wallet }
        orderBy: blockTimestamp
        orderDirection: desc
        first: 20
      ) {
        id wallet signer validAfter validUntil permissions blockTimestamp
      }
    }`,
    { wallet: walletAddress.toLowerCase() },
  );
  return data.ssoregistrySessionKeyRegistereds;
}
