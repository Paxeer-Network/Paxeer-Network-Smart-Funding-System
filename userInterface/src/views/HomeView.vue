<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import PxIcon from "@/components/icons/PxIcon.vue";
import { useWallet } from "@/composables/useWallet";
import { useAuthStore } from "@/stores/auth";

interface NetworkOption {
  id: string;
  name: string;
  chainId: number;
  chainType: "evm" | "solana";
  icon: string;
}

const NETWORKS: NetworkOption[] = [
  { id: "ethereum",  name: "Ethereum",       chainId: 1,      chainType: "evm",    icon: "Ξ" },
  { id: "polygon",   name: "Polygon",        chainId: 137,    chainType: "evm",    icon: "⬡" },
  { id: "arbitrum",  name: "Arbitrum One",    chainId: 42161,  chainType: "evm",    icon: "◈" },
  { id: "optimism",  name: "Optimism",        chainId: 10,     chainType: "evm",    icon: "⊙" },
  { id: "bsc",       name: "BNB Chain",       chainId: 56,     chainType: "evm",    icon: "◆" },
  { id: "base",      name: "Base",            chainId: 8453,   chainType: "evm",    icon: "▣" },
  { id: "avalanche", name: "Avalanche C",     chainId: 43114,  chainType: "evm",    icon: "△" },
  { id: "paxeer",    name: "Paxeer Network",  chainId: 125,    chainType: "evm",    icon: "P" },
  { id: "solana",    name: "Solana",          chainId: 0,      chainType: "solana", icon: "◎" },
];

const router = useRouter();
const wallet = useWallet();
const { address, connected, connecting, error: walletError } = storeToRefs(wallet);
const { connect, signMessage } = wallet;
const auth = useAuthStore();

const step = ref<"select-network" | "connecting" | "verifying" | "done">("select-network");
const statusMessage = ref("");
const notEligible = ref(false);
const selectedNetwork = ref<NetworkOption | null>(null);

function selectNetwork(net: NetworkOption) {
  selectedNetwork.value = net;
}

async function handleConnectAndVerify() {
  if (!selectedNetwork.value) return;
  const net = selectedNetwork.value;

  // ── Step 1: connect the right wallet ──────────────────────────────────
  if (!connected.value) {
    step.value = "connecting";
    await connect(net.chainType);

    if (!connected.value || !address.value) {
      step.value = "select-network";
      return;
    }
  }

  // If already authenticated, go straight to dashboard or signup
  if (auth.isAuthenticated) {
    await auth.fetchStatus();
    if (auth.signupComplete) {
      router.push("/dashboard");
      return;
    }
    if (auth.eligible) {
      router.push("/signup");
      return;
    }
    step.value = "select-network";
    return;
  }

  // ── Step 2: sign + verify ─────────────────────────────────────────────
  step.value = "verifying";
  statusMessage.value = "Please sign the message in your wallet...";

  try {
    const res = await auth.verifyAndLogin(
      address.value!,
      signMessage,
      net.id,
      net.chainId,
      net.chainType,
    );

    if (res.user?.signupComplete) {
      router.push("/dashboard");
      return;
    }

    if (res.eligible === false) {
      notEligible.value = true;
      statusMessage.value = res.message || "Funding for this wallet not available at the moment";
      step.value = "done";
      return;
    }

    // Eligible – go to signup
    router.push("/signup");
  } catch (err: any) {
    statusMessage.value = err.message || "Verification failed";
    step.value = "select-network";
  }
}
</script>

