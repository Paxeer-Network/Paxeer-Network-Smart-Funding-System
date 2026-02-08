<script setup lang="ts">
import { computed } from "vue";
import PxIcon from "@/components/icons/PxIcon.vue";
import type { BalanceResponse } from "@paxeer-network/user-stats-typescript-sdk";

const props = defineProps<{
  balance: BalanceResponse | null;
}>();

const totalUsd = computed(() => {
  if (!props.balance?.total_balance_usd) return "$0.00";
  return formatUsd(props.balance.total_balance_usd);
});

const nativeUsd = computed(() => {
  if (!props.balance?.native_balance_usd) return "$0.00";
  return formatUsd(props.balance.native_balance_usd);
});

const tokenUsd = computed(() => {
  if (!props.balance?.token_balance_usd) return "$0.00";
  return formatUsd(props.balance.token_balance_usd);
});

const nativeBalance = computed(() => {
  if (!props.balance?.native_balance) return "0";
  const val = parseFloat(props.balance.native_balance);
  return val < 0.0001 ? val.toExponential(2) : val.toLocaleString(undefined, { maximumFractionDigits: 4 });
});

const dailyPnl = computed(() => {
  if (!props.balance?.daily_pnl_usd) return null;
  const val = parseFloat(props.balance.daily_pnl_usd);
  return {
    value: val,
    formatted: formatUsd(props.balance.daily_pnl_usd, true),
    percent: props.balance.daily_pnl_percent
      ? parseFloat(props.balance.daily_pnl_percent).toFixed(2)
      : null,
    positive: val >= 0,
  };
});

const tokenCount = computed(() => props.balance?.token_count ?? 0);

function formatUsd(val: string, showSign = false): string {
  const n = parseFloat(val);
  if (isNaN(n)) return "$0.00";
  const prefix = showSign && n > 0 ? "+$" : n < 0 ? "-$" : "$";
  return `${prefix}${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Balance -->
    <div class="card relative overflow-hidden sm:col-span-2 lg:col-span-1">
      <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-600/5"></div>
      <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Total Balance</p>
      <p class="mt-2 text-3xl font-bold text-white">{{ totalUsd }}</p>
      <div v-if="dailyPnl" class="mt-2 flex items-center gap-1.5">
        <span
          class="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium"
          :class="dailyPnl.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'"
        >
          <PxIcon v-if="dailyPnl.positive" name="arrow-up-right" class="h-3 w-3" />
          <PxIcon v-else name="arrow-down-right" class="h-3 w-3" />
          {{ dailyPnl.formatted }}
        </span>
        <span
          v-if="dailyPnl.percent"
          class="text-xs"
          :class="dailyPnl.positive ? 'text-emerald-400' : 'text-red-400'"
        >
          ({{ dailyPnl.positive ? '+' : '' }}{{ dailyPnl.percent }}%)
        </span>
        <span class="text-xs text-gray-600">24h</span>
      </div>
    </div>

    <!-- Native Balance -->
    <div class="card">
      <div class="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600/10">
        <PxIcon name="coins" class="h-[18px] w-[18px] text-brand-400" />
      </div>
      <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Native (PAX)</p>
      <p class="mt-1 text-xl font-semibold text-white">{{ nativeBalance }}</p>
      <p class="mt-0.5 text-xs text-gray-500">{{ nativeUsd }}</p>
    </div>

    <!-- Token Holdings Value -->
    <div class="card">
      <div class="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600/10">
        <PxIcon name="layers" class="h-[18px] w-[18px] text-brand-400" />
      </div>
      <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Token Holdings</p>
      <p class="mt-1 text-xl font-semibold text-white">{{ tokenUsd }}</p>
      <p class="mt-0.5 text-xs text-gray-500">{{ tokenCount }} token{{ tokenCount !== 1 ? 's' : '' }}</p>
    </div>

    <!-- Daily PNL Card -->
    <div class="card">
      <div class="mb-3 flex h-9 w-9 items-center justify-center rounded-lg" :class="dailyPnl?.positive !== false ? 'bg-emerald-500/10' : 'bg-red-500/10'">
        <PxIcon v-if="dailyPnl?.positive !== false" name="trending-up" class="h-[18px] w-[18px] text-emerald-400" />
        <PxIcon v-else name="trending-down" class="h-[18px] w-[18px] text-red-400" />
      </div>
      <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Daily PNL</p>
      <p
        class="mt-1 text-xl font-semibold"
        :class="dailyPnl?.positive !== false ? 'text-emerald-400' : 'text-red-400'"
      >
        {{ dailyPnl?.formatted ?? '$0.00' }}
      </p>
      <p
        v-if="dailyPnl?.percent"
        class="mt-0.5 text-xs"
        :class="dailyPnl.positive ? 'text-emerald-400/70' : 'text-red-400/70'"
      >
        {{ dailyPnl.positive ? '+' : '' }}{{ dailyPnl.percent }}%
      </p>
    </div>
  </div>
</template>
