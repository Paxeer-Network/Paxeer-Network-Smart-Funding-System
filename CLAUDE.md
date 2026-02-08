# CLAUDE.md — Paxeer Smart Wallets Monorepo

## Project Overview

Paxeer Smart Wallets is a full-stack Web3 platform that onboards users into funded Paxeer Smart Wallets.
Users connect an existing wallet (MetaMask / Phantom), prove on-chain activity, and receive a
pre-funded Smart Wallet on **Paxeer Network (chain ID 125)**.

## Monorepo Structure (pnpm workspaces)

| Directory | Package | Stack |
|---|---|---|
| `smartContracts/` | `@paxeer/smart-contracts` | Hardhat JS, Solidity 0.8.24, zero external deps |
| `userInterface/` | `@paxeer/user-interface` | Vue 3 + Vite + Tailwind + Pinia |
| `backendServers/` | `@paxeer/backend-servers` | Express + TypeScript + Zod |
| `serviceWorkers/` | `@paxeer/service-workers` | TypeScript interval-based workers |
| `graphIndexer/` | `@paxeer/graph-indexer` | The Graph subgraph |
| `chainConfigurations/` | `@paxeer/chain-configurations` | Network configs |
| `chromeExtension/` | `@paxeer/chrome-extension` | Vue 3 + Vite + @crxjs MV3 |
| `packages/paxeer-connect/` | `@paxeer/paxeer-connect` | SDK: wallet adapter, session, tx router |
| `packages/Paxeer-UserWallet-TypeScriptSDK/` | `@paxeer-network/user-stats-typescript-sdk` | User stats REST SDK |
| `packages/common/` | `@paxeer/common` | Shared types & constants |

## Key Commands

```bash
pnpm install                        # Install all deps
pnpm build                          # Build all workspaces
pnpm dev                            # Dev servers (all)
pnpm lint                           # Lint all workspaces
pnpm test                           # Test all workspaces
pnpm typecheck                      # TypeScript check all

# Workspace-specific
pnpm --filter @paxeer/smart-contracts test
pnpm --filter @paxeer/user-interface dev
pnpm --filter @paxeer/backend-servers dev
pnpm --filter @paxeer/chrome-extension build
```

## Deployed Contracts (Paxeer Network — chainId 125)

- **WalletFactory**: `0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6`
- **EventEmitter**: `0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58`
- **SSORegistry**: `0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332`
- **SmartWallet (impl)**: `0x444490870B799544d841625E7a040b41F17FCe21`
- **USDL Token**: `0x7c69c84daAEe90B21eeCABDb8f0387897E9B7B37`
- **Admin EOA**: `0x913ec3Dd4bb5512631Ffc95E5633ecB9BcEB0c36`

## Architecture Rules

1. **Smart contracts use ZERO external dependencies** — all libs, interfaces, and security are custom.
2. **Network selection**: user picks chain first, then connects wallet (MetaMask for EVM, Phantom for Solana).
3. **Session keys** are automatic — one MetaMask tx on first connect via paxeer-connect SDK.
4. **Extension provider** runs as a `world: "MAIN"` content script (MV3) to bypass page CSP.
5. **Backend** is auth + user management only — wallet stats come from the user-stats SDK REST API.
6. **All comments must be in English.**

## Environment

- Node.js ≥ 18, pnpm ≥ 8
- PM2 services: `paxeer-backend` (:4200), `paxeer-workers`, `paxeer-frontend` (:4000)
- Graph Node + IPFS + PostgreSQL via Docker for subgraph
- Railway PostgreSQL for backend DB

## Code Style

- TypeScript strict mode, ES2022 target
- Vue 3 Composition API with `<script setup>`
- Tailwind CSS with custom brand palette
- Prettier for formatting, ESLint + oxlint for linting
- Conventional Commits for git messages
