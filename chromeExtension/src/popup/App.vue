<script setup lang="ts">
import { onMounted } from "vue";
import { useExtension } from "./composables/useExtension";
import LockScreen from "./views/LockScreen.vue";
import TopBar from "./components/TopBar.vue";
import BottomNav from "./components/BottomNav.vue";

const ext = useExtension();

onMounted(() => {
  ext.refreshState();
});
</script>

<template>
  <div class="flex h-[540px] w-[360px] flex-col bg-surface-900">
    <!-- Not set up yet -->
    <template v-if="!ext.state.value.isSetup">
      <LockScreen mode="setup" />
    </template>

    <!-- Locked -->
    <template v-else-if="!ext.state.value.isUnlocked">
      <LockScreen mode="unlock" />
    </template>

    <!-- Unlocked — main app -->
    <template v-else>
      <TopBar />
      <main class="flex-1 overflow-y-auto px-3 py-3">
        <router-view />
      </main>
      <BottomNav />
    </template>
  </div>
</template>
