<div align="center">

# Paxeer Smart Wallets

**Full-stack Web3 platform that onboards users into funded Smart Wallets on Paxeer Network.**

Connect your wallet · Prove on-chain activity · Receive a pre-funded Smart Wallet

[![GitHub Stars](https://img.shields.io/github/stars/Paxeer-Network/Paxeer-Network-Smart-Funding-System?logo=github&style=for-the-badge&labelColor=000)](https://github.com/Paxeer-Network/Paxeer-Network-Smart-Funding-System/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/Paxeer-Network/Paxeer-Network-Smart-Funding-System.svg?style=for-the-badge&labelColor=000)](https://github.com/Paxeer-Network/Paxeer-Network-Smart-Funding-System/commits/main)
[![Issues](https://img.shields.io/github/issues-raw/Paxeer-Network/Paxeer-Network-Smart-Funding-System.svg?style=for-the-badge&labelColor=000)](https://github.com/Paxeer-Network/Paxeer-Network-Smart-Funding-System/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr-raw/Paxeer-Network/Paxeer-Network-Smart-Funding-System.svg?style=for-the-badge&labelColor=000)](https://github.com/Paxeer-Network/Paxeer-Network-Smart-Funding-System/pulls)
[![License](https://img.shields.io/badge/license-proprietary-blue.svg?style=for-the-badge&labelColor=000)](./LICENSE.md)

</div>

---

## ![success](https://www.readmecodegen.com/api/social-icon?name=success&size=15&theme=dark&animationDuration=2.1&color=%2310b981) What is Paxeer Smart Wallets?

A monorepo powering the complete user onboarding pipeline for **Paxeer Network (chain ID 125)**:

1. User connects an existing wallet (MetaMask or Phantom)
2. On-chain transaction history is verified for eligibility
3. A deterministic **Smart Wallet** is deployed via CREATE2
4. The wallet is automatically funded with **USDL** stablecoin

> Zero gas for users. One-click onboarding. Fully on-chain identity.

---

## ![play](https://www.readmecodegen.com/api/social-icon?name=play&size=16&theme=dark&animationDuration=2.1) Quick Start

```bash
# Prerequisites: Node.js >= 18, pnpm >= 8
git clone https://github.com/Paxeer-Network/Paxeer-Network-Smart-Funding-System.git
cd Paxeer-Network-Smart-Funding-System

pnpm install
cp .env.example .env   # fill in secrets

# Start everything
./scripts/start.sh

# — or run services individually —
pnpm --filter @paxeer/backend-servers dev   # API on :4200
pnpm --filter @paxeer/user-interface dev    # Frontend on :4000
pnpm --filter @paxeer/service-workers dev   # Background workers
```

---

## ![server](https://www.readmecodegen.com/api/social-icon?name=server&size=16&theme=dark&animationDuration=2.1) Monorepo Structure

```
paxeer-funding/
│
├── smartContracts/          Hardhat · Solidity 0.8.24 · 336 tests · zero external deps
├── userInterface/           Vue 3 · Vite · Tailwind CSS · Pinia
├── backendServers/          Express · TypeScript · Zod · PostgreSQL
├── serviceWorkers/          Wallet assignment + USDL funding workers
├── chromeExtension/         Vue 3 · @crxjs/vite-plugin · Manifest V3
├── graphIndexer/            The Graph subgraph (events indexing)
├── chainConfigurations/     Network & RPC configs
│
├── packages/
│   ├── paxeer-connect/                      SDK: wallet adapter, session keys, tx router
│   ├── Paxeer-UserWallet-TypeScriptSDK/     User stats REST SDK
│   └── common/                              Shared types & constants
│
├── docs/                    Architecture & API reference
├── development/             Dev guides, coding standards, ADRs
├── @types/                  Shared TypeScript declarations
└── __mocks__/               Jest test mocks
```

---

## ![microchip](https://www.readmecodegen.com/api/social-icon?name=microchip&size=16) Deployed Contracts

> All contracts live on **Paxeer Network** · Chain ID `125` · RPC `https://public-rpc.paxeer.app/rpc`

| Contract | Address | Explorer |
|:---|:---|:---|
| **WalletFactory** | `0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6` | [View ↗](https://paxscan.paxeer.app/address/0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6) |
| **EventEmitter** | `0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58` | [View ↗](https://paxscan.paxeer.app/address/0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58) |
| **SSORegistry** | `0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332` | [View ↗](https://paxscan.paxeer.app/address/0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332) |
| **SmartWallet** (impl) | `0x444490870B799544d841625E7a040b41F17FCe21` | [View ↗](https://paxscan.paxeer.app/address/0x444490870B799544d841625E7a040b41F17FCe21) |
| **USDL Token** | `0x7c69c84daAEe90B21eeCABDb8f0387897E9B7B37` | [View ↗](https://paxscan.paxeer.app/address/0x7c69c84daAEe90B21eeCABDb8f0387897E9B7B37) |

---

## 🔄 How It Works

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │  1. Connect  │────▶│  2. Verify   │────▶│  3. Sign Up  │
  │  Wallet      │     │  Tx History  │     │  Email + PIN │
  └──────────────┘     └──────────────┘     └──────┬───────┘
                                                   │
                                                   ▼
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │  6. Ready!   │◀────│  5. Fund     │◀────│  4. Deploy   │
  │  Use Wallet  │     │  USDL        │     │  SmartWallet │
  └──────────────┘     └──────────────┘     └──────────────┘
```

| Step | What Happens | Who |
|:---:|:---|:---|
| 1 | **Select network** — pick the chain where your wallet is most active | User |
| 2 | **Connect wallet** — MetaMask (EVM) or Phantom (Solana) | User |
| 3 | **Sign message** — proves wallet ownership | User |
| 4 | **Eligibility check** — on-chain tx history verified via Moralis API | Backend |
| 5 | **Complete signup** — email, PIN, metadata stored | User |
| 6 | **Receive Smart Wallet** — auto-assigned + funded with USDL | Workers |

---

## 🧑‍💻 Development

| Command | Description |
|:---|:---|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start dev servers |
| `pnpm build` | Build all workspaces |
| `pnpm lint` | Lint all workspaces |
| `pnpm typecheck` | TypeScript check all workspaces |
| `pnpm test` | Run all tests |
| `pnpm --filter @paxeer/smart-contracts test` | Run 336 contract tests |
| `pnpm --filter @paxeer/chrome-extension build` | Build Chrome extension |

See [`development/`](./development/) for dev guides and [`docs/`](./docs/) for architecture documentation.

---

## ![refresh](https://www.readmecodegen.com/api/social-icon?name=refresh&size=16) Tech Stack

<table>
  <tr>
    <td align="center"><b>Smart Contracts</b></td>
    <td>Solidity 0.8.24 · Hardhat · Zero external dependencies · 336 tests</td>
  </tr>
  <tr>
    <td align="center"><b>Frontend</b></td>
    <td>Vue 3 Composition API · Vite · Tailwind CSS · Pinia · Vue Router</td>
  </tr>
  <tr>
    <td align="center"><b>Backend</b></td>
    <td>Express · TypeScript · Zod · JWT · PostgreSQL</td>
  </tr>
  <tr>
    <td align="center"><b>Extension</b></td>
    <td>Chrome Manifest V3 · Vue 3 · @crxjs/vite-plugin · AES-256-GCM</td>
  </tr>
  <tr>
    <td align="center"><b>SDK</b></td>
    <td>viem · React hooks · Vue composables · wagmi actions · EIP-712</td>
  </tr>
  <tr>
    <td align="center"><b>Indexer</b></td>
    <td>The Graph · AssemblyScript · Docker (Graph Node + IPFS + Postgres)</td>
  </tr>
  <tr>
    <td align="center"><b>Tooling</b></td>
    <td>pnpm workspaces · ESLint · oxlint · Prettier · Jest · PM2</td>
  </tr>
</table>

---

## 🔰 Security

- Please report suspected security vulnerabilities **privately** — see [SECURITY.md](./SECURITY.md)
- **DO NOT** create public issues for security vulnerabilities
- All smart contracts use **zero external dependencies** — fully custom security primitives
- All contracts are **verified** on [Paxscan](https://paxscan.paxeer.app)

---

## 📄 License

Proprietary — see [LICENSE.md](./LICENSE.md).
