// ── usePaxeerTransaction Hook ────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { usePaxeerContext } from './context';
import type { TxRequest, TxResult } from '../core';

export interface UsePaxeerTransactionReturn {
  /** Execute a single transaction through the SmartWallet */
  execute: (tx: TxRequest) => Promise<TxResult>;
  /** Execute a batch of transactions atomically */
  executeBatch: (txs: TxRequest[]) => Promise<TxResult[]>;
  /** Whether a transaction is currently pending */
  pending: boolean;
  /** The last transaction result */
  lastTx: TxResult | null;
  /** Last transaction error, if any */
  error: string | null;
  /** Reset error and lastTx state */
  reset: () => void;
}

/**
 * React hook for executing transactions through the SmartWallet.
 * Handles loading states, error tracking, and result caching.
 *
 * @example
 * ```tsx
 * function SwapButton({ tokenIn, tokenOut, amount }) {
 *   const { executeBatch, pending, error } = usePaxeerTransaction()
 *
 *   async function handleSwap() {
 *     await executeBatch([
 *       { to: tokenIn, data: approveData },
 *       { to: dexRouter, data: swapData },
 *     ])
 *   }
 *
 *   return (
 *     <button onClick={handleSwap} disabled={pending}>
 *       {pending ? 'Swapping...' : 'Swap'}
 *     </button>
 *   )
 * }
 * ```
 */
export function usePaxeerTransaction(): UsePaxeerTransactionReturn {
  const client = usePaxeerContext();
  const [pending, setPending] = useState(false);
  const [lastTx, setLastTx] = useState<TxResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (tx: TxRequest): Promise<TxResult> => {
      setPending(true);
      setError(null);
      try {
        const result = await client.execute(tx);
        setLastTx(result);
        return result;
      } catch (err: any) {
        const msg = err?.message ?? 'Transaction failed';
        setError(msg);
        throw err;
      } finally {
        setPending(false);
      }
    },
    [client],
  );

  const executeBatch = useCallback(
    async (txs: TxRequest[]): Promise<TxResult[]> => {
      setPending(true);
      setError(null);
      try {
        const results = await client.executeBatch(txs);
        if (results.length > 0) {
          setLastTx(results[results.length - 1]);
        }
        return results;
      } catch (err: any) {
        const msg = err?.message ?? 'Batch transaction failed';
        setError(msg);
        throw err;
      } finally {
        setPending(false);
      }
    },
    [client],
  );

  const reset = useCallback(() => {
    setLastTx(null);
    setError(null);
  }, []);

  return {
    execute,
    executeBatch,
    pending,
    lastTx,
    error,
    reset,
  };
}
