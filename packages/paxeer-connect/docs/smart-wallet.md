# SmartWallet

## Deployed Addresses

| Network | Address |
| ------- | ------- |
| paxeer-network | `0x444490870B799544d841625E7a040b41F17FCe21` |

## Read Functions

### `DOMAIN_SEPARATOR` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bytes32` |

### `DOMAIN_TYPEHASH` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bytes32` |

### `EXECUTE_TYPEHASH` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bytes32` |

### `eventEmitter` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `factory` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `getBalance` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `getMetadata` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `tuple` |

### `getNonce` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `getTokenBalance` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `token` | `address` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `uint256` |

### `getTransaction` `view`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `txNonce` | `uint256` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `tuple` |

### `isAssigned` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bool` |

### `paused` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bool` |

### `ssoRegistry` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

### `walletOwner` `view`

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `address` |

## Write Functions

### `assignOwner`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `newOwner` | `address` |

### `execute` `payable`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `to` | `address` |
| `value` | `uint256` |
| `data` | `bytes` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bytes` |

### `executeBatch` `payable`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `targets` | `address[]` |
| `values` | `uint256[]` |
| `datas` | `bytes[]` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `results` | `bytes[]` |

### `executeWithSignature` `payable`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `to` | `address` |
| `value` | `uint256` |
| `data` | `bytes` |
| `deadline` | `uint256` |
| `signature` | `bytes` |

**Returns:**

| Name | Type |
| ---- | ---- |
| `arg0` | `bytes` |

### `initialize`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `owner_` | `address` |
| `eventEmitter_` | `address` |
| `ssoRegistry_` | `address` |

### `pause`

### `setMetadata`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `metadata_` | `tuple` |

### `transferOwnership`

**Parameters:**

| Name | Type |
| ---- | ---- |
| `newOwner` | `address` |

### `unpause`

## Events

### `BatchExecuted`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `count` | `uint256` | No |
| `startNonce` | `uint256` | No |

### `Executed`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `to` | `address` | Yes |
| `value` | `uint256` | No |
| `nonce` | `uint256` | No |
| `success` | `bool` | No |

### `MetadataUpdated`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `argusId` | `string` | No |
| `onchainId` | `address` | Yes |
| `userAlias` | `string` | No |

### `OwnerAssigned`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `owner` | `address` | Yes |

### `Paused`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `account` | `address` | No |

### `Received`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `from` | `address` | Yes |
| `value` | `uint256` | No |

### `SessionKeyAuthorized`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `signer` | `address` | Yes |

### `SessionKeyRevoked`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `signer` | `address` | Yes |

### `Unpaused`

| Name | Type | Indexed |
| ---- | ---- | ------- |
| `account` | `address` | No |

## Custom Errors

### `AlreadyInitialized`

### `ArrayLengthMismatch`

### `CallerNotFactory`

| Name | Type |
| ---- | ---- |
| `caller` | `address` |

### `ECDSAInvalidSignature`

### `ECDSAInvalidSignatureLength`

| Name | Type |
| ---- | ---- |
| `length` | `uint256` |

### `ECDSAInvalidSignatureS`

| Name | Type |
| ---- | ---- |
| `s` | `bytes32` |

### `EnforcedPause`

### `ExecutionFailed`

| Name | Type |
| ---- | ---- |
| `to` | `address` |
| `value` | `uint256` |
| `data` | `bytes` |

### `ExpectedPause`

### `ExpiredDeadline`

| Name | Type |
| ---- | ---- |
| `deadline` | `uint256` |

### `InsufficientBalance`

| Name | Type |
| ---- | ---- |
| `required` | `uint256` |
| `available` | `uint256` |

### `InvalidMetadata`

### `InvalidSignature`

### `NotInitialized`

### `ReentrancyGuardReentrantCall`

### `UnauthorizedCaller`

| Name | Type |
| ---- | ---- |
| `caller` | `address` |

### `WalletAlreadyAssigned`
