// ── usePaxeerClient Composable (Vue 3) ───────────────────────────────────────

import { ref, computed } from 'vue';
import { usePaxeerContext } from './plugin';
import type { PaxeerWallet, EIP1193Provider, SessionInfo } from '../core';

/**
 * Primary Vue composable for connecting and managing a Paxeer SmartWallet.
 *
 * @example
 * ```vue
 * <script setup>
 * import { usePaxeerClient } from '@paxeer/paxeer-connect/vue'
 *
 * const { wallet, isConnected, connect, disconnect, connecting } = usePaxeerClient()
 * </script>
 *
 * <template>
 *   <button v-if="!isConnected" @click="connect()" :disabled="connecting">
 *     {{ connecting ? 'Connecting...' : 'Connect Wallet' }}
 *   </button>
 *   <div v-else>
 *     <p>{{ wallet?.metadata.userAlias }}</p>
 *     <button @click="disconnect()">Disconnect</button>
 *   </div>
 * </template>
 * ```
 */
export function usePaxeerClient() {
  const client = usePaxeerContext();

  const wallet = ref<PaxeerWallet | null>(client.getWallet());
  const connecting = ref(false);
  const error = ref<string | null>(null);

  const isConnected = computed(() => wallet.value !== null && wallet.value.isConnected);
  const isSessionActive = computed(() => client.isSessionActive());
  const session = computed<SessionInfo | null>(() => client.getSession());

  async function connect(provider?: EIP1193Provider): Promise<PaxeerWallet> {
    connecting.value = true;
    error.value = null;
    try {
      const p = provider ?? (globalThis as any).ethereum;
      if (!p) {
        throw new Error('No Ethereum provider found. Install MetaMask or another wallet.');
      }
      const w = await client.connect(p);
      wallet.value = w;
      return w;
    } catch (err: any) {
      error.value = err?.message ?? 'Connection failed';
      throw err;
    } finally {
      connecting.value = false;
    }
  }

  function disconnect() {
    client.disconnect();
    wallet.value = null;
    error.value = null;
  }

  async function refresh() {
    try {
      const w = await client.refresh();
      wallet.value = w;
    } catch (err: any) {
      error.value = err?.message ?? 'Refresh failed';
    }
  }

  return {
    wallet,
    isConnected,
    isSessionActive,
    session,
    connecting,
    error,
    connect,
    disconnect,
    refresh,
    client,
  };
}
