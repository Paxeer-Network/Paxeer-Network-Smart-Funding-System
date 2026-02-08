<script setup lang="ts">
import { useExtension } from "../composables/useExtension";
import PxIcon from "../components/icons/PxIcon.vue";

const ext = useExtension();

function originLabel(origin: string): string {
  try {
    return new URL(origin).hostname;
  } catch {
    return origin;
  }
}
</script>

<template>
  <div class="space-y-3">
    <h2 class="text-sm font-semibold text-white">Connected Apps</h2>

    <div v-if="!ext.state.value.approvedOrigins.length" class="py-8 text-center">
      <PxIcon name="globe" class="mx-auto mb-2 h-8 w-8 text-gray" />
      <p class="text-xs text-gray">No apps connected yet.</p>
      <p class="mt-1 text-[10px] text-gray">
        Visit a Paxeer dApp and it will request access via <code class="text-brand-300">window.paxeer</code>.
      </p>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="origin in ext.state.value.approvedOrigins"
        :key="origin"
        class="flex items-center justify-between rounded-lg border border-white/5 bg-white/[.02] px-3 py-2.5"
      >
        <div class="flex items-center gap-2 min-w-0">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600/10">
            <PxIcon name="globe" class="h-3.5 w-3.5 text-brand-300" />
          </div>
          <div class="min-w-0">
            <p class="truncate text-xs font-medium text-white">{{ originLabel(origin) }}</p>
            <p class="truncate text-[10px] text-gray">{{ origin }}</p>
          </div>
        </div>
        <button
          class="shrink-0 rounded px-2 py-1 text-[10px] font-medium text-red-400 transition hover:bg-red-500/10"
          @click="ext.revokeOrigin(origin)"
        >
          Revoke
        </button>
      </div>
    </div>

    <!-- Provider Info -->
    <div class="card">
      <p class="text-xs font-medium text-white">Provider API</p>
      <p class="mt-1 text-[10px] text-gray">
        dApps can detect and interact with your wallet via:
      </p>
      <code class="mt-2 block rounded bg-surface-900 px-3 py-2 text-[10px] text-brand-300">
        window.paxeer.connect()
      </code>
    </div>
  </div>
</template>
