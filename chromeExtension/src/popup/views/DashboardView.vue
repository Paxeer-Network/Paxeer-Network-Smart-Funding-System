<script setup lang="ts">
import { onMounted } from "vue";
import { useExtension } from "../composables/useExtension";
import PxIcon from "../components/icons/PxIcon.vue";

const ext = useExtension();

onMounted(() => {
  ext.fetchBalances();
});
</script>

<template>
  <div class="space-y-3">
    <!-- Total Balance Card -->
    <div class="card relative overflow-hidden">
      <div class="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-brand-600/5"></div>
      <p class="text-[10px] font-medium uppercase tracking-wider text-gray">Total Balance</p>
      <p class="mt-1 text-2xl font-bold text-white">
        ${{ ext.balances.value?.totalUsd ?? '0.00' }}
      </p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Native PAX -->
      <div class="card">
        <div class="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600/10">
          <PxIcon name="coins" class="h-3.5 w-3.5 text-brand-300" />
        </div>
        <p class="text-[10px] font-medium uppercase tracking-wider text-gray">Native (PAX)</p>
        <p class="mt-0.5 text-sm font-semibold text-white">
          {{ ext.balances.value?.nativeBalance ?? '0' }}
        </p>
        <p class="text-[10px] text-gray">${{ ext.balances.value?.nativeUsd ?? '0.00' }}</p>
      </div>

      <!-- Token Holdings -->
      <div class="card">
        <div class="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600/10">
          <PxIcon name="layers" class="h-3.5 w-3.5 text-brand-300" />
        </div>
        <p class="text-[10px] font-medium uppercase tracking-wider text-gray">Tokens</p>
        <p class="mt-0.5 text-sm font-semibold text-white">
          {{ ext.balances.value?.holdings?.length ?? 0 }}
        </p>
        <p class="text-[10px] text-gray">holdings</p>
      </div>
    </div>

    <!-- Holdings List -->
    <div class="card">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-xs font-medium text-white">Holdings</p>
        <button class="rounded p-1 text-gray hover:text-gray-light" @click="ext.fetchBalances()">
          <PxIcon name="refresh-cw" class="h-3 w-3" />
        </button>
      </div>

      <div v-if="!ext.balances.value?.holdings?.length" class="py-4 text-center text-[10px] text-gray">
        No token holdings found.
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="h in ext.balances.value.holdings"
          :key="h.symbol"
          class="flex items-center justify-between rounded-lg border border-white/5 bg-white/[.02] px-3 py-2"
        >
          <div class="flex items-center gap-2">
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-surface-700 text-[10px] font-bold text-gray-light">
              {{ h.symbol?.charAt(0) ?? '?' }}
            </div>
            <div>
              <p class="text-xs font-medium text-white">{{ h.symbol }}</p>
              <p class="text-[10px] text-gray">{{ h.name }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs font-mono text-white">{{ h.balance }}</p>
            <p class="text-[10px] text-gray">${{ h.valueUsd }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Key Status -->
    <div v-if="ext.state.value.sessionKeyMeta" class="card">
      <div class="flex items-center gap-2">
        <PxIcon name="shield-check" class="h-3.5 w-3.5 text-brand-300" />
        <p class="text-xs font-medium text-white">Session Key Active</p>
      </div>
      <p class="mt-1 text-[10px] text-gray">
        Permissions: {{ ext.state.value.sessionKeyMeta.permissions }}
      </p>
    </div>
  </div>
</template>
