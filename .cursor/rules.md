# Cursor Rules — Paxeer Smart Wallets Monorepo

## Project Context

This is a pnpm monorepo for the Paxeer Smart Wallets platform — a Web3 onboarding system
that assigns funded Smart Wallets on Paxeer Network (chain ID 125).

## Architecture

- **smartContracts/** — Hardhat JS, Solidity 0.8.24, ZERO external deps (no OpenZeppelin)
- **userInterface/** — Vue 3 + Vite + Tailwind + Pinia
- **backendServers/** — Express + TypeScript + Zod
- **serviceWorkers/** — TypeScript interval workers (assignment + funding)
- **chromeExtension/** — Vue 3 + @crxjs/vite-plugin, Manifest V3
- **packages/paxeer-connect/** — SDK: wallet adapter, session keys, tx router (viem)
- **packages/Paxeer-UserWallet-TypeScriptSDK/** — User stats REST SDK
- **graphIndexer/** — The Graph subgraph

## Key Rules

1. Smart contracts must have ZERO external dependencies — all custom.
2. All comments in English.
3. TypeScript strict mode, ES2022 target.
4. Vue 3 Composition API with `<script setup>`.
5. Extension provider runs as `world: "MAIN"` content script (MV3).
6. Backend is auth + user management only — wallet stats from user-stats SDK REST API.
7. Use Conventional Commits for git messages.

## Contract Addresses (Paxeer Network)

- WalletFactory: `0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6`
- EventEmitter: `0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58`
- SSORegistry: `0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332`
- SmartWallet: `0x444490870B799544d841625E7a040b41F17FCe21`
- USDL Token: `0x7c69c84daAEe90B21eeCABDb8f0387897E9B7B37`

## Commands

```bash
pnpm install && pnpm build && pnpm test && pnpm lint && pnpm typecheck
pnpm --filter @paxeer/chrome-extension build
pnpm --filter @paxeer/smart-contracts test
```
