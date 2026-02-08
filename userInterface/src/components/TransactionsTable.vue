<script setup lang="ts">
import { computed, ref } from "vue";
import PxIcon from "@/components/icons/PxIcon.vue";
import type { TransactionResponse } from "@paxeer-network/user-stats-typescript-sdk";

const props = defineProps<{
  data: TransactionResponse | null;
  explorerBase?: string;
}>();

const explorer = computed(() => props.explorerBase ?? "https://paxscan.paxeer.app");
const expandedTx = ref<Set<string>>(new Set());

type Tx = TransactionResponse["transactions"][number];

const txList = computed<Tx[]>(() => props.data?.transactions ?? []);

function toggleExpand(hash: string) {
  if (expandedTx.value.has(hash)) {
    expandedTx.value.delete(hash);
  } else {
    expandedTx.value.add(hash);
  }
}

function shortAddr(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatValue(val: string): string {
  const n = parseFloat(val);
  if (isNaN(n) || n === 0) return "0";
  if (n < 0.0001) return n.toExponential(2);
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

function formatGas(fee: string): string {
  const n = parseFloat(fee);
  if (isNaN(n)) return "-";
  return n.toFixed(6);
}

function formatTime(ts: string | undefined): string {
  if (!ts) return "-";
  const d = new Date(ts);
  if (isNaN(d.getTime())) {
    const n = Number(ts);
    if (n) return new Date(n * 1000).toLocaleString();
    return "-";
  }
  return d.toLocaleString();
}
</script>

<template>
  <div class="card">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-white">Transactions</h2>
      <span class="text-xs text-gray-500">{{ txList.length }} transactions</span>
    </div>

    <div v-if="!txList.length" class="py-12 text-center text-sm text-gray-500">
      No transactions recorded yet.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
            <th class="pb-3 pr-3 w-6"></th>
            <th class="pb-3 pr-4">Tx Hash</th>
            <th class="pb-3 pr-4">Type</th>
            <th class="pb-3 pr-4">From / To</th>
            <th class="pb-3 pr-4 text-right">Value</th>
            <th class="pb-3 pr-4 text-right">Gas Fee</th>
            <th class="pb-3 pr-4 text-center">Status</th>
            <th class="pb-3">Time</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="tx in txList" :key="tx.tx_hash">
            <tr
              class="border-b border-white/5 hover:bg-white/[.02] transition-colors cursor-pointer"
              :class="{ 'bg-white/[.01]': expandedTx.has(tx.tx_hash) }"
              @click="toggleExpand(tx.tx_hash)"
            >
              <!-- Expand toggle -->
              <td class="py-3 pr-3">
                <button v-if="tx.token_transfers?.length" class="text-gray-600 hover:text-gray-400">
                  <PxIcon v-if="expandedTx.has(tx.tx_hash)" name="chevron-up" class="h-3.5 w-3.5" />
                  <PxIcon v-else name="chevron-down" class="h-3.5 w-3.5" />
                </button>
              </td>
              <!-- Tx Hash -->
              <td class="py-3 pr-4">
                <a
                  :href="`${explorer}/tx/${tx.tx_hash}`"
                  target="_blank"
                  class="flex items-center gap-1 font-mono text-xs text-brand-400 hover:underline"
                  @click.stop
                >
                  <PxIcon name="hash" class="h-3 w-3" />
                  {{ shortAddr(tx.tx_hash) }}
                  <PxIcon name="external-link" class="h-2.5 w-2.5 text-gray-600" />
                </a>
              </td>
              <!-- Type -->
              <td class="py-3 pr-4">
                <span class="rounded bg-white/5 px-2 py-0.5 text-xs text-gray-400">
                  {{ tx.tx_type || 'transfer' }}
                </span>
              </td>
              <!-- From / To -->
              <td class="py-3 pr-4">
                <div class="flex items-center gap-1 text-xs">
                  <PxIcon v-if="tx.direction === 'out'" name="arrow-up-right" class="h-3 w-3 text-red-400 shrink-0" />
                  <PxIcon v-else name="arrow-down-right" class="h-3 w-3 text-emerald-400 shrink-0" />
                  <span class="font-mono text-gray-400">{{ shortAddr(tx.from_address) }}</span>
                  <span class="text-gray-600 mx-0.5">&rarr;</span>
                  <span class="font-mono text-gray-300">{{ shortAddr(tx.to_address ?? '') }}</span>
                </div>
              </td>
              <!-- Value -->
              <td class="py-3 pr-4 text-right font-mono text-xs" :class="tx.direction === 'in' ? 'text-emerald-400' : 'text-gray-200'">
                {{ tx.direction === 'in' ? '+' : '' }}{{ formatValue(tx.value) }} PAX
              </td>
              <!-- Gas -->
              <td class="py-3 pr-4 text-right text-xs text-gray-500">
                {{ formatGas(tx.gas_fee) }}
              </td>
              <!-- Status -->
              <td class="py-3 pr-4 text-center">
                <span
                  class="inline-flex h-5 w-5 items-center justify-center rounded-full"
                  :class="tx.status ? 'bg-emerald-500/10' : 'bg-red-500/10'"
                >
                  <PxIcon v-if="tx.status" name="check-circle" class="h-3 w-3 text-emerald-400" />
                  <PxIcon v-else name="x-circle" class="h-3 w-3 text-red-400" />
                </span>
              </td>
              <!-- Time -->
              <td class="py-3 text-xs text-gray-500 whitespace-nowrap">
                {{ formatTime(tx.timestamp) }}
              </td>
            </tr>

            <!-- Token Transfers (expanded) -->
            <tr v-if="expandedTx.has(tx.tx_hash) && tx.token_transfers?.length" :key="`${tx.tx_hash}-transfers`">
              <td colspan="8" class="bg-surface-950/50 px-6 py-3">
                <p class="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Token Transfers</p>
                <div class="space-y-2">
                  <div
                    v-for="(tf, i) in tx.token_transfers"
                    :key="i"
                    class="flex items-center gap-4 rounded-lg border border-white/5 bg-white/[.02] px-4 py-2 text-xs"
                  >
                    <span class="inline-flex items-center gap-1 text-gray-400">
                      <PxIcon v-if="tf.direction === 'in'" name="arrow-down-right" class="h-3 w-3 text-emerald-400" />
                      <PxIcon v-else name="arrow-up-right" class="h-3 w-3 text-red-400" />
                      {{ tf.direction.toUpperCase() }}
                    </span>
                    <span class="font-mono text-gray-300">
                      {{ formatValue(tf.amount) }}
                      <span class="text-brand-400">{{ tf.token_symbol ?? 'ERC20' }}</span>
                    </span>
                    <span class="text-gray-600">{{ shortAddr(tf.from_address) }} &rarr; {{ shortAddr(tf.to_address) }}</span>
                    <span class="ml-auto rounded bg-white/5 px-1.5 py-0.5 text-gray-500">{{ tf.token_type }}</span>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
