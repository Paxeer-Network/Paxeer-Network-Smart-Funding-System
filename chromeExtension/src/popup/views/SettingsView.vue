<script setup lang="ts">
import { ref } from "vue";
import { useExtension } from "../composables/useExtension";
import PxIcon from "../components/icons/PxIcon.vue";

const ext = useExtension();
const showExportSeed = ref(false);
const showExportKey = ref(false);
const exportPin = ref("");
const exportedValue = ref("");
const exportError = ref("");
const showClearConfirm = ref(false);

function shortAddr(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

async function handleExportSeed() {
  exportError.value = "";
  if (exportPin.value.length < 4) return;
  const m = await ext.exportMnemonic(exportPin.value);
  if (m) { exportedValue.value = m; }
  else { exportError.value = ext.error.value || "Failed to export."; }
}

async function handleExportKey() {
  exportError.value = "";
  if (exportPin.value.length < 4) return;
  const active = ext.state.value.activeAddress;
  if (!active) { exportError.value = "No active account."; return; }
  const pk = await ext.exportPrivateKey(active, exportPin.value);
  if (pk) { exportedValue.value = pk; }
  else { exportError.value = ext.error.value || "Failed to export."; }
}

function closeExport() {
  showExportSeed.value = false;
  showExportKey.value = false;
  exportPin.value = "";
  exportedValue.value = "";
  exportError.value = "";
}

async function handleClear() {
  await ext.clearData();
  showClearConfirm.value = false;
}
</script>

<template>
  <div class="space-y-3">
    <h2 class="text-sm font-semibold text-white">Settings</h2>

    <!-- Accounts -->
    <div class="card">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-xs font-medium text-white">Accounts</p>
        <button class="rounded px-1.5 py-0.5 text-[10px] text-brand-300 hover:bg-brand-600/10" @click="ext.deriveAccount()">
          + Derive
        </button>
      </div>
      <div class="space-y-1.5">
        <button
          v-for="acc in ext.state.value.accounts"
          :key="acc.address"
          class="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left transition"
          :class="acc.address === ext.state.value.activeAddress
            ? 'border-brand-400/30 bg-brand-600/5'
            : 'border-white/5 bg-white/[.02] hover:bg-white/5'"
          @click="ext.setActiveAccount(acc.address)"
        >
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-700 text-[10px] font-bold text-gray-light">
            {{ acc.name?.charAt(0) ?? '?' }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-medium text-white">{{ acc.name }}</p>
            <p class="truncate font-mono text-[10px] text-gray">{{ shortAddr(acc.address) }}</p>
          </div>
          <span v-if="acc.address === ext.state.value.activeAddress" class="text-[10px] text-brand-300">Active</span>
          <span v-if="acc.derivationPath === 'imported'" class="rounded bg-white/5 px-1 text-[8px] text-gray">imported</span>
        </button>
      </div>
    </div>

    <!-- Wallet Info -->
    <div class="card">
      <p class="text-[10px] font-medium uppercase tracking-wider text-gray">Smart Wallet</p>
      <p class="mt-1 break-all font-mono text-[10px] text-gray-light">
        {{ ext.state.value.walletMeta?.smartWalletAddress || 'Not linked yet' }}
      </p>
      <p class="mt-1 text-[10px] text-gray">
        Link via the <a href="http://localhost:4000" target="_blank" class="text-brand-300 hover:underline">web app</a> to connect your Smart Wallet.
      </p>
    </div>

    <!-- Export Seed Phrase -->
    <div class="card">
      <button class="flex w-full items-center justify-between" @click="showExportSeed ? closeExport() : (showExportSeed = true, showExportKey = false)">
        <div class="flex items-center gap-2">
          <PxIcon name="shield-check" class="h-4 w-4 text-gray" />
          <span class="text-xs font-medium text-white">Export Seed Phrase</span>
        </div>
      </button>
      <div v-if="showExportSeed" class="mt-3 space-y-2">
        <template v-if="!exportedValue">
          <input v-model="exportPin" type="password" inputmode="numeric" placeholder="Enter PIN to reveal"
            class="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-gray outline-none focus:border-brand-400" />
          <p v-if="exportError" class="text-[10px] text-red-400">{{ exportError }}</p>
          <button class="btn-primary w-full text-xs" :disabled="exportPin.length < 4" @click="handleExportSeed">Reveal</button>
        </template>
        <template v-else>
          <div class="rounded-lg border border-brand-600/20 bg-surface-800 p-2">
            <div class="grid grid-cols-3 gap-1">
              <div v-for="(word, i) in exportedValue.split(' ')" :key="i" class="rounded bg-white/5 px-1.5 py-0.5 text-center text-[10px]">
                <span class="text-gray">{{ i + 1 }}.</span>
                <span class="ml-0.5 font-mono text-white">{{ word }}</span>
              </div>
            </div>
          </div>
          <button class="btn-secondary w-full text-xs" @click="closeExport">Hide</button>
        </template>
      </div>
    </div>

    <!-- Export Private Key -->
    <div class="card">
      <button class="flex w-full items-center justify-between" @click="showExportKey ? closeExport() : (showExportKey = true, showExportSeed = false)">
        <div class="flex items-center gap-2">
          <PxIcon name="key" class="h-4 w-4 text-gray" />
          <span class="text-xs font-medium text-white">Export Private Key</span>
        </div>
      </button>
      <div v-if="showExportKey" class="mt-3 space-y-2">
        <template v-if="!exportedValue">
          <p class="text-[10px] text-gray">Exports the active account's private key.</p>
          <input v-model="exportPin" type="password" inputmode="numeric" placeholder="Enter PIN to reveal"
            class="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-gray outline-none focus:border-brand-400" />
          <p v-if="exportError" class="text-[10px] text-red-400">{{ exportError }}</p>
          <button class="btn-primary w-full text-xs" :disabled="exportPin.length < 4" @click="handleExportKey">Reveal</button>
        </template>
        <template v-else>
          <div class="rounded-lg border border-red-500/20 bg-surface-800 p-2">
            <p class="break-all font-mono text-[10px] text-white">{{ exportedValue }}</p>
          </div>
          <button class="btn-secondary w-full text-xs" @click="closeExport">Hide</button>
        </template>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="card border-red-500/10">
      <p class="mb-2 text-xs font-medium text-red-400">Danger Zone</p>
      <button
        v-if="!showClearConfirm"
        class="w-full rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
        @click="showClearConfirm = true"
      >
        Clear All Data
      </button>
      <div v-else class="space-y-2">
        <p class="text-[10px] text-red-400">
          This will permanently delete your wallet, all accounts, and settings from this extension. Make sure you have backed up your seed phrase.
        </p>
        <div class="flex gap-2">
          <button class="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-light" @click="showClearConfirm = false">Cancel</button>
          <button class="flex-1 rounded-lg bg-red-500/20 px-3 py-2 text-xs font-medium text-red-400" @click="handleClear">Confirm</button>
        </div>
      </div>
    </div>

    <!-- Version -->
    <p class="text-center text-[10px] text-gray">Paxeer Wallet v0.1.0</p>
  </div>
</template>
