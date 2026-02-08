<script setup lang="ts">
import { storeToRefs } from "pinia";
import PxIcon from "@/components/icons/PxIcon.vue";
import { useWallet } from "@/composables/useWallet";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const walletStore = useWallet();
const { shortAddress, connected } = storeToRefs(walletStore);
const { disconnect: walletDisconnect } = walletStore;
const auth = useAuthStore();
const router = useRouter();

function handleDisconnect() {
  walletDisconnect();
  auth.clearAuth();
  router.push("/");
}
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-white/5 bg-surface-950/80 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <router-link to="/" class="flex items-center gap-2">
        <img src="@/assets/paxeer-symbol.png" alt="Paxeer" class="h-8 w-8" />
        <span class="text-lg font-semibold text-white">Paxeer</span>
      </router-link>

      <div class="flex items-center gap-3">
        <template v-if="auth.isAuthenticated && connected">
          <router-link to="/dashboard" class="btn-secondary text-xs">
            <PxIcon name="layout-dashboard" class="h-4 w-4" />
            Dashboard
          </router-link>
          <div class="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
            <PxIcon name="wallet" class="h-3.5 w-3.5 text-brand-400" />
            {{ shortAddress }}
          </div>
          <button class="btn-secondary text-xs" aria-label="Disconnect wallet" @click="handleDisconnect">
            <PxIcon name="logout" class="h-4 w-4" />
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>
