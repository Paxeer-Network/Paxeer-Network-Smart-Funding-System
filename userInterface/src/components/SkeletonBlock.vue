<script setup lang="ts">
withDefaults(
  defineProps<{
    height?: string;
    width?: string;
    rounded?: string;
  }>(),
  {
    height: "h-6",
    width: "w-full",
    rounded: "rounded-lg",
  },
);
</script>

<template>
  <div
    class="animate-pulse bg-white/5"
    :class="[height, width, rounded]"
  />
</template>
