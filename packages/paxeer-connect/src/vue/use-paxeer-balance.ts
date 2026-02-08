// ── usePaxeerBalance Composable (Vue 3) ──────────────────────────────────────

import { ref, onMounted } from 'vue';
import { usePaxeerContext } from './plugin';
import type { Address } from '../core';

/**
 * Vue composable for querying SmartWallet balances.
 *
 * @example
 * ```vue
 * <script setup>
 * import { usePaxeerBalance } from '@paxeer/paxeer-connect/vue'
 *
 * const { native, tokenBalance, loading, refresh } = usePaxeerBalance()
 * </script>
 * ```
 */
export function usePaxeerBalance() {
  const client = usePaxeerContext();

  const native = ref<bigint>(0n);
  const loading = ref(false);

  async function refresh() {
    if (!client.isConnected()) return;
    loading.value = true;
    try {
      native.value = await client.getBalance();
    } catch {
      // Silently fail — balance stays stale
    } finally {
      loading.value = false;
    }
  }

  async function tokenBalance(token: Address): Promise<bigint> {
    if (!client.isConnected()) return 0n;
    return client.getTokenBalance(token);
  }

  onMounted(() => {
    refresh();
  });

  return {
    native,
    tokenBalance,
    loading,
    refresh,
  };
}
