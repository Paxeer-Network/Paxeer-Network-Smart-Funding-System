<script setup lang="ts">
import { useExtension } from "../composables/useExtension";
import PxIcon from "./icons/PxIcon.vue";

const ext = useExtension();

function shortAddr(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
</script>

<template>
  <div class="flex h-12 shrink-0 items-center justify-between border-b border-white/5 bg-surface-800 px-3">
    <div class="flex items-center gap-2">
      <img src="/icons/icon-32.png" alt="Paxeer" class="h-6 w-6" />
      <span class="text-xs font-mono text-gray-light">
        {{ shortAddr(ext.state.value.walletMeta?.smartWalletAddress ?? '') }}
      </span>
    </div>
    <div class="flex items-center gap-2">
      <span class="rounded bg-brand-600/20 px-1.5 py-0.5 text-[10px] font-medium text-brand-300">
        Paxeer
      </span>
      <button
        class="rounded p-1 text-gray hover:bg-white/5 hover:text-gray-light transition"
        title="Lock"
        @click="ext.lock()"
      >
        <PxIcon name="lock" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
