# Chrome Extension Documentation

## Overview

The Paxeer Wallet Chrome Extension is a Manifest V3 extension that provides:
- Wallet balance tracking via popup UI
- Transaction history viewing
- EIP-1193 provider injection for dApp connectivity
- PIN-protected session key management

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Web Page (MAIN world)                          │
│  ┌───────────────────────────────────────────┐  │
│  │  provider.ts (content script, world:MAIN) │  │
│  │  Sets window.paxeer + window.ethereum     │  │
│  │  Sends/receives via window.postMessage    │  │
│  └─────────────────┬─────────────────────────┘  │
└─────────────────────┼───────────────────────────┘
                      │ postMessage
┌─────────────────────┼───────────────────────────┐
│  Content Script (ISOLATED world)                 │
│  ┌─────────────────┴─────────────────────────┐  │
│  │  content/index.ts — message relay          │  │
│  │  window.postMessage ↔ chrome.runtime      │  │
│  └─────────────────┬─────────────────────────┘  │
└─────────────────────┼───────────────────────────┘
                      │ chrome.runtime.sendMessage
┌─────────────────────┼───────────────────────────┐
│  Background Service Worker                       │
│  ┌─────────────────┴─────────────────────────┐  │
│  │  background/index.ts                       │  │
│  │  - Wallet management (create/import/derive)│  │
│  │  - PIN → PBKDF2 → AES-256-GCM encryption  │  │
│  │  - RPC handling (eth_*, px_*)              │  │
│  │  - Balance polling via user-stats API      │  │
│  │  - Auto-lock after 15 minutes              │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Provider API

The extension exposes `window.paxeer` (and optionally `window.ethereum`) with:

```typescript
interface PaxeerProvider {
  isPaxeer: true;
  chainId: "0x7d";  // 125 in hex

  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  removeListener(event: string, handler: Function): void;
}
```

### Supported Methods

| Method | Description |
|---|---|
| `eth_requestAccounts` | Connect + return address array |
| `eth_accounts` | Return connected addresses |
| `eth_chainId` | Return `"0x7d"` |
| `eth_sendTransaction` | Sign and send transaction |
| `personal_sign` | Sign a message |
| `px_connect` | Paxeer-specific connect (returns `{address, smartWallet}`) |
| `px_accounts` | Same as eth_accounts |
| `px_chainId` | Same as eth_chainId |
| `px_sendTransaction` | Same as eth_sendTransaction |
| `px_signMessage` | Same as personal_sign |

## Building

```bash
pnpm --filter @paxeer/chrome-extension build
# Output: chromeExtension/dist/
# Load as unpacked extension in chrome://extensions (enable Developer Mode)
```

## Security

- Private keys encrypted with AES-256-GCM, key derived from PIN via PBKDF2-SHA256
- Decrypted key held only in service worker memory
- Auto-lock after 15 minutes of inactivity
- Origin approval required for dApp connections
