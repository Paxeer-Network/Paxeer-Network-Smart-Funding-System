// ── usePaxeerTransaction Composable (Vue 3) ──────────────────────────────────

import { ref } from 'vue';
import { usePaxeerContext } from './plugin';
import type { TxRequest, TxResult } from '../core';

/**
 * Vue composable for executing transactions through the SmartWallet.
 *
 * @example
 * ```vue
 * <script setup>
 * import { usePaxeerTransaction } from '@paxeer/paxeer-connect/vue'
 *
 * const { execute, executeBatch, pending, error } = usePaxeerTransaction()
 *
 * async function handleSwap() {
 *   await executeBatch([
 *     { to: tokenAddr, data: approveData },
 *     { to: dexRouter, data: swapData },
 *   ])
 * }
 * </script>
 * ```
 */
export function usePaxeerTransaction() {
  const client = usePaxeerContext();

  const pending = ref(false);
  const lastTx = ref<TxResult | null>(null);
  const error = ref<string | null>(null);

  async function execute(tx: TxRequest): Promise<TxResult> {
    pending.value = true;
    error.value = null;
    try {
      const result = await client.execute(tx);
      lastTx.value = result;
      return result;
    } catch (err: any) {
      error.value = err?.message ?? 'Transaction failed';
      throw err;
    } finally {
      pending.value = false;
    }
  }

  async function executeBatch(txs: TxRequest[]): Promise<TxResult[]> {
    pending.value = true;
    error.value = null;
    try {
      const results = await client.executeBatch(txs);
      if (results.length > 0) {
        lastTx.value = results[results.length - 1];
      }
      return results;
    } catch (err: any) {
      error.value = err?.message ?? 'Batch transaction failed';
      throw err;
    } finally {
      pending.value = false;
    }
  }

  function reset() {
    lastTx.value = null;
    error.value = null;
  }

  return {
    execute,
    executeBatch,
    pending,
    lastTx,
    error,
    reset,
  };
}
