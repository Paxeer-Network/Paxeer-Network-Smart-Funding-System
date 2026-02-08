# SSORegistry

## Deployed Addresses

| Network | Address |
| ------- | ------- |
| paxeer-network | `0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332` |

## Read Functions

### `MAX_KEYS_PER_WALLET` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `MAX_SESSION_DURATION` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint48` |

### `PERMISSION_ALL` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `PERMISSION_CALL_CONTRACT` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `PERMISSION_EXECUTE` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `PERMISSION_EXECUTE_BATCH` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `PERMISSION_TRANSFER_ERC20` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `PERMISSION_TRANSFER_ETH` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `authorizedCallers` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bool` |

### `getActiveSigners` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address[]` |

### `getSessionKey` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |
| `signer` | `address` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `tuple` |

### `owner` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `validateSessionKey` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |
| `signer` | `address` |
| `requiredPermissions` | `uint256` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bool` |

## Write Functions

### `registerSessionKey`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `signer` | `address` |
| `validAfter` | `uint48` |
| `validUntil` | `uint48` |
| `permissions` | `uint256` |

### `registerSessionKeyFor`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |
| `signer` | `address` |
| `validAfter` | `uint48` |
| `validUntil` | `uint48` |
| `permissions` | `uint256` |

### `renounceOwnership`

### `revokeSessionKey`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `signer` | `address` |

### `revokeSessionKeyFor`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |
| `signer` | `address` |

### `setAuthorizedCaller`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `caller` | `address` |
| `authorized` | `bool` |

### `transferOwnership`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `newOwner` | `address` |

## Events

### `OwnershipTransferred`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `previousOwner` | `address` | Yes |
| `newOwner` | `address` | Yes |

### `SessionKeyRegistered`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `wallet` | `address` | Yes |
| `signer` | `address` | Yes |
| `validAfter` | `uint48` | No |
| `validUntil` | `uint48` | No |
| `permissions` | `uint256` | No |

### `SessionKeyRevoked`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `wallet` | `address` | Yes |
| `signer` | `address` | Yes |

### `SessionKeyUpdated`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `wallet` | `address` | Yes |
| `signer` | `address` | Yes |
| `validUntil` | `uint48` | No |
| `permissions` | `uint256` | No |

## Custom Errors

### `CallerNotWalletOrOwner`

### `InvalidDuration`

### `InvalidPermissions`

### `InvalidSigner`

### `MaxSessionKeysReached`

| Name | Type |
| ---- | ---- |
| `wallet` | `address` |

### `OwnableInvalidOwner`

| Name | Type |
| ---- | ---- |
| `owner` | `address` |

### `OwnableUnauthorizedAccount`

| Name | Type |
| ---- | ---- |
| `account` | `address` |

### `SessionKeyAlreadyExists`

| Name | Type |
| ---- | ---- |
| `signer` | `address` |

### `SessionKeyNotFound`

| Name | Type |
| ---- | ---- |
| `signer` | `address` |
