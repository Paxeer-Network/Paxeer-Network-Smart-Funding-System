import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@icons": resolve(__dirname, "../@icons"),
      "@paxeer-network/user-stats-typescript-sdk": resolve(
        __dirname,
        "../packages/Paxeer-UserWallet-TypeScriptSDK/src/index.vue.ts",
      ),
    },
  },
  server: {
    port: 4000,
  },
});
