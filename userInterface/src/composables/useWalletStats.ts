import { defineStore } from "pinia";
import { ref, readonly } from "vue";
import {
  ApiClient,
  type BalanceResponse,
  type Portfolio,
  type TokenHolding,
  type TransactionResponse,
  type PnlHistoryResponse,
  type ChartResponse,
} from "@paxeer-network/user-stats-typescript-sdk";

const STATS_BASE_URL =
  import.meta.env.VITE_WALLET_STATS_API_URL ||
  "https://us-east-1.user-stats.sidiora.exchange";

let client: ApiClient | null = null;

function getClient(): ApiClient {
  if (!client) {
    client = new ApiClient({ baseUrl: STATS_BASE_URL, timeout: 15000 });
  }
  return client;
}

export const useWalletStatsStore = defineStore("walletStats", () => {
  const balance = ref<BalanceResponse | null>(null);
  const portfolio = ref<Portfolio | null>(null);
  const holdings = ref<TokenHolding[] | null>(null);
  const transactions = ref<TransactionResponse | null>(null);
  const pnlHistory = ref<PnlHistoryResponse | null>(null);
  const portfolioChart = ref<ChartResponse | null>(null);
  const pnlChart = ref<ChartResponse | null>(null);
  const holdingsChart = ref<ChartResponse | null>(null);
  const txVolumeChart = ref<ChartResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Per-section error tracking (#17)
  const sectionErrors = ref<Record<string, string>>({});

  let _refreshTimer: ReturnType<typeof setInterval> | null = null;
  let _currentAddress: string | null = null;
  let _currentDays = 30;
  let _debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let _visibilityHandler: (() => void) | null = null;

  function collectErrors(results: PromiseSettledResult<unknown>[], labels: string[]) {
    const errs: Record<string, string> = {};
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === "rejected") {
        const reason = (results[i] as PromiseRejectedResult).reason;
        errs[labels[i]] = reason?.message || "Failed";
      }
    }
    sectionErrors.value = errs;
  }

  async function fetchAll(address: string, days: number): Promise<void> {
    const sdk = getClient();
    const addr = address.toLowerCase();

    loading.value = true;
    error.value = null;

    try {
      const labels = ["balance", "portfolio", "holdings", "transactions", "pnlHistory", "portfolioChart", "pnlChart", "holdingsChart", "txVolumeChart"];
      const results = await Promise.allSettled([
        sdk.pNL.getBalance({ address: addr }),
        sdk.portfolio.getPortfolio({ address: addr }),
        sdk.portfolio.getHoldings({ address: addr }),
        sdk.portfolio.getTransactions({ address: addr, limit: 50 }),
        sdk.pNL.getPnlHistory({ address: addr, days }),
        sdk.charts.getPortfolioValueChart({ address: addr, days }),
        sdk.charts.getPnlChart({ address: addr, days }),
        sdk.charts.getHoldingsChart({ address: addr, days }),
        sdk.charts.getTxVolumeChart({ address: addr, days }),
      ]);

      const [bal, port, hold, txs, pnlHist, pChart, pnlC, hChart, tvChart] = results;

      if (bal.status === "fulfilled") balance.value = bal.value as BalanceResponse;
      if (port.status === "fulfilled") portfolio.value = port.value as Portfolio;
      if (hold.status === "fulfilled") holdings.value = hold.value as TokenHolding[];
      if (txs.status === "fulfilled") transactions.value = txs.value as TransactionResponse;
      if (pnlHist.status === "fulfilled") pnlHistory.value = pnlHist.value as PnlHistoryResponse;
      if (pChart.status === "fulfilled") portfolioChart.value = pChart.value as ChartResponse;
      if (pnlC.status === "fulfilled") pnlChart.value = pnlC.value as ChartResponse;
      if (hChart.status === "fulfilled") holdingsChart.value = hChart.value as ChartResponse;
      if (tvChart.status === "fulfilled") txVolumeChart.value = tvChart.value as ChartResponse;

      collectErrors(results, labels);

      const failCount = results.filter((r) => r.status === "rejected").length;
      if (failCount === results.length) {
        error.value = "Failed to load wallet stats";
      } else if (failCount > 0) {
        error.value = `${failCount} section(s) failed to load`;
      }
    } catch (e: any) {
      error.value = e.message || "Failed to load wallet stats";
      console.error("[useWalletStats] fetchAll error:", e);
    } finally {
      loading.value = false;
    }
  }

  async function load(address: string, days = 30) {
    _currentAddress = address;
    _currentDays = days;
    await fetchAll(address, days);
  }

  async function refresh() {
    if (_currentAddress) {
      await fetchAll(_currentAddress, _currentDays);
    }
  }

  /** Debounced period change (#14) */
  async function changePeriod(days: number) {
    _currentDays = days;
    if (!_currentAddress) return;

    // Debounce rapid period switches
    if (_debounceTimer) clearTimeout(_debounceTimer);

    return new Promise<void>((resolve) => {
      _debounceTimer = setTimeout(async () => {
        const sdk = getClient();
        const addr = _currentAddress!.toLowerCase();
        loading.value = true;
        try {
          const labels = ["portfolioChart", "pnlChart", "holdingsChart", "txVolumeChart", "pnlHistory"];
          const results = await Promise.allSettled([
            sdk.charts.getPortfolioValueChart({ address: addr, days }),
            sdk.charts.getPnlChart({ address: addr, days }),
            sdk.charts.getHoldingsChart({ address: addr, days }),
            sdk.charts.getTxVolumeChart({ address: addr, days }),
            sdk.pNL.getPnlHistory({ address: addr, days }),
          ]);

          const [pChart, pnlC, hChart, tvChart, pnlHist] = results;
          if (pChart.status === "fulfilled") portfolioChart.value = pChart.value as ChartResponse;
          if (pnlC.status === "fulfilled") pnlChart.value = pnlC.value as ChartResponse;
          if (hChart.status === "fulfilled") holdingsChart.value = hChart.value as ChartResponse;
          if (tvChart.status === "fulfilled") txVolumeChart.value = tvChart.value as ChartResponse;
          if (pnlHist.status === "fulfilled") pnlHistory.value = pnlHist.value as PnlHistoryResponse;

          collectErrors(results, labels);
        } catch (e: any) {
          console.error("[useWalletStats] changePeriod error:", e);
        } finally {
          loading.value = false;
        }
        resolve();
      }, 300);
    });
  }

  /** Auto-refresh with visibility-awareness (#21) */
  function startAutoRefresh(intervalMs = 60_000) {
    stopAutoRefresh();

    _refreshTimer = setInterval(() => {
      // Skip refresh when tab is hidden
      if (document.visibilityState === "hidden") return;
      refresh();
    }, intervalMs);

    // Refresh immediately when tab becomes visible again after being hidden
    _visibilityHandler = () => {
      if (document.visibilityState === "visible" && _currentAddress) {
        refresh();
      }
    };
    document.addEventListener("visibilitychange", _visibilityHandler);
  }

  function stopAutoRefresh() {
    if (_refreshTimer) {
      clearInterval(_refreshTimer);
      _refreshTimer = null;
    }
    if (_visibilityHandler) {
      document.removeEventListener("visibilitychange", _visibilityHandler);
      _visibilityHandler = null;
    }
    if (_debounceTimer) {
      clearTimeout(_debounceTimer);
      _debounceTimer = null;
    }
  }

  return {
    balance: readonly(balance),
    portfolio: readonly(portfolio),
    holdings: readonly(holdings),
    transactions: readonly(transactions),
    pnlHistory: readonly(pnlHistory),
    portfolioChart: readonly(portfolioChart),
    pnlChart: readonly(pnlChart),
    holdingsChart: readonly(holdingsChart),
    txVolumeChart: readonly(txVolumeChart),
    loading: readonly(loading),
    error: readonly(error),
    sectionErrors: readonly(sectionErrors),
    load,
    refresh,
    changePeriod,
    startAutoRefresh,
    stopAutoRefresh,
  };
});

/** Backward-compatible composable wrapper */
export function useWalletStats() {
  return useWalletStatsStore();
}
