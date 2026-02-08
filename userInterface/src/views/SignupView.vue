<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import PxIcon from "@/components/icons/PxIcon.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useWallet } from "@/composables/useWallet";
import { completeSignup } from "@/api/client";
import { hashPin } from "@/utils/crypto";
import { sanitizeInput } from "@/utils/sanitize";

const router = useRouter();
const auth = useAuthStore();
const { walletType } = storeToRefs(useWallet());

const isSolana = walletType.value === "solana";

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const form = reactive({
  email: "",
  pin: "",
  pinConfirm: "",
  userAlias: "",
  evmAddress: "",
  telegram: "",
  twitter: "",
  website: "",
  github: "",
  discord: "",
});

async function handleSubmit() {
  error.value = null;

  if (!form.email || !form.pin || !form.userAlias) {
    error.value = "Email, PIN, and Username are required.";
    return;
  }
  if (isSolana && !form.evmAddress) {
    error.value = "EVM address is required for Solana wallet users.";
    return;
  }
  if (isSolana && !/^0x[a-fA-F0-9]{40}$/.test(form.evmAddress)) {
    error.value = "Invalid EVM address. Must be a 0x-prefixed 42-character hex address.";
    return;
  }
  if (form.pin.length < 4) {
    error.value = "PIN must be at least 4 characters.";
    return;
  }
  if (form.pin !== form.pinConfirm) {
    error.value = "PINs do not match.";
    return;
  }

  loading.value = true;
  try {
    const hashedPin = await hashPin(form.pin);
    await completeSignup({
      email: sanitizeInput(form.email),
      pin: hashedPin,
      userAlias: sanitizeInput(form.userAlias),
      evmAddress: isSolana ? form.evmAddress.trim() : undefined,
      telegram: form.telegram ? sanitizeInput(form.telegram) : undefined,
      twitter: form.twitter ? sanitizeInput(form.twitter) : undefined,
      website: form.website ? sanitizeInput(form.website) : undefined,
      github: form.github ? sanitizeInput(form.github) : undefined,
      discord: form.discord ? sanitizeInput(form.discord) : undefined,
    });
    success.value = true;

    // Refresh user status then redirect to dashboard
    await auth.fetchStatus();
    setTimeout(() => router.push("/dashboard"), 2000);
  } catch (err: any) {
    error.value = err.message || "Signup failed";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-12">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-white">Complete Your Profile</h1>
      <p class="mt-2 text-gray-400">Fill in the required details to activate your Smart Wallet.</p>
    </div>

    <!-- Success state -->
    <div v-if="success" class="card border-emerald-500/20 bg-emerald-500/5 text-center">
      <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
        <PxIcon name="send" class="h-6 w-6 text-emerald-400" />
      </div>
      <h2 class="text-lg font-semibold text-emerald-300">Profile Complete!</h2>
      <p class="mt-1 text-sm text-emerald-400/80">
        Your Smart Wallet is being prepared. Redirecting to dashboard...
      </p>
    </div>

    <!-- Form -->
    <form v-else class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Error -->
      <div v-if="error" class="card border-red-500/20 bg-red-500/5">
        <div class="flex items-start gap-2">
          <PxIcon name="alert-circle" class="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          <p class="text-sm text-red-400">{{ error }}</p>
        </div>
      </div>

      <!-- Required fields -->
      <div class="card">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Required</h3>

        <div class="space-y-4">
          <div>
            <label class="label">
              <PxIcon name="user" class="mr-1 inline h-3.5 w-3.5" /> Username / Alias
            </label>
            <input v-model="form.userAlias" type="text" class="input" placeholder="satoshi" required />
          </div>

          <div>
            <label class="label">
              <PxIcon name="mail" class="mr-1 inline h-3.5 w-3.5" /> Email
            </label>
            <input v-model="form.email" type="email" class="input" placeholder="you@example.com" required />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">
                <PxIcon name="lock" class="mr-1 inline h-3.5 w-3.5" /> PIN
              </label>
              <input v-model="form.pin" type="password" class="input" placeholder="****" minlength="4" maxlength="12" required />
            </div>
            <div>
              <label class="label">
                <PxIcon name="lock" class="mr-1 inline h-3.5 w-3.5" /> Confirm PIN
              </label>
              <input v-model="form.pinConfirm" type="password" class="input" placeholder="****" minlength="4" maxlength="12" required />
            </div>
          </div>

          <p class="text-xs text-gray-600">
            Your PIN is encrypted and stored off-chain. It is used for sensitive operations.
          </p>

          <div v-if="isSolana">
            <label class="label">
              <PxIcon name="wallet" class="mr-1 inline h-3.5 w-3.5" /> EVM Address (for Smart Wallet ownership)
            </label>
            <input v-model="form.evmAddress" type="text" class="input font-mono" placeholder="0x..." required />
            <p class="mt-1 text-xs text-gray-600">
              Your Paxeer Smart Wallet is an EVM contract. Enter the EVM address that should own it (e.g. your MetaMask address).
            </p>
          </div>
        </div>
      </div>

      <!-- Optional social fields -->
      <div class="card">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Social (Optional)</h3>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">
                <PxIcon name="message-circle" class="mr-1 inline h-3.5 w-3.5" /> Telegram
              </label>
              <input v-model="form.telegram" type="text" class="input" placeholder="@username" />
            </div>
            <div>
              <label class="label">Twitter / X</label>
              <input v-model="form.twitter" type="text" class="input" placeholder="@handle" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">
                <PxIcon name="github" class="mr-1 inline h-3.5 w-3.5" /> Github
              </label>
              <input v-model="form.github" type="text" class="input" placeholder="username" />
            </div>
            <div>
              <label class="label">Discord</label>
              <input v-model="form.discord" type="text" class="input" placeholder="user#1234" />
            </div>
          </div>

          <div>
            <label class="label">
              <PxIcon name="globe" class="mr-1 inline h-3.5 w-3.5" /> Website
            </label>
            <input v-model="form.website" type="url" class="input" placeholder="https://yoursite.com" />
          </div>
        </div>
      </div>

      <!-- Submit -->
      <button type="submit" class="btn-primary w-full py-3 text-base" :disabled="loading">
        <template v-if="loading">
          <PxIcon name="loader" class="h-5 w-5 animate-spin" />
          Submitting...
        </template>
        <template v-else>
          <PxIcon name="send" class="h-5 w-5" />
          Complete Signup
        </template>
      </button>
    </form>
  </div>
</template>
