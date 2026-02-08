# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Devices                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Web App      │  │  Chrome Ext  │  │  dApps (future)    │    │
│  │  (Vue 3)      │  │  (MV3 popup) │  │  via paxeer-connect│    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘    │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Express API  │  │  Assignment  │  │  Funding Worker    │    │
│  │  :4200        │  │  Worker      │  │                    │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘    │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Paxeer Network (chain 125)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │ WalletFactory│  │  SSORegistry │  │  EventEmitter      │    │
│  │              │  │              │  │                    │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ SmartWallet  │  │  USDL Token  │                             │
│  │  (per user)  │  │  (ERC-20)    │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  External Services                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Graph Node   │  │  Moralis API │  │  User Stats SDK    │    │
│  │  (subgraph)   │  │  (tx verify) │  │  (Sidiora)         │    │
│  └──────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Smart Contract Architecture

### WalletFactory
- CREATE2 deterministic deployment of SmartWallet proxies
- Admin-only: `createWallet()`, `batchPreDeploy()`, `assignWallet()`
- Maps `owner → wallet address` and stores metadata (argusId, onchainId, alias, socials)

### SmartWallet
- Per-user wallet contract (minimal proxy pattern)
- `execute()` — direct call from owner
- `executeBatch()` — batched calls from owner
- `executeWithSignature()` — session key based execution (EIP-712 signed)
- Stores user metadata on-chain

### SSORegistry
- Manages session keys for cross-app SSO
- Permission bitmask system for granular access control
- Key registration, revocation, and validation

### EventEmitter
- Centralized transaction event logging
- Used by the risk algorithm to analyze user behavior
- Events: `TransactionExecuted`, `BatchExecuted`, `SessionKeyUsed`

## Data Flow

### User Onboarding
1. Frontend → `/auth/nonce` → nonce + message
2. User signs message with wallet
3. Frontend → `/auth/verify` → signature verification → Moralis tx history check
4. If eligible (≥20 quality txs): JWT issued
5. Frontend → `/users/complete-signup` → email, PIN, metadata
6. Assignment worker picks up job → WalletFactory.assignWallet()
7. Funding worker picks up job → USDL.transfer() to new SmartWallet

### Chrome Extension
- Background service worker manages encrypted session keys (AES-256-GCM)
- Provider injected via `world: "MAIN"` content script (bypasses page CSP)
- Relay content script (ISOLATED world) forwards postMessage ↔ chrome.runtime
- Balance/activity data from user-stats SDK REST API

### paxeer-connect SDK
- WalletAdapter: resolves EOA → SmartWallet via WalletFactory
- SessionManager: generates ephemeral keys, registers in SSORegistry
- TransactionRouter: routes txs through SmartWallet.execute/executeWithSignature
- GasAbstractor: checks gas funding status
