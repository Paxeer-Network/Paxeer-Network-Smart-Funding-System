# Initial Setup Guide

Step-by-step instructions for setting up the Paxeer Smart Wallets monorepo from scratch.

## Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (`npm install -g pnpm@9`)
- **Docker** + **Docker Compose** (for Graph Node, IPFS, local PostgreSQL)
- **PM2** (`npm install -g pm2`) — for running services

## 1. Clone & Install

```bash
git clone <repo-url> paxeer-funding
cd paxeer-funding
pnpm install
```

## 2. Environment Variables

```bash
cp .env.example .env
# Fill in:
#   ADMIN_PRIVATE_KEY     — deployer/admin wallet private key
#   MORALIS_API_KEY        — for tx history verification
#   DATABASE_URL           — PostgreSQL connection string
#   JWT_SECRET             — random 32+ char string
#   USDL_TOKEN_ADDRESS     — ERC-20 token address on Paxeer Network
```

## 3. Database

```bash
# Option A: Railway (remote)
# Already configured via DATABASE_URL in .env

# Option B: Local Docker
docker run -d --name paxeer-db \
  -e POSTGRES_USER=paxeer \
  -e POSTGRES_PASSWORD=paxeer \
  -e POSTGRES_DB=paxeer_funding \
  -p 5432:5432 postgres:16
```

## 4. Smart Contracts

```bash
cd smartContracts
npx hardhat compile
npx hardhat test          # 336 tests
# Contracts are already deployed — see .env for addresses
```

## 5. Graph Indexer (optional)

```bash
cd graphIndexer
docker-compose up -d      # Graph Node + IPFS + PostgreSQL
pnpm codegen
pnpm build
pnpm deploy-local
```

## 6. Start Services

```bash
# All at once
./scripts/start.sh

# Or individually
pnpm --filter @paxeer/backend-servers dev    # API on :4200
pnpm --filter @paxeer/service-workers dev    # Background workers
pnpm --filter @paxeer/user-interface dev     # Frontend on :4000
```

## 7. Chrome Extension

```bash
pnpm --filter @paxeer/chrome-extension build
# Load chromeExtension/dist/ as unpacked extension in chrome://extensions
```

## Verification

- Backend health: `curl http://localhost:4200/health`
- Frontend: open `http://localhost:4000`
- Subgraph: `http://localhost:8000/subgraphs/name/paxeer/smart-wallets`
