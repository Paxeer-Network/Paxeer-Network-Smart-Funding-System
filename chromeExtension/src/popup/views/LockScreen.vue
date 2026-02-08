<script setup lang="ts">
import { ref } from "vue";
import { useExtension } from "../composables/useExtension";
import PxIcon from "../components/icons/PxIcon.vue";

const props = defineProps<{ mode: "setup" | "unlock" }>();
const ext = useExtension();

const pin = ref("");
const confirmPin = ref("");
const mnemonic = ref("");
const privateKey = ref("");
const generatedMnemonic = ref("");
const mnemonicConfirmed = ref(false);

type SetupStep = "choose" | "create-pin" | "create-confirm" | "show-mnemonic" | "import-choose" | "import-mnemonic" | "import-key" | "import-pin" | "import-confirm";
const step = ref<SetupStep>("choose");
const importMode = ref<"mnemonic" | "key">("mnemonic");

/* ── Unlock flow ── */
async function handleUnlock() {
  if (!pin.value || pin.value.length < 4) return;
  await ext.unlock(pin.value);
}

/* ── Create wallet flow ── */
function startCreate() { step.value = "create-pin"; }

async function handleCreatePin() {
  if (pin.value.length < 4) return;
  step.value = "create-confirm";
}

async function handleCreateConfirm() {
  if (pin.value !== confirmPin.value) {
    ext.error.value = "PINs do not match.";
    return;
  }
  const result = await ext.createWallet(pin.value);
  if (result) {
    generatedMnemonic.value = result.mnemonic;
    step.value = "show-mnemonic";
  }
}

function finishCreate() {
  mnemonicConfirmed.value = true;
  generatedMnemonic.value = "";
}

/* ── Import flow ── */
function startImport() { step.value = "import-choose"; }

function chooseImportMode(mode: "mnemonic" | "key") {
  importMode.value = mode;
  step.value = mode === "mnemonic" ? "import-mnemonic" : "import-key";
}

function proceedImportPin() {
  if (importMode.value === "mnemonic" && !mnemonic.value.trim()) return;
  if (importMode.value === "key" && !privateKey.value.trim()) return;
  step.value = "import-pin";
}

function proceedImportConfirm() {
  if (pin.value.length < 4) return;
  step.value = "import-confirm";
}

async function handleImport() {
  if (pin.value !== confirmPin.value) {
    ext.error.value = "PINs do not match.";
    return;
  }
  if (importMode.value === "mnemonic") {
    await ext.importMnemonic(mnemonic.value.trim(), pin.value);
  } else {
    await ext.importPrivateKey(privateKey.value.trim(), pin.value);
  }
}

function handleSubmit() {
  if (props.mode === "unlock") return handleUnlock();
  switch (step.value) {
    case "create-pin": return handleCreatePin();
    case "create-confirm": return handleCreateConfirm();
    case "import-mnemonic":
    case "import-key": return proceedImportPin();
    case "import-pin": return proceedImportConfirm();
    case "import-confirm": return handleImport();
  }
}

