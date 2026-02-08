<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import PxIcon from "@/components/icons/PxIcon.vue";
import SkeletonBlock from "@/components/SkeletonBlock.vue";
import { useAuthStore } from "@/stores/auth";
import StatusBadge from "@/components/StatusBadge.vue";
import BalanceHero from "@/components/BalanceHero.vue";
import TimeSeriesChart from "@/components/TimeSeriesChart.vue";
import HoldingsTable from "@/components/HoldingsTable.vue";
import TransactionsTable from "@/components/TransactionsTable.vue";
import { useWalletStats } from "@/composables/useWalletStats";
import { getSessionKeys, type SubgraphSessionKey } from "@/api/subgraph";

const auth = useAuthStore();
const stats = useWalletStats();
const sessionKeys = ref<SubgraphSessionKey[]>([]);
const loadingKeys = ref(true);
const copied = ref(false);
const chartPeriod = ref(30);
const explorerBase = "https://paxscan.paxeer.app";
const smartWallet = computed(() => auth.user?.smartWallet || null);
const periods = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
];

function formatTimestamp(ts: string): string {
  const n = Number(ts);
  if (!n) return "-";
  return new Date(n * 1000).toLocaleString();
}

function copyAddress(addr: string) {
  navigator.clipboard.writeText(addr);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}

async function selectPeriod(days: number) {
  chartPeriod.value = days;
  await stats.changePeriod(days);
}

async function loadData() {
  if (!smartWallet.value) return;
  await stats.load(smartWallet.value, chartPeriod.value);
  loadingKeys.value = true;
  try {
    sessionKeys.value = await getSessionKeys(smartWallet.value);
  } catch (e) {
    console.error("Failed to load session keys:", e);
  } finally {
    loadingKeys.value = false;
  }
}

let _refreshDebounce: ReturnType<typeof setTimeout> | null = null;

function refreshAll() {
  if (_refreshDebounce) return;
  _refreshDebounce = setTimeout(() => { _refreshDebounce = null; }, 2000);
  stats.refresh();
  if (smartWallet.value) {
    getSessionKeys(smartWallet.value)
      .then((keys) => { sessionKeys.value = keys; })
      .catch(() => {});
  }
}

