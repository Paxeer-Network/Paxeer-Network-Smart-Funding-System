# Charts API

Time-series chart data

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/portfolio/{address}/charts/value` | Portfolio value chart |
| `GET` | `/api/v1/portfolio/{address}/charts/pnl` | Daily PNL chart |
| `GET` | `/api/v1/portfolio/{address}/charts/holdings` | Holdings count chart |
| `GET` | `/api/v1/portfolio/{address}/charts/tx-volume` | Transaction volume chart |

## GET /api/v1/portfolio/{address}/charts/value

**Portfolio value chart**

Returns time-series data of total portfolio value for charting

### Usage

```typescript
import { getPortfolioValueChart } from './api';

const result = await getPortfolioValueChart({
  address: 'example',
  days: 1,
});
```

### React Hook

```typescript
import { useGetPortfolioValueChart } from './hooks';

const { data, isLoading, error } = useGetPortfolioValueChart({
  address: 'example',
  days: 1,
});
```

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| `address` | path | `string` | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `days` | query | `number` | No | Number of days of data to return (max 365) |

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Chart data | `{ address: string; chart_type: 'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume'; days: number; data: { date: string; value: string }[] }` |
| 500 | Internal server error | `string` |

---

## GET /api/v1/portfolio/{address}/charts/pnl

**Daily PNL chart**

Returns time-series data of daily profit/loss for charting

### Usage

```typescript
import { getPnlChart } from './api';

const result = await getPnlChart({
  address: 'example',
  days: 1,
});
```

### React Hook

```typescript
import { useGetPnlChart } from './hooks';

const { data, isLoading, error } = useGetPnlChart({
  address: 'example',
  days: 1,
});
```

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| `address` | path | `string` | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `days` | query | `number` | No | Number of days of data to return (max 365) |

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Chart data | `{ address: string; chart_type: 'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume'; days: number; data: { date: string; value: string }[] }` |
| 500 | Internal server error | `string` |

---

## GET /api/v1/portfolio/{address}/charts/holdings

**Holdings count chart**

Returns time-series data of number of token holdings

### Usage

```typescript
import { getHoldingsChart } from './api';

const result = await getHoldingsChart({
  address: 'example',
  days: 1,
});
```

### React Hook

```typescript
import { useGetHoldingsChart } from './hooks';

const { data, isLoading, error } = useGetHoldingsChart({
  address: 'example',
  days: 1,
});
```

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| `address` | path | `string` | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `days` | query | `number` | No | Number of days of data to return (max 365) |

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Chart data | `{ address: string; chart_type: 'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume'; days: number; data: { date: string; value: string }[] }` |
| 500 | Internal server error | `string` |

---

## GET /api/v1/portfolio/{address}/charts/tx-volume

**Transaction volume chart**

Returns time-series data of daily transaction volume in USD

### Usage

```typescript
import { getTxVolumeChart } from './api';

const result = await getTxVolumeChart({
  address: 'example',
  days: 1,
});
```

### React Hook

```typescript
import { useGetTxVolumeChart } from './hooks';

const { data, isLoading, error } = useGetTxVolumeChart({
  address: 'example',
  days: 1,
});
```

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| `address` | path | `string` | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `days` | query | `number` | No | Number of days of data to return (max 365) |

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Chart data | `{ address: string; chart_type: 'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume'; days: number; data: { date: string; value: string }[] }` |
| 500 | Internal server error | `string` |

---

