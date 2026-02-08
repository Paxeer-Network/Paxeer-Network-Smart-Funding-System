<script setup lang="ts">
import { onMounted } from "vue";
import { useExtension } from "../composables/useExtension";
import PxIcon from "../components/icons/PxIcon.vue";

const ext = useExtension();
const explorer = "https://paxscan.paxeer.app";

onMounted(() => {
  ext.fetchActivity();
});

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

function formatTime(ts: string): string {
  if (!ts) return "-";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-semibold text-white">Transactions</h2>
      <button class="rounded p-1 text-gray hover:text-gray-light" @click="ext.fetchActivity()">
        <PxIcon name="refresh-cw" class="h-3 w-3" />
      </button>
    </div>

    <div v-if="!ext.activity.value.length" class="py-8 text-center text-xs text-gray">
      No transactions yet.
    </div>

    <div v-else class="space-y-1">
      <a
        v-for="tx in ext.activity.value"
        :key="tx.hash"
        :href="`${explorer}/tx/${tx.hash}`"
        target="_blank"
        class="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[.02] px-3 py-2.5 transition hover:bg-white/5"
      >
        <!-- Direction Icon -->
        <div
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          :class="tx.direction === 'in' ? 'bg-emerald-500/10' : 'bg-red-500/10'"
        >
          <PxIcon
            :name="tx.direction === 'in' ? 'arrow-down-right' : 'arrow-up-right'"
            class="h-3.5 w-3.5"
            :class="tx.direction === 'in' ? 'text-emerald-400' : 'text-red-400'"
          />
        </div>

        <!-- Details -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1">
            <p class="text-xs font-medium text-white">
              {{ tx.direction === 'in' ? 'Received' : 'Sent' }}
            </p>
            <PxIcon
              v-if="tx.status"
              name="check-circle"
              class="h-3 w-3 text-emerald-400"
            />
            <PxIcon
              v-else
              name="x-circle"
              class="h-3 w-3 text-red-400"
            />
          </div>
          <p class="truncate text-[10px] font-mono text-gray">
            {{ tx.direction === 'in' ? 'from' : 'to' }} {{ shortAddr(tx.direction === 'in' ? tx.from : tx.to) }}
          </p>
        </div>

        <!-- Value + Time -->
        <div class="shrink-0 text-right">
          <p
            class="text-xs font-mono font-medium"
            :class="tx.direction === 'in' ? 'text-emerald-400' : 'text-white'"
          >
            {{ tx.direction === 'in' ? '+' : '-' }}{{ formatValue(tx.value) }}
          </p>
          <p class="text-[10px] text-gray">{{ formatTime(tx.timestamp) }}</p>
        </div>
      </a>
    </div>
  </div>
</template>
