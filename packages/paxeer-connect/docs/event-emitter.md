# EventEmitter

## Deployed Addresses

| Network | Address |
| ------- | ------- |
| paxeer-network | `0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58` |

## Read Functions

### `factory` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `isRegisteredWallet` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bool` |

### `owner` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `paused` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bool` |

### `totalTransactions` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `walletOwnerOf` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

## Write Functions

### `deregisterWallet`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |

### `emitTransaction`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `to` | `address` |
| `value` | `uint256` |
| `data` | `bytes` |
| `txNonce` | `uint256` |
| `success` | `bool` |
| `returnData` | `bytes` |

### `pause`

### `registerWallet`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |
| `walletOwner` | `address` |

### `renounceOwnership`

### `setFactory`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `_factory` | `address` |

### `transferOwnership`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `newOwner` | `address` |

### `unpause`

## Events

### `OwnershipTransferred`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `previousOwner` | `address` | Yes |
| `newOwner` | `address` | Yes |

### `Paused`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `account` | `address` | No |

### `TransactionExecuted`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `wallet` | `address` | Yes |
| `to` | `address` | Yes |
| `value` | `uint256` | No |
| `data` | `bytes` | No |
| `nonce` | `uint256` | No |
| `timestamp` | `uint256` | No |
| `success` | `bool` | No |
| `returnData` | `bytes` | No |

### `Unpaused`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `account` | `address` | No |

### `WalletDeregistered`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `wallet` | `address` | Yes |

### `WalletRegistered`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `wallet` | `address` | Yes |
| `owner` | `address` | Yes |

## Custom Errors

### `CallerNotFactory`

### `CallerNotRegisteredWallet`

### `EnforcedPause`

### `ExpectedPause`

### `OwnableInvalidOwner`

| Name | Type |
| ---- | ---- |
| `owner` | `address` |

### `OwnableUnauthorizedAccount`

| Name | Type |
| ---- | ---- |
| `account` | `address` |

### `WalletAlreadyRegistered`

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |

### `WalletNotRegistered`

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |
