# Getting Started — Developer Guide

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | >= 18 | [nodejs.org](https://nodejs.org) |
| pnpm | >= 8 | `npm install -g pnpm@9` |
| Docker | latest | [docker.com](https://docker.com) |
| PM2 | latest | `npm install -g pm2` |

## First-Time Setup

```bash
git clone <repo-url> paxeer-funding && cd paxeer-funding
pnpm install
cp .env.example .env    # Fill in secrets (see INITIAL.md)
```

## Daily Development

### Start Backend + Frontend
```bash
pnpm --filter @paxeer/backend-servers dev   # Express API on :4200
pnpm --filter @paxeer/user-interface dev    # Vue app on :4000
```

### Start Workers (optional)
```bash
pnpm --filter @paxeer/service-workers dev
```

### Build Chrome Extension
```bash
pnpm --filter @paxeer/chrome-extension build
# Load chromeExtension/dist/ in chrome://extensions
```

### Run Tests
```bash
# Smart contracts (Hardhat)
cd smartContracts && npx hardhat test

# All workspaces
pnpm test
```

### Lint + Typecheck
```bash
pnpm lint
pnpm typecheck
```

## PM2 (Production-like)
```bash
./scripts/start.sh
pm2 status
pm2 logs paxeer-backend
pm2 logs paxeer-frontend
```

## Useful URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:4000 |
| Backend API | http://localhost:4200 |
| Subgraph | http://localhost:8000/subgraphs/name/paxeer/smart-wallets |
| Graph Node | http://localhost:8020 |
| Paxscan Explorer | https://paxscan.paxeer.app |
| RPC | https://public-rpc.paxeer.app/rpc |
| User Stats API | https://us-east-1.user-stats.sidiora.exchange |
