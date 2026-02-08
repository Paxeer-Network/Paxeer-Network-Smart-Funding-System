# PNL API

Profit and loss tracking

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/portfolio/{address}/balance` | Get balance with daily PNL |
| `GET` | `/api/v1/portfolio/{address}/pnl` | Get PNL history |

## GET /api/v1/portfolio/{address}/balance

**Get balance with daily PNL**

Returns current total balance in USD with daily profit/loss calculation

### Usage

```typescript
import { getBalance } from './api';

const result = await getBalance({
  address: 'example',
});
```

### React Hook

```typescript
import { useGetBalance } from './hooks';

const { data, isLoading, error } = useGetBalance({
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
| 200 | Balance with PNL | `{ address: string; native_balance_usd: string; token_balance_usd: string; total_balance_usd: string; native_balance: string; token_count: number; daily_pnl_usd?: string; daily_pnl_percent?: string; computed_at: string }` |
| 500 | Internal server error | `string` |

---

## GET /api/v1/portfolio/{address}/pnl

**Get PNL history**

Returns historical daily PNL data for charting and analysis

### Usage

```typescript
import { getPnlHistory } from './api';

const result = await getPnlHistory({
  address: 'example',
  days: 1,
});
```

### React Hook

```typescript
import { useGetPnlHistory } from './hooks';

const { data, isLoading, error } = useGetPnlHistory({
  address: 'example',
  days: 1,
});
```

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| `address` | path | `string` | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `days` | query | `number` | No | Number of days of history (max 365) |

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | PNL history | `{ address: string; days_requested: number; history: { date: string; total_value_usd: string; native_value_usd: string; token_value_usd: string; pnl_usd: string; pnl_percent: string }[] }` |
| 500 | Internal server error | `string` |

---

