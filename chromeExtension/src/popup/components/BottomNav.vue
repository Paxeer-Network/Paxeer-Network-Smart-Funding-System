<script setup lang="ts">
import { useRoute } from "vue-router";
import PxIcon from "./icons/PxIcon.vue";

const route = useRoute();

const tabs = [
  { path: "/dashboard", icon: "home", label: "Dashboard" },
  { path: "/activity", icon: "clock", label: "Activity" },
  { path: "/connect", icon: "globe", label: "Connect" },
  { path: "/settings", icon: "key", label: "Settings" },
] as const;
</script>

<template>
  <nav class="flex h-14 shrink-0 items-center justify-around border-t border-white/5 bg-surface-800">
    <router-link
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
      class="flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] transition"
      :class="route.path === tab.path ? 'text-brand-300' : 'text-gray hover:text-gray-light'"
    >
      <PxIcon :name="tab.icon" class="h-5 w-5" />
      {{ tab.label }}
    </router-link>
  </nav>
</template>
