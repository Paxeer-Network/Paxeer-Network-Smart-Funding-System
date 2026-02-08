<div align="center">

# @paxeer/smart-wallets

> TypeScript SDK for Paxeer Smart Wallet system – WalletFactory, EventEmitter, SSORegistry

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![wagmi](https://img.shields.io/badge/wagmi-v2-purple)](https://wagmi.sh/)
[![viem](https://img.shields.io/badge/viem-v2-green)](https://viem.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Contracts](#contracts)
- [Networks](#networks)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Subgraph](#subgraph)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Typed ABIs** -- `as const` ABI exports for full type safety
- **React Hooks** -- Wagmi v2 hooks for reads, writes, simulations & event watching
- **Non-React Actions** -- Use from Node.js, scripts, or server-side code
- **Contract Constants** -- Addresses, chain configs, RPC URLs
- **Graph Protocol Subgraph** -- Ready-to-deploy schema, mappings & manifest
- **Full TypeScript** -- Interfaces for every function arg, return, event & error

## Installation

```bash
# pnpm (recommended)
pnpm add @paxeer/smart-wallets

# npm
npm install @paxeer/smart-wallets

# yarn
yarn add @paxeer/smart-wallets
```

### Peer Dependencies

```bash
pnpm add wagmi viem @tanstack/react-query react
```

## Contracts

| Contract | Read | Write | Events | Addresses |
| -------- | ---- | ----- | ------ | --------- |
| EventEmitter | 6 | 8 | 6 | paxeer-network: `0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58` |
| WalletFactory | 11 | 11 | 6 | paxeer-network: `0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6` |
| SSORegistry | 13 | 7 | 4 | paxeer-network: `0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332` |
| SmartWallet | 14 | 9 | 9 | paxeer-network: `0x444490870B799544d841625E7a040b41F17FCe21` |

## Networks

| Network | Chain ID | RPC | Explorer |
| ------- | -------- | --- | -------- |
| Paxeer Network | 125 | `https://public-rpc.paxeer.app/rpc` | [Explorer](https://paxscan.paxeer.app) |

## Quick Start

```tsx
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SUPPORTED_CHAIN_IDS, RPC_URLS } from '@paxeer/smart-wallets/constants';

const config = createConfig({
  chains: [/* your chain */],
  transports: { /* chain-specific transports */ },
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        {/* Your app */}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Usage

### Reading contract data

```tsx
import { useReadNativeSwapFactory } from '@paxeer/smart-wallets/hooks';

function PriceDisplay() {
  const { data, isLoading } = useReadNativeSwapFactory();

  if (isLoading) return <div>Loading...</div>;
  return <div>Value: {data?.toString()}</div>;
}
```

### Writing to contracts

```tsx
import { useWriteNativeSwapDeregisterWallet } from '@paxeer/smart-wallets/hooks';

function ActionButton() {
  const { write, isPending } = useWriteNativeSwapDeregisterWallet();

  return (
    <button onClick={() => write({ /* args */ })} disabled={isPending}>
      deregisterWallet
    </button>
  );
}
```

### Non-React usage (scripts / server)

```ts
import { readEventEmitterFactory } from '@paxeer/smart-wallets/actions';

const result = await readEventEmitterFactory(wagmiConfig);
console.log(result);
```

## API Reference

See the [docs/](./docs) directory for detailed per-contract documentation.

## Subgraph

A ready-to-deploy Graph Protocol subgraph is included under `subgraph/`.

```bash
cd subgraph
pnpm install
pnpm codegen
pnpm build
```

Refer to [The Graph docs](https://thegraph.com/docs/) for deployment instructions.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](./SECURITY.md) for the security policy.

## License

This project is licensed under the MIT License -- see [LICENSE](./LICENSE) for details.