<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
    <div class="w-full max-w-lg text-center">
      <!-- Hero -->
      <div class="mb-8">
        <img src="@/assets/paxeer-symbol.png" alt="Paxeer" class="mx-auto mb-6 h-16 w-16" />
        <h1 class="text-4xl font-bold tracking-tight text-white">
          Paxeer Funding
        </h1>
        <p class="mt-3 text-lg text-gray-400">
          Connect your wallet to get started with your Paxeer Smart Wallet.
        </p>
      </div>

      <!-- Network selection (first step) -->
      <div v-if="step === 'select-network'" class="mb-6">
        <div class="card mb-4 text-left">
          <div class="mb-3 flex items-center gap-2">
            <PxIcon name="globe" class="h-4 w-4 text-brand-400" />
            <h3 class="text-sm font-semibold text-white">Select Verification Network</h3>
          </div>
          <p class="mb-4 text-xs text-gray-500">
            Choose the chain where your wallet has the most transaction history.
            We'll connect the right wallet and verify your activity.
          </p>

          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              v-for="net in NETWORKS"
              :key="net.id"
              class="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition"
              :class="
                selectedNetwork?.id === net.id
                  ? 'border-brand-500 bg-brand-600/10 text-white'
                  : 'border-white/10 bg-white/[.02] text-gray-300 hover:border-white/20 hover:bg-white/5'
              "
              @click="selectNetwork(net)"
            >
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-sm">{{ net.icon }}</span>
              <span class="truncate text-xs font-medium">{{ net.name }}</span>
            </button>
          </div>

          <p v-if="selectedNetwork" class="mt-3 text-xs text-gray-500">
            <span v-if="selectedNetwork.chainType === 'solana'">
              Requires <strong class="text-gray-300">Phantom</strong> or compatible Solana wallet
            </span>
            <span v-else>
              Requires <strong class="text-gray-300">MetaMask</strong> or compatible EVM wallet
            </span>
          </p>
        </div>
      </div>

      <!-- How it works (below network selector) -->
      <div v-if="step === 'select-network'" class="mb-6 card text-left">
        <h4 class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">How it works</h4>
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">1</div>
            <p class="text-xs text-gray-400">Select network &amp; connect wallet</p>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/40 text-[10px] font-bold text-gray-400">2</div>
            <p class="text-xs text-gray-400">Sign a message to prove ownership</p>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/40 text-[10px] font-bold text-gray-400">3</div>
            <p class="text-xs text-gray-400">We check your on-chain history for eligibility</p>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/40 text-[10px] font-bold text-gray-400">4</div>
            <p class="text-xs text-gray-400">Complete profile &amp; receive your funded Smart Wallet</p>
          </div>
        </div>
      </div>

      <!-- Not eligible message -->
      <div v-if="notEligible" class="mb-6 card border-red-500/20 bg-red-500/5">
        <div class="flex items-start gap-3">
          <PxIcon name="alert-circle" class="h-5 w-5 shrink-0 text-red-400" />
          <div class="text-left">
            <p class="text-sm font-medium text-red-300">Not Eligible</p>
            <p class="mt-1 text-xs text-red-400/80">{{ statusMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Wallet error -->
      <div v-if="walletError" class="mb-6 card border-red-500/20 bg-red-500/5">
        <p class="text-sm text-red-400">{{ walletError }}</p>
      </div>

      <!-- Status message during verification -->
      <div v-if="step === 'verifying'" class="mb-6 card border-brand-500/20 bg-brand-500/5">
        <div class="flex items-center justify-center gap-2">
          <PxIcon name="loader" class="h-4 w-4 animate-spin text-brand-400" />
          <p class="text-sm text-brand-300">{{ statusMessage }}</p>
        </div>
      </div>

      <!-- Connect & Verify button -->
      <button
        v-if="step === 'select-network'"
        class="btn-primary w-full py-3 text-base"
        :disabled="!selectedNetwork"
        @click="handleConnectAndVerify"
      >
        <PxIcon name="wallet" class="h-5 w-5" />
        {{ selectedNetwork ? `Connect & Verify on ${selectedNetwork.name}` : 'Select a network above' }}
        <PxIcon name="arrow-right" class="h-4 w-4" />
      </button>

      <!-- Connecting spinner -->
      <button
        v-if="step === 'connecting'"
        class="btn-primary w-full py-3 text-base"
        disabled
      >
        <PxIcon name="loader" class="h-5 w-5 animate-spin" />
        Connecting wallet...
      </button>

      <!-- Verifying spinner -->
      <button
        v-if="step === 'verifying'"
        class="btn-primary w-full py-3 text-base"
        disabled
      >
        <PxIcon name="loader" class="h-5 w-5 animate-spin" />
        Verifying...
      </button>
    </div>
  </div>
</template>
