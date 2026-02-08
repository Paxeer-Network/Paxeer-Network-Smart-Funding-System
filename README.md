# Paxeer Smart Wallets

Full-stack Web3 platform that onboards users into funded **Paxeer Smart Wallets**.
Users connect an existing wallet, prove on-chain activity, and receive a pre-funded Smart Wallet on **Paxeer Network (chain ID 125)**.

## Quick Start

```bash
# Prerequisites: Node.js >= 18, pnpm >= 8
pnpm install
cp .env.example .env   # then fill in secrets

# Start everything (backend, frontend, workers)
./scripts/start.sh
# — or individually —
pnpm --filter @paxeer/backend-servers dev   # :4200
pnpm --filter @paxeer/user-interface dev    # :4000
pnpm --filter @paxeer/service-workers dev
```

## Monorepo Structure

```
paxeer-funding/
├── smartContracts/       Hardhat · Solidity 0.8.24 · 336 tests passing
├── userInterface/        Vue 3 · Vite · Tailwind · Pinia
├── backendServers/       Express · TypeScript · Zod · PostgreSQL
├── serviceWorkers/       Wallet assignment + funding workers
├── chromeExtension/      Vue 3 · @crxjs/vite-plugin · Manifest V3
├── graphIndexer/         The Graph subgraph
├── chainConfigurations/  Network configs
├── packages/
│   ├── paxeer-connect/   SDK: wallet adapter, session keys, tx router
│   ├── Paxeer-UserWallet-TypeScriptSDK/   User stats REST SDK
│   └── common/           Shared types & constants
├── docs/                 Architecture & API documentation
├── development/          Dev guides, runbooks, ADRs
└── @types/               Shared TypeScript declarations
```

## Deployed Contracts (Paxeer Network)

| Contract | Address |
|---|---|
| WalletFactory | `0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6` |
| EventEmitter | `0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58` |
| SSORegistry | `0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332` |
| SmartWallet (impl) | `0x444490870B799544d841625E7a040b41F17FCe21` |
| USDL Token | `0x7c69c84daAEe90B21eeCABDb8f0387897E9B7B37` |

## User Flow

1. **Select network** — pick the chain where your wallet is most active
2. **Connect wallet** — MetaMask (EVM) or Phantom (Solana)
3. **Sign verification message** — proves wallet ownership
4. **Eligibility check** — on-chain tx history verified via Moralis API
5. **Complete signup** — email, PIN, metadata
6. **Receive Smart Wallet** — auto-assigned + funded with USDL

## Development

See [`development/`](./development/) for dev guides and [`docs/`](./docs/) for architecture docs.

## License

See [LICENSE.md](./LICENSE.md).
