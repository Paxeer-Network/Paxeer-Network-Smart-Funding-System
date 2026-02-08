# WalletFactory

## Deployed Addresses

| Network | Address |
| ------- | ------- |
| paxeer-network | `0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6` |

## Read Functions

### `eventEmitter` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `getWallet` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `owner_` | `address` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `implementation` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `isWallet` `view`

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

### `predictWalletAddress` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `owner_` | `address` |
| `salt` | `bytes32` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `predicted` | `address` |

### `ssoRegistry` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `totalWallets` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `unassignedWalletAt` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `index` | `uint256` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `unassignedWalletCount` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

## Write Functions

### `assignWallet`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |
| `newOwner` | `address` |

### `createWallet`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `owner_` | `address` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |

### `createWalletWithSalt`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `owner_` | `address` |
| `salt` | `bytes32` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |

### `deployWallets`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `count` | `uint256` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `wallets` | `address[]` |

### `pause`

### `renounceOwnership`

### `setEventEmitter`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `newEventEmitter` | `address` |

### `setImplementation`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `newImplementation` | `address` |

### `setSSORegistry`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `newSSORegistry` | `address` |

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

### `Unpaused`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `account` | `address` | No |

### `WalletAssigned`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `wallet` | `address` | Yes |
| `owner` | `address` | Yes |

### `WalletCreated`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `owner` | `address` | Yes |
| `wallet` | `address` | Yes |
| `salt` | `bytes32` | No |

### `WalletPreDeployed`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `wallet` | `address` | Yes |
| `index` | `uint256` | No |

## Custom Errors

### `CloneDeploymentFailed`

### `EnforcedPause`

### `ExpectedPause`

### `InvalidBatchCount`

### `InvalidImplementation`

### `InvalidOwner`

### `OwnableInvalidOwner`

| Name | Type |
| ---- | ---- |
| `owner` | `address` |

### `OwnableUnauthorizedAccount`

| Name | Type |
| ---- | ---- |
| `account` | `address` |

### `WalletAlreadyExists`

| Name | Type |
| ---- | ---- |
| `owner` | `address` |
| `existingWallet` | `address` |

### `WalletNotFromFactory`

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |

### `WalletNotUnassigned`

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |
