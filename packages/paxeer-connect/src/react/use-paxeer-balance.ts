// ── usePaxeerBalance Hook ────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { usePaxeerContext } from './context';
import type { Address } from '../core';

export interface UsePaxeerBalanceReturn {
  /** Native token balance (in wei) */
  native: bigint;
  /** Fetch a specific ERC-20 token balance */
  tokenBalance: (token: Address) => Promise<bigint>;
  /** Whether a balance fetch is in progress */
  loading: boolean;
  /** Refresh all balances */
  refresh: () => Promise<void>;
}

/**
 * React hook for querying SmartWallet balances.
 * Auto-fetches native balance on mount and after connection.
 *
 * @example
 * ```tsx
 * function BalanceDisplay() {
 *   const { native, tokenBalance, loading, refresh } = usePaxeerBalance()
 *   const [usdl, setUsdl] = useState(0n)
 *
 *   useEffect(() => {
 *     tokenBalance('0x7c69c84daAEe90B21eeCABDb8f0387897E9B7B37').then(setUsdl)
 *   }, [])
 *
 *   return (
 *     <div>
 *       <p>Native: {formatEther(native)}</p>
 *       <p>USDL: {formatUnits(usdl, 18)}</p>
 *       <button onClick={refresh} disabled={loading}>Refresh</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePaxeerBalance(): UsePaxeerBalanceReturn {
  const client = usePaxeerContext();
  const [native, setNative] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!client.isConnected()) return;
    setLoading(true);
    try {
      const balance = await client.getBalance();
      setNative(balance);
    } catch {
      // Silently fail — balance stays stale
    } finally {
      setLoading(false);
    }
  }, [client]);

  const tokenBalance = useCallback(
    async (token: Address): Promise<bigint> => {
      if (!client.isConnected()) return 0n;
      return client.getTokenBalance(token);
    },
    [client],
  );

  // Auto-fetch on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    native,
    tokenBalance,
    loading,
    refresh,
  };
}
