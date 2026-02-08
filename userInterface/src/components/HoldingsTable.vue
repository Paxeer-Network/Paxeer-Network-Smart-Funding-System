<script setup lang="ts">
import { computed, ref } from "vue";
import PxIcon from "@/components/icons/PxIcon.vue";
import type { TokenHolding } from "@paxeer-network/user-stats-typescript-sdk";

const props = defineProps<{
  holdings: TokenHolding[] | null;
  totalValueUsd?: string | null;
}>();

type SortKey = "value_usd" | "balance" | "symbol";
const sortKey = ref<SortKey>("value_usd");
const sortAsc = ref(false);

const sorted = computed(() => {
  if (!props.holdings?.length) return [];
  return [...props.holdings].sort((a, b) => {
    let cmp = 0;
    if (sortKey.value === "value_usd") {
      cmp = parseFloat(a.value_usd ?? "0") - parseFloat(b.value_usd ?? "0");
    } else if (sortKey.value === "balance") {
      cmp = parseFloat(a.balance ?? "0") - parseFloat(b.balance ?? "0");
    } else {
      cmp = (a.symbol ?? "").localeCompare(b.symbol ?? "");
    }
    return sortAsc.value ? cmp : -cmp;
  });
});

const totalValue = computed(() => {
  if (props.totalValueUsd) return parseFloat(props.totalValueUsd);
  if (!props.holdings?.length) return 0;
  return props.holdings.reduce((s, h) => s + parseFloat(h.value_usd ?? "0"), 0);
});

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = false;
  }
}

function formatUsd(val: string | null | undefined): string {
  if (!val) return "$0.00";
  const n = parseFloat(val);
  if (isNaN(n)) return "$0.00";
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatBalance(val: string | null | undefined): string {
  if (!val) return "0";
  const n = parseFloat(val);
  if (n === 0) return "0";
  if (n < 0.0001) return n.toExponential(2);
  if (n < 1) return n.toFixed(6);
  if (n < 1000) return n.toFixed(4);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function allocationPct(holding: TokenHolding): string {
  const val = parseFloat(holding.value_usd ?? "0");
  if (!totalValue.value || !val) return "0%";
  return `${((val / totalValue.value) * 100).toFixed(1)}%`;
}

function allocationWidth(holding: TokenHolding): string {
  const val = parseFloat(holding.value_usd ?? "0");
  if (!totalValue.value || !val) return "0%";
  return `${Math.min((val / totalValue.value) * 100, 100)}%`;
}

const imgError = ref<Set<string>>(new Set());

function onImgError(addr: string) {
  imgError.value.add(addr);
}
</script>

<template>
  <div class="card">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-white">Token Holdings</h2>
      <span class="text-xs text-gray-500">{{ holdings?.length ?? 0 }} tokens</span>
    </div>

    <div v-if="!holdings?.length" class="py-12 text-center text-sm text-gray-500">
      No token holdings found.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
            <th class="pb-3 pr-4">Token</th>
            <th class="pb-3 pr-4 text-right cursor-pointer select-none" @click="toggleSort('balance')">
              <span class="inline-flex items-center gap-1">
                Balance
                <PxIcon name="arrow-up-down" class="h-3 w-3" :class="sortKey === 'balance' ? 'text-brand-400' : ''" />
              </span>
            </th>
            <th class="pb-3 pr-4 text-right">Price</th>
            <th class="pb-3 pr-4 text-right cursor-pointer select-none" @click="toggleSort('value_usd')">
              <span class="inline-flex items-center gap-1">
                Value
                <PxIcon name="arrow-up-down" class="h-3 w-3" :class="sortKey === 'value_usd' ? 'text-brand-400' : ''" />
              </span>
            </th>
            <th class="pb-3 w-32">Allocation</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="h in sorted"
            :key="h.contract_address"
            class="border-b border-white/5 last:border-0 hover:bg-white/[.02] transition-colors"
          >
            <!-- Token -->
            <td class="py-3 pr-4">
              <div class="flex items-center gap-3">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-800 border border-white/5">
                  <img
                    v-if="h.icon_url && !imgError.has(h.contract_address)"
                    :src="h.icon_url"
                    :alt="h.symbol ?? ''"
                    class="h-full w-full object-cover"
                    @error="onImgError(h.contract_address)"
                  />
                  <PxIcon v-else name="image-off" class="h-3.5 w-3.5 text-gray-600" />
                </div>
                <div class="min-w-0">
                  <p class="font-medium text-gray-200 truncate">{{ h.symbol ?? 'Unknown' }}</p>
                  <p class="text-xs text-gray-600 truncate">{{ h.name ?? h.contract_address.slice(0, 10) + '...' }}</p>
                </div>
              </div>
            </td>
            <!-- Balance -->
            <td class="py-3 pr-4 text-right font-mono text-xs text-gray-300">
              {{ formatBalance(h.balance) }}
            </td>
            <!-- Price -->
            <td class="py-3 pr-4 text-right text-xs text-gray-400">
              {{ h.price_usd ? formatUsd(h.price_usd) : '-' }}
            </td>
            <!-- Value -->
            <td class="py-3 pr-4 text-right font-medium text-gray-200">
              {{ formatUsd(h.value_usd) }}
            </td>
            <!-- Allocation -->
            <td class="py-3">
              <div class="flex items-center gap-2">
                <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    class="h-full rounded-full bg-brand-500/60 transition-all"
                    :style="{ width: allocationWidth(h) }"
                  />
                </div>
                <span class="w-10 text-right text-xs text-gray-500">{{ allocationPct(h) }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
