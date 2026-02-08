<script setup lang="ts">
import PxIcon from "@/components/icons/PxIcon.vue";
</script>

<template>
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
    <div class="text-center">
      <p class="text-7xl font-bold text-brand-600">404</p>
      <h1 class="mt-4 text-2xl font-bold text-white">Page Not Found</h1>
      <p class="mt-2 text-gray-400">The page you're looking for doesn't exist.</p>
      <router-link to="/" class="btn-primary mt-6 inline-flex">
        <PxIcon name="home" class="h-4 w-4" />
        Go Home
      </router-link>
    </div>
  </div>
</template>