function goBack() {
  ext.error.value = "";
  pin.value = "";
  confirmPin.value = "";
  switch (step.value) {
    case "create-pin":
    case "import-choose": step.value = "choose"; break;
    case "create-confirm": step.value = "create-pin"; break;
    case "import-mnemonic":
    case "import-key": step.value = "import-choose"; break;
    case "import-pin": step.value = importMode.value === "mnemonic" ? "import-mnemonic" : "import-key"; break;
    case "import-confirm": step.value = "import-pin"; break;
    default: step.value = "choose";
  }
}
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center px-6">
    <img src="/icons/icon-128.png" alt="Paxeer" class="mb-4 h-14 w-14" />

    <!-- UNLOCK -->
    <template v-if="mode === 'unlock'">
      <h1 class="mb-1 text-lg font-semibold text-white">Welcome Back</h1>
      <p class="mb-5 text-center text-xs text-gray">Enter your PIN to unlock.</p>
      <form class="w-full space-y-3" @submit.prevent="handleUnlock">
        <input v-model="pin" type="password" inputmode="numeric" maxlength="8" placeholder="Enter PIN" autofocus
          class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-center text-lg tracking-[0.3em] text-white placeholder-gray outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-400/40" />
        <p v-if="ext.error.value" class="text-center text-xs text-red-400">{{ ext.error.value }}</p>
        <button type="submit" class="btn-primary w-full" :disabled="ext.loading.value || pin.length < 4">
          <PxIcon v-if="ext.loading.value" name="loader" class="h-4 w-4 animate-spin" />
          Unlock
        </button>
      </form>
      <p class="mt-4 text-[10px] text-gray">
        Forgot PIN? Re-authenticate via the
        <a href="http://localhost:4000" target="_blank" class="text-brand-300 hover:underline">web app</a>.
      </p>
    </template>

    <!-- SETUP: Choose -->
    <template v-else-if="step === 'choose'">
      <h1 class="mb-1 text-lg font-semibold text-white">Paxeer Wallet</h1>
      <p class="mb-5 text-center text-xs text-gray">Create a new wallet or import an existing one.</p>
      <div class="w-full space-y-2">
        <button class="btn-primary w-full" @click="startCreate">
          <PxIcon name="wallet" class="h-4 w-4" /> Create New Wallet
        </button>
        <button class="btn-secondary w-full" @click="startImport">
          <PxIcon name="key" class="h-4 w-4" /> Import Existing Wallet
        </button>
      </div>
    </template>

    <!-- SETUP: Show mnemonic (after creation) -->
    <template v-else-if="step === 'show-mnemonic'">
      <h1 class="mb-1 text-lg font-semibold text-white">Back Up Seed Phrase</h1>
      <p class="mb-3 text-center text-[10px] text-red-400">Write this down and store it safely. Never share it.</p>
      <div class="mb-4 w-full rounded-lg border border-brand-600/20 bg-surface-800 p-3">
        <div class="grid grid-cols-3 gap-1.5">
          <div v-for="(word, i) in generatedMnemonic.split(' ')" :key="i"
            class="rounded bg-white/5 px-2 py-1 text-center text-[10px]">
            <span class="text-gray">{{ i + 1 }}.</span>
            <span class="ml-1 font-mono text-white">{{ word }}</span>
          </div>
        </div>
      </div>
      <button class="btn-primary w-full" @click="finishCreate">
        I've saved my seed phrase
      </button>
    </template>

    <!-- SETUP: Import — choose mode -->
    <template v-else-if="step === 'import-choose'">
      <h1 class="mb-1 text-lg font-semibold text-white">Import Wallet</h1>
      <p class="mb-5 text-center text-xs text-gray">Choose how to import.</p>
      <div class="w-full space-y-2">
        <button class="btn-primary w-full" @click="chooseImportMode('mnemonic')">
          <PxIcon name="shield-check" class="h-4 w-4" /> Seed Phrase (12 words)
        </button>
        <button class="btn-secondary w-full" @click="chooseImportMode('key')">
          <PxIcon name="key" class="h-4 w-4" /> Private Key
        </button>
      </div>
      <button class="mt-3 text-[10px] text-gray hover:text-gray-light" @click="goBack">Back</button>
    </template>

    <!-- SETUP: Import — enter mnemonic -->
    <template v-else-if="step === 'import-mnemonic'">
      <h1 class="mb-1 text-lg font-semibold text-white">Enter Seed Phrase</h1>
      <p class="mb-3 text-center text-xs text-gray">Enter your 12-word recovery phrase.</p>
      <form class="w-full space-y-3" @submit.prevent="handleSubmit">
        <textarea v-model="mnemonic" rows="3" placeholder="word1 word2 word3 ..."
          class="block w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-gray outline-none transition focus:border-brand-400" />
        <p v-if="ext.error.value" class="text-center text-xs text-red-400">{{ ext.error.value }}</p>
        <button type="submit" class="btn-primary w-full" :disabled="!mnemonic.trim()">Continue</button>
      </form>
      <button class="mt-3 text-[10px] text-gray hover:text-gray-light" @click="goBack">Back</button>
    </template>

    <!-- SETUP: Import — enter private key -->
    <template v-else-if="step === 'import-key'">
      <h1 class="mb-1 text-lg font-semibold text-white">Enter Private Key</h1>
      <p class="mb-3 text-center text-xs text-gray">Paste your hex private key.</p>
      <form class="w-full space-y-3" @submit.prevent="handleSubmit">
        <input v-model="privateKey" type="password" placeholder="0x..."
          class="block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white placeholder-gray outline-none transition focus:border-brand-400" />
        <p v-if="ext.error.value" class="text-center text-xs text-red-400">{{ ext.error.value }}</p>
        <button type="submit" class="btn-primary w-full" :disabled="!privateKey.trim()">Continue</button>
      </form>
      <button class="mt-3 text-[10px] text-gray hover:text-gray-light" @click="goBack">Back</button>
    </template>

    <!-- SETUP: Create/Import — set PIN -->
    <template v-else-if="step === 'create-pin' || step === 'import-pin'">
      <h1 class="mb-1 text-lg font-semibold text-white">Create a PIN</h1>
      <p class="mb-5 text-center text-xs text-gray">This PIN encrypts your wallet on this device.</p>
      <form class="w-full space-y-3" @submit.prevent="handleSubmit">
        <input v-model="pin" type="password" inputmode="numeric" maxlength="8" placeholder="Enter PIN" autofocus
          class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-center text-lg tracking-[0.3em] text-white placeholder-gray outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-400/40" />
        <p v-if="ext.error.value" class="text-center text-xs text-red-400">{{ ext.error.value }}</p>
        <button type="submit" class="btn-primary w-full" :disabled="pin.length < 4">Continue</button>
      </form>
      <button class="mt-3 text-[10px] text-gray hover:text-gray-light" @click="goBack">Back</button>
    </template>

    <!-- SETUP: Create/Import — confirm PIN -->
    <template v-else-if="step === 'create-confirm' || step === 'import-confirm'">
      <h1 class="mb-1 text-lg font-semibold text-white">Confirm PIN</h1>
      <p class="mb-5 text-center text-xs text-gray">Enter your PIN again to confirm.</p>
      <form class="w-full space-y-3" @submit.prevent="handleSubmit">
        <input v-model="confirmPin" type="password" inputmode="numeric" maxlength="8" placeholder="Confirm PIN" autofocus
          class="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-center text-lg tracking-[0.3em] text-white placeholder-gray outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-400/40" />
        <p v-if="ext.error.value" class="text-center text-xs text-red-400">{{ ext.error.value }}</p>
        <button type="submit" class="btn-primary w-full" :disabled="ext.loading.value || confirmPin.length < 4">
          <PxIcon v-if="ext.loading.value" name="loader" class="h-4 w-4 animate-spin" />
          {{ step === 'create-confirm' ? 'Create Wallet' : 'Import Wallet' }}
        </button>
      </form>
      <button class="mt-3 text-[10px] text-gray hover:text-gray-light" @click="goBack">Back</button>
    </template>
  </div>
</template>
