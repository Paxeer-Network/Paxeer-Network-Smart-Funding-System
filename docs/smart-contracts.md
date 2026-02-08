# Smart Contracts Documentation

## Overview

All contracts are deployed on **Paxeer Network (chain ID 125)** and use **zero external
dependencies** — every library, interface, and security mechanism is custom-built.

## Contracts

### WalletFactory (`0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6`)

Creates and assigns SmartWallet instances using CREATE2 deterministic deployment.

**Key Functions:**
- `createWallet(address owner, string argusId)` — creates a new SmartWallet
- `batchPreDeploy(uint256 count)` — pre-deploys wallets for later assignment
- `assignWallet(address owner, string argusId, string onchainId)` — assigns a pre-deployed wallet
- `getWallet(address owner)` → `address` — look up wallet by owner

### SmartWallet (`0x444490870B799544d841625E7a040b41F17FCe21`)

Per-user smart wallet with execution capabilities and on-chain metadata.

**Key Functions:**
- `execute(address target, uint256 value, bytes data)` — single call (owner only)
- `executeBatch(Call[] calls)` — batched calls (owner only)
- `executeWithSignature(address target, uint256 value, bytes data, bytes signature)` — session key execution
- `setMetadata(string key, string value)` — store metadata on-chain
- `getMetadata(string key)` → `string`

### SSORegistry (`0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332`)

Manages session keys for cross-application single sign-on.

**Key Functions:**
- `registerKey(address wallet, address key, uint256 permissions, uint256 expiry)`
- `revokeKey(address wallet, address key)`
- `isValidKey(address wallet, address key, uint256 requiredPermissions)` → `bool`

### EventEmitter (`0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58`)

Centralized event logging for the risk algorithm.

**Events:**
- `TransactionExecuted(address indexed wallet, address indexed target, uint256 value)`
- `BatchExecuted(address indexed wallet, uint256 callCount)`
- `SessionKeyUsed(address indexed wallet, address indexed sessionKey)`

## Testing

```bash
cd smartContracts
npx hardhat test          # 336 tests
npx hardhat coverage      # Coverage report
```

## Deployment

Contracts are deployed via Hardhat scripts. Admin key is in `.env` as `ADMIN_PRIVATE_KEY`.

```bash
cd smartContracts
npx hardhat run scripts/deploy.js --network paxeer
```
