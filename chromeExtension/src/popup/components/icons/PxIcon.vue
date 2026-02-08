<script setup lang="ts">
import { computed } from "vue";
import { icons } from "./registry";

const props = defineProps<{ name: string }>();

const svg = computed(() => {
  const raw = icons[props.name];
  if (!raw) return "";
  return raw.replace(/ width="\d+"/, "").replace(/ height="\d+"/, "");
});
</script>

<template>
  <span class="px-icon" v-html="svg" />
</template>

<style scoped>
.px-icon {
  display: inline-block;
  position: relative;
  flex-shrink: 0;
  vertical-align: middle;
}
.px-icon :deep(svg) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