onMounted(async () => {
  await auth.fetchStatus();
  await loadData();
  stats.startAutoRefresh(60_000);
});
onBeforeUnmount(() => { stats.stopAutoRefresh(); });
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <p class="mt-1 text-sm text-gray-400">Your Paxeer Smart Wallet overview</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
          <button
            v-for="p in periods"
            :key="p.days"
            class="rounded-md px-3 py-1 text-xs font-medium transition"
            :class="chartPeriod === p.days ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'"
            @click="selectPeriod(p.days)"
          >
            {{ p.label }}
          </button>
        </div>
        <button class="btn-secondary text-xs" :disabled="stats.loading" aria-label="Refresh dashboard data" @click="refreshAll">
          <PxIcon name="refresh-cw" class="h-3.5 w-3.5" :class="{ 'animate-spin': stats.loading }" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Wallet info banner -->
    <div v-if="auth.user" class="card mb-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500">Smart Wallet</p>
          <div class="flex items-center gap-2">
            <code v-if="smartWallet" class="text-sm font-mono text-brand-300">{{ smartWallet }}</code>
            <span v-else class="text-sm text-gray-500 italic">Pending assignment...</span>
            <button v-if="smartWallet" class="text-gray-500 hover:text-brand-400 transition" aria-label="Copy wallet address" @click="copyAddress(smartWallet!)">
              <PxIcon name="copy" class="h-3.5 w-3.5" />
            </button>
            <a v-if="smartWallet" :href="`${explorerBase}/address/${smartWallet}`" target="_blank" class="text-gray-500 hover:text-brand-400 transition">
              <PxIcon name="external-link" class="h-3.5 w-3.5" />
            </a>
          </div>
          <p v-if="copied" class="text-xs text-emerald-400">Copied!</p>
        </div>

        <div class="flex items-center gap-3">
          <div v-if="auth.assignmentStatus" class="text-right">
            <p class="text-xs text-gray-500 mb-1">Assignment</p>
            <StatusBadge :status="auth.assignmentStatus.status" />
          </div>
          <div v-if="auth.fundingStatus" class="text-right">
            <p class="text-xs text-gray-500 mb-1">Funding</p>
            <StatusBadge :status="auth.fundingStatus.status" />
          </div>
        </div>
      </div>

      <!-- User metadata row -->
      <div class="mt-4 flex flex-wrap gap-4 border-t border-white/5 pt-4 text-xs text-gray-400">
        <span><strong class="text-gray-300">Argus ID:</strong> {{ auth.user.argusId }}</span>
        <span><strong class="text-gray-300">Alias:</strong> {{ auth.user.userAlias || '-' }}</span>
        <span><strong class="text-gray-300">Network:</strong> {{ auth.user.network }}</span>
        <span v-if="auth.user.telegram"><strong class="text-gray-300">TG:</strong> {{ auth.user.telegram }}</span>
        <span v-if="auth.user.twitter"><strong class="text-gray-300">X:</strong> {{ auth.user.twitter }}</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-if="stats.error && !stats.balance" class="card mb-6">
      <div class="flex items-center gap-3 text-amber-400">
        <PxIcon name="alert-circle" class="h-5 w-5 shrink-0" />
        <div>
          <p class="text-sm font-medium">Failed to load wallet analytics</p>
          <p class="mt-0.5 text-xs text-gray-500">{{ stats.error }}</p>
        </div>
        <button class="btn-secondary ml-auto text-xs" aria-label="Retry loading" @click="refreshAll">Retry</button>
      </div>
    </div>

    <template v-if="!stats.error || stats.balance">
      <!-- Balance Hero Cards -->
      <div class="mb-6">
        <div v-if="!stats.balance && stats.loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="i in 4" :key="i" class="card space-y-3">
            <SkeletonBlock height="h-3" width="w-20" />
            <SkeletonBlock height="h-8" width="w-32" />
            <SkeletonBlock height="h-3" width="w-16" />
          </div>
        </div>
        <BalanceHero v-else :balance="stats.balance" />
      </div>

      <!-- Charts Row 1: Portfolio Value + Daily PNL -->
      <div class="mb-6 grid gap-6 lg:grid-cols-2">
        <TimeSeriesChart
          title="Portfolio Value"
          :data="stats.portfolioChart"
          type="area"
          color="#3381ff"
          value-prefix="$"
        />
        <TimeSeriesChart
          title="Daily PNL"
          :data="stats.pnlChart"
          type="histogram"
          color="#10b981"
          negative-color="#ef4444"
          value-prefix="$"
        />
      </div>

      <!-- Holdings Table -->
      <div class="mb-6">
        <HoldingsTable
          :holdings="stats.holdings"
          :total-value-usd="stats.portfolio?.total_value_usd"
        />
      </div>

      <!-- Charts Row 2: Tx Volume + Holdings Count -->
      <div class="mb-6 grid gap-6 lg:grid-cols-2">
        <TimeSeriesChart
          title="Transaction Volume"
          :data="stats.txVolumeChart"
          type="histogram"
          color="#8b5cf6"
          value-prefix="$"
          :height="220"
        />
        <TimeSeriesChart
          title="Holdings Count"
          :data="stats.holdingsChart"
          type="area"
          color="#f59e0b"
          value-prefix=""
          :height="220"
        />
      </div>

      <!-- Enriched Transactions Table -->
      <div class="mb-6">
        <TransactionsTable
          :data="stats.transactions"
          :explorer-base="explorerBase"
        />
      </div>

      <!-- Session Keys -->
      <div class="card">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white">
            <PxIcon name="key" class="mr-2 inline h-5 w-5 text-brand-400" />
            Session Keys
          </h2>
          <span v-if="loadingKeys" class="text-xs text-gray-500">
            <PxIcon name="loader" class="inline h-3 w-3 animate-spin" /> Loading...
          </span>
        </div>

        <div v-if="!sessionKeys.length" class="py-8 text-center text-sm text-gray-500">
          No session keys registered.
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="sk in sessionKeys"
            :key="sk.id"
            class="flex items-center justify-between rounded-lg border border-white/5 bg-white/[.02] px-4 py-3"
          >
            <div class="min-w-0">
              <p class="truncate font-mono text-xs text-gray-200">{{ sk.signer }}</p>
              <p class="mt-0.5 text-xs text-gray-500">
                <PxIcon name="clock" class="mr-1 inline h-3 w-3" />
                {{ formatTimestamp(sk.validAfter) }} &ndash; {{ formatTimestamp(sk.validUntil) }}
              </p>
            </div>
            <span class="ml-3 shrink-0 rounded bg-brand-600/10 px-2 py-0.5 text-xs font-mono text-brand-300">
              perm: {{ sk.permissions }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
