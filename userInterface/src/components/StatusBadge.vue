<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ status: string }>();

const classes = computed(() => {
  switch (props.status) {
    case "completed":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "processing":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "failed":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
});
</script>

<template>
  <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize" :class="classes">
    {{ status }}
  </span>
</template>
