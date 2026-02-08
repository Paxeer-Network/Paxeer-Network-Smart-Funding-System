<div align="center">

# @paxeer/paxeer-connect

> Unified SmartWallet SDK for Paxeer protocol developers.
> Connect once, execute anywhere — session keys, funded gas, zero MetaMask popups.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![viem](https://img.shields.io/badge/viem-v2-green)](https://viem.sh/)
[![wagmi](https://img.shields.io/badge/wagmi-v2-purple)](https://wagmi.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Framework Integration](#framework-integration)
- [Core API](#core-api)
- [Contracts](#contracts)
- [Networks](#networks)
- [Subpath Exports](#subpath-exports)
- [Low-Level Wagmi Hooks](#low-level-wagmi-hooks)
- [Subgraph](#subgraph)
- [Architecture](#architecture)
- [License](#license)

## Overview

`@paxeer/paxeer-connect` is the unified SDK that Paxeer protocol teams use to integrate SmartWallets into their frontends. It handles:

- **Wallet resolution** — EOA (MetaMask) to SmartWallet mapping via WalletFactory
- **Session keys (SSO)** — Ephemeral keypair generation + on-chain SSORegistry registration. One MetaMask popup, then popup-free transactions for up to 30 days
- **Transaction routing** — Wraps calls into `SmartWallet.execute()` / `executeBatch()` / `executeWithSignature()` automatically
- **Gas abstraction** — Works with Paxeer's funded-user model; checks SmartWallet balance before executing
- **Cross-app SSO** — Session keys from one protocol can be reused by another if permissions match

## Installation

```bash
pnpm add @paxeer/paxeer-connect
```

### Framework-specific peer deps (install only what you need)

```bash
# Next.js / Vite + React
pnpm add react

# Vue 3
pnpm add vue

# Low-level wagmi hooks (optional)
pnpm add wagmi @tanstack/react-query
```

## Quick Start

### 5 lines to integrate any Paxeer protocol

```ts
import { createPaxeerClient } from '@paxeer/paxeer-connect'

const paxeer = createPaxeerClient({
  appName: 'Paxeer DEX',
  appId: 'paxeer-dex',
  permissions: ['EXECUTE', 'TRANSFER_ERC20'],
})

// Connect — resolves EOA to SmartWallet, registers session key (1 MetaMask tx)
const wallet = await paxeer.connect(window.ethereum)
// wallet.smartWallet → 0x...
// wallet.metadata   → { argusId, userAlias, ... }

// Execute — routes through SmartWallet, signed by session key (no popup)
await paxeer.execute({
  to: '0xDEXRouter...',
  data: swapCalldata,
})

// Batch — atomic approve + swap in one tx
await paxeer.executeBatch([
  { to: tokenAddr, data: approveData },
  { to: dexRouter, data: swapData },
])
```

## Framework Integration

### Next.js / React

```tsx
// app/providers.tsx
import { PaxeerProvider } from '@paxeer/paxeer-connect/react'

export function Providers({ children }) {
  return (
    <PaxeerProvider config={{
      appName: 'Paxeer DEX',
      appId: 'paxeer-dex',
      permissions: ['EXECUTE', 'TRANSFER_ERC20'],
    }}>
      {children}
    </PaxeerProvider>
  )
}
```

```tsx
// components/ConnectButton.tsx
import { usePaxeerClient } from '@paxeer/paxeer-connect/react'

function ConnectButton() {
  const { wallet, isConnected, connect, disconnect, connecting } = usePaxeerClient()

  if (isConnected) {
    return (
      <div>
        <p>{wallet.metadata.userAlias}</p>
        <p className="font-mono text-sm">{wallet.smartWallet}</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

  return (
    <button onClick={() => connect()} disabled={connecting}>
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
```

```tsx
// components/SwapButton.tsx
import { usePaxeerTransaction } from '@paxeer/paxeer-connect/react'
import { encodeFunctionData } from 'viem'

function SwapButton({ tokenIn, tokenOut, amount }) {
  const { executeBatch, pending, error } = usePaxeerTransaction()

  async function handleSwap() {
    await executeBatch([
      {
        to: tokenIn,
        data: encodeFunctionData({
          abi: erc20ABI,
          functionName: 'approve',
          args: [DEX_ROUTER, amount],
        }),
      },
      {
        to: DEX_ROUTER,
        data: encodeFunctionData({
          abi: dexABI,
          functionName: 'swap',
          args: [tokenIn, tokenOut, amount],
        }),
      },
    ])
  }

  return (
    <>
      <button onClick={handleSwap} disabled={pending}>
        {pending ? 'Swapping...' : 'Swap'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  )
}
```

### Vue 3

```ts
// main.ts
import { createApp } from 'vue'
import { paxeerPlugin } from '@paxeer/paxeer-connect/vue'
import App from './App.vue'

const app = createApp(App)
app.use(paxeerPlugin, {
  appName: 'Paxeer Lending',
  appId: 'paxeer-lending',
  permissions: ['EXECUTE', 'CALL_CONTRACT'],
})
app.mount('#app')
```

```vue
<!-- components/ConnectButton.vue -->
<script setup>
import { usePaxeerClient } from '@paxeer/paxeer-connect/vue'

const { wallet, isConnected, connect, disconnect, connecting } = usePaxeerClient()
</script>

<template>
  <div v-if="isConnected">
    <p>{{ wallet?.metadata.userAlias }}</p>
    <button @click="disconnect()">Disconnect</button>
  </div>
  <button v-else @click="connect()" :disabled="connecting">
    {{ connecting ? 'Connecting...' : 'Connect Wallet' }}
  </button>
</template>
```

```vue
<!-- components/SwapButton.vue -->
<script setup>
import { usePaxeerTransaction } from '@paxeer/paxeer-connect/vue'

const { executeBatch, pending, error } = usePaxeerTransaction()

async function handleSwap() {
  await executeBatch([
    { to: tokenAddr, data: approveData },
    { to: dexRouter, data: swapData },
  ])
}
</script>

<template>
  <button @click="handleSwap" :disabled="pending">
    {{ pending ? 'Swapping...' : 'Swap' }}
  </button>
  <p v-if="error" class="text-red-500">{{ error }}</p>
</template>
```

## Core API

### `createPaxeerClient(config)`

Creates a new SDK instance. One per protocol app.

```ts
interface PaxeerClientConfig {
  appName: string              // Protocol display name
  appId: string                // Unique ID (scopes session key storage)
  permissions: PermissionFlag[] // Required SmartWallet permissions
  sessionDuration?: number     // Seconds (default: 86400 = 24h, max: 2592000 = 30d)
  contracts?: { ... }          // Override contract addresses (testnet)
  rpcUrl?: string              // Override RPC URL
}

type PermissionFlag =
  | 'EXECUTE'          // Single tx execution
  | 'EXECUTE_BATCH'    // Batch tx execution
  | 'TRANSFER_ETH'     // Native transfers
  | 'TRANSFER_ERC20'   // Token transfers
  | 'CALL_CONTRACT'    // Arbitrary contract calls
```

### `PaxeerClient` Methods

| Method | Description |
|--------|-------------|
| `connect(provider)` | Connect wallet, resolve SmartWallet, register session key |
| `disconnect()` | Clear session, disconnect |
| `execute(tx)` | Execute single tx through SmartWallet |
| `executeBatch(txs)` | Atomic batch execution |
| `getBalance()` | Native balance of SmartWallet |
| `getTokenBalance(token)` | ERC-20 balance |
| `getNonce()` | Current tx nonce |
| `checkGas()` | Gas funding status |
| `getSession()` | Current session key info |
| `isSessionActive()` | Whether session is valid |
| `refresh()` | Refresh wallet state |
| `on(event, handler)` | Subscribe to events |

### Events

`connected` | `disconnected` | `sessionCreated` | `sessionExpired` | `txSubmitted` | `txConfirmed` | `txFailed` | `error`

## Contracts

| Contract | Address | Description |
| -------- | ------- | ----------- |
| SmartWallet (impl) | `0x444490870B799544d841625E7a040b41F17FCe21` | Per-user wallet with execute/batch/meta-tx |
| WalletFactory | `0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6` | CREATE2 factory, EOA-to-wallet mapping |
| SSORegistry | `0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332` | Session key registry with permissions |
| EventEmitter | `0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58` | Centralized tx event emitter (risk algo) |

## Networks

| Network | Chain ID | RPC | Explorer |
| ------- | -------- | --- | -------- |
| Paxeer Network | 125 | `https://public-rpc.paxeer.app/rpc` | [paxscan.paxeer.app](https://paxscan.paxeer.app) |

## Subpath Exports

| Import path | Contains | Use when |
|-------------|----------|----------|
| `@paxeer/paxeer-connect` | Core SDK + ABIs + constants + types | Always |
| `@paxeer/paxeer-connect/react` | React hooks + context provider | Next.js / Vite React |
| `@paxeer/paxeer-connect/vue` | Vue 3 composables + plugin | Vue apps |
| `@paxeer/paxeer-connect/hooks` | Low-level wagmi hooks (per-function) | Direct contract interaction |
| `@paxeer/paxeer-connect/actions` | Non-React wagmi actions | Scripts / server-side |

## Low-Level Wagmi Hooks

For direct contract interaction without the high-level client:

```tsx
import { useReadSmartWalletGetBalance } from '@paxeer/paxeer-connect/hooks'

function Balance() {
  const { data } = useReadSmartWalletGetBalance()
  return <p>{data?.toString()} wei</p>
}
```

See [docs/](./docs) for full per-contract hook documentation.

## Subgraph

A ready-to-deploy Graph Protocol subgraph is included under `subgraph/`.

```bash
cd subgraph && pnpm install && pnpm codegen && pnpm build
```

## Architecture

```
User connects MetaMask
  |
  v
EOA: 0xABC...
  |
  v
WalletFactory.getWallet(EOA) --> SmartWallet: 0xDEF...
  |
  v
SDK generates ephemeral session keypair
  |
  v
SSORegistry.registerSessionKey(ephemeral, now, now+24h, permissions)
  |  (ONE MetaMask tx -- the only popup)
  v
All subsequent txs: SmartWallet.executeWithSignature()
  (signed by session key -- zero popups)
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](./SECURITY.md) for the security policy.

## License

This project is licensed under the MIT License -- see [LICENSE](./LICENSE) for details.
