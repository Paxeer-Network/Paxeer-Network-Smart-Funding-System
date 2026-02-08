# Portfolio API

Portfolio data and holdings

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/portfolio/{address}` | Get full portfolio |
| `GET` | `/api/v1/portfolio/{address}/holdings` | Get token holdings |
| `GET` | `/api/v1/portfolio/{address}/transactions` | Get transactions |

## GET /api/v1/portfolio/{address}

**Get full portfolio**

Returns complete portfolio summary including native balance, all token holdings, and totals

### Usage

```typescript
import { getPortfolio } from './api';

const result = await getPortfolio({
  address: 'example',
});
```

### React Hook

```typescript
import { useGetPortfolio } from './hooks';

const { data, isLoading, error } = useGetPortfolio({
  address: 'example',
});
```

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| `address` | path | `string` | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Portfolio data | `{ address: string; native_balance: { symbol: string; balance_raw: string; balance: string; price_usd?: string; value_usd?: string }; token_holdings: { contract_address: string; symbol?: string; name?: string; decimals: number; balance_raw: string; balance: string; price_usd?: string; value_usd?: string; icon_url?: string }[]; total_value_usd?: string; token_count: number; transaction_count: number; transfer_count: number; computed_at: string }` |
| 500 | Internal server error | `string` |

---

## GET /api/v1/portfolio/{address}/holdings

**Get token holdings**

Returns only the token holdings for a wallet address

### Usage

```typescript
import { getHoldings } from './api';

const result = await getHoldings({
  address: 'example',
});
```

### React Hook

```typescript
import { useGetHoldings } from './hooks';

const { data, isLoading, error } = useGetHoldings({
  address: 'example',
});
```

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| `address` | path | `string` | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Token holdings list | `{ contract_address: string; symbol?: string; name?: string; decimals: number; balance_raw: string; balance: string; price_usd?: string; value_usd?: string; icon_url?: string }[]` |
| 500 | Internal server error | `string` |

---

## GET /api/v1/portfolio/{address}/transactions

**Get transactions**

Returns transaction history including native transfers and token transfers

### Usage

```typescript
import { getTransactions } from './api';

const result = await getTransactions({
  address: 'example',
  limit: 1,
  offset: 1,
});
```

### React Hook

```typescript
import { useGetTransactions } from './hooks';

const { data, isLoading, error } = useGetTransactions({
  address: 'example',
  limit: 1,
  offset: 1,
});
```

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| `address` | path | `string` | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `limit` | query | `number` | No | Maximum number of transactions to return (max 100) |
| `offset` | query | `number` | No | Number of transactions to skip for pagination |

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Transaction list | `{ address: string; transactions: { tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address?: string; value: string; value_raw: string; gas_used: string; gas_price: string; gas_fee: string; status: boolean; direction: 'in' | 'out'; tx_type: string; token_transfers: { tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address: string; token_address: string; token_symbol?: string; token_name?: string; token_decimals: number; amount: string; amount_raw: string; token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155'; direction: 'in' | 'out'; log_index: number }[] }[]; token_transfers: { tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address: string; token_address: string; token_symbol?: string; token_name?: string; token_decimals: number; amount: string; amount_raw: string; token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155'; direction: 'in' | 'out'; log_index: number }[]; limit: number; offset: number }` |
| 500 | Internal server error | `string` |

---

