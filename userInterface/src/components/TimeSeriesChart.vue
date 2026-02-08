<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import {
  createChart,
  AreaSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type DeepPartial,
  type ChartOptions,
  type AreaSeriesPartialOptions,
  type HistogramSeriesPartialOptions,
  ColorType,
  LineType,
  CrosshairMode,
} from "lightweight-charts";
import type { ChartResponse } from "@paxeer-network/user-stats-typescript-sdk";

const props = withDefaults(
  defineProps<{
    data: ChartResponse | null;
    title: string;
    type?: "area" | "histogram";
    color?: string;
    negativeColor?: string;
    height?: number;
    showLegend?: boolean;
    valuePrefix?: string;
    valueSuffix?: string;
  }>(),
  {
    type: "area",
    color: "#3381ff",
    negativeColor: "#ef4444",
    height: 280,
    showLegend: true,
    valuePrefix: "$",
    valueSuffix: "",
  },
);

const emit = defineEmits<{
  (e: "crosshair", value: { date: string; value: string } | null): void;
}>();

const chartContainer = ref<HTMLDivElement | null>(null);
let chart: IChartApi | null = null;
let series: ISeriesApi<"Area"> | ISeriesApi<"Histogram"> | null = null;

const hoverValue = ref<{ date: string; value: string } | null>(null);

const chartOptions: DeepPartial<ChartOptions> = {
  layout: {
    background: { type: ColorType.Solid, color: "transparent" },
    textColor: "#94a3b8",
    fontSize: 11,
  },
  grid: {
    vertLines: { color: "rgba(255,255,255,0.03)" },
    horzLines: { color: "rgba(255,255,255,0.03)" },
  },
  crosshair: {
    mode: CrosshairMode.Magnet,
    vertLine: { color: "rgba(51,129,255,0.3)", width: 1, labelBackgroundColor: "#1b5ff5" },
    horzLine: { color: "rgba(51,129,255,0.3)", width: 1, labelBackgroundColor: "#1b5ff5" },
  },
  rightPriceScale: {
    borderColor: "rgba(255,255,255,0.05)",
    scaleMargins: { top: 0.1, bottom: 0.05 },
  },
  timeScale: {
    borderColor: "rgba(255,255,255,0.05)",
    timeVisible: false,
    fixLeftEdge: true,
    fixRightEdge: true,
  },
  handleScroll: { vertTouchDrag: false },
};

function parseChartData(chartResp: ChartResponse | null) {
  if (!chartResp?.data?.length) return [];
  return chartResp.data
    .map((d) => ({
      time: d.date as string,
      value: parseFloat(d.value),
    }))
    .sort((a, b) => (a.time < b.time ? -1 : 1));
}

function buildChart() {
  if (!chartContainer.value) return;

  if (chart) {
    chart.remove();
    chart = null;
    series = null;
  }

  chart = createChart(chartContainer.value, {
    ...chartOptions,
    width: chartContainer.value.clientWidth,
    height: props.height,
  });

  if (props.type === "histogram") {
    series = chart.addSeries(HistogramSeries, {
      color: props.color,
      priceFormat: { type: "price", precision: 2, minMove: 0.01 },
    } as HistogramSeriesPartialOptions);
  } else {
    series = chart.addSeries(AreaSeries, {
      lineColor: props.color,
      topColor: `${props.color}33`,
      bottomColor: `${props.color}05`,
      lineWidth: 2,
      lineType: LineType.Curved,
      priceFormat: { type: "price", precision: 2, minMove: 0.01 },
      crosshairMarkerRadius: 4,
      crosshairMarkerBackgroundColor: props.color,
    } as AreaSeriesPartialOptions);
  }

  const parsed = parseChartData(props.data);
  if (parsed.length) {
    series.setData(parsed as any);
    chart.timeScale().fitContent();
  }

  chart.subscribeCrosshairMove((param) => {
    if (!param.time || !param.seriesData?.size) {
      hoverValue.value = null;
      emit("crosshair", null);
      return;
    }
    const val = param.seriesData.get(series!) as any;
    if (val) {
      const point = {
        date: String(param.time),
        value: val.value?.toFixed(2) ?? "0",
      };
      hoverValue.value = point;
      emit("crosshair", point);
    }
  });
}

function handleResize() {
  if (chart && chartContainer.value) {
    chart.applyOptions({ width: chartContainer.value.clientWidth });
  }
}

const displayValue = computed(() => {
  if (hoverValue.value) {
    return `${props.valuePrefix}${parseFloat(hoverValue.value.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${props.valueSuffix}`;
  }
  const parsed = parseChartData(props.data);
  if (parsed.length) {
    const last = parsed[parsed.length - 1];
    return `${props.valuePrefix}${last.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${props.valueSuffix}`;
  }
  return `${props.valuePrefix}0.00${props.valueSuffix}`;
});

const displayDate = computed(() => {
  if (hoverValue.value) return hoverValue.value.date;
  const parsed = parseChartData(props.data);
  if (parsed.length) return parsed[parsed.length - 1].time;
  return "";
});

watch(
  () => props.data,
  () => {
    if (series && props.data?.data?.length) {
      const parsed = parseChartData(props.data);
      series.setData(parsed as any);
      chart?.timeScale().fitContent();
    } else if (!series && chartContainer.value) {
      buildChart();
    }
  },
);

onMounted(() => {
  buildChart();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  if (chart) {
    chart.remove();
    chart = null;
  }
});
</script>

<template>
  <div class="card">
    <div v-if="showLegend" class="mb-3 flex items-baseline justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-wider text-gray-500">{{ title }}</p>
        <p class="mt-0.5 text-lg font-semibold text-white">{{ displayValue }}</p>
      </div>
      <p class="text-xs text-gray-600">{{ displayDate }}</p>
    </div>
    <div ref="chartContainer" class="w-full overflow-hidden rounded-lg" />
    <div v-if="!data?.data?.length" class="flex items-center justify-center" :style="{ height: `${height}px` }">
      <p class="text-sm text-gray-600">No data available</p>
    </div>
  </div>
</template>
