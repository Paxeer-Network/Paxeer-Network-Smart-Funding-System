# Codex Instructions — Paxeer Smart Wallets Monorepo

## Overview

pnpm monorepo for the Paxeer Smart Wallets platform. Onboards users into funded Smart Wallets
on Paxeer Network (chain ID 125).

## Workspaces

| Directory | Stack |
|---|---|
| smartContracts/ | Hardhat JS, Solidity 0.8.24, zero external deps |
| userInterface/ | Vue 3 + Vite + Tailwind + Pinia |
| backendServers/ | Express + TypeScript + Zod |
| serviceWorkers/ | TypeScript interval workers |
| chromeExtension/ | Vue 3 + @crxjs/vite-plugin (MV3) |
| packages/paxeer-connect/ | SDK: wallet adapter, session keys, tx router |
| packages/Paxeer-UserWallet-TypeScriptSDK/ | User stats REST SDK |
| graphIndexer/ | The Graph subgraph |

## Rules

- Smart contracts: ZERO external deps (no OpenZeppelin). All custom.
- All comments in English.
- TypeScript strict, ES2022.
- Vue 3 `<script setup>` composition API.
- Extension uses `world: "MAIN"` content scripts.
- Backend = auth only. Stats from user-stats SDK REST API.
- Conventional Commits.

## Key Addresses (Paxeer Network, chainId 125)

- RPC: `https://public-rpc.paxeer.app/rpc`
- WalletFactory: `0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6`
- EventEmitter: `0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58`
- SSORegistry: `0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332`
- SmartWallet: `0x444490870B799544d841625E7a040b41F17FCe21`
- USDL: `0x7c69c84daAEe90B21eeCABDb8f0387897E9B7B37`
