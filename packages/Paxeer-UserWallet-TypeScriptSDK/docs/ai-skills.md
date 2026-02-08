# AI Skills Reference

This document describes all available AI skills for the **Paxeer User Stats API** API.

These skills can be used with:
- **MCP Server** — for Claude, Windsurf, Cursor, and other MCP-compatible clients
- **OpenAI Function Calling** — for GPT-4 and compatible models
- **LangChain Tools** — for LangChain agents
- **Direct execution** — via the `executeSkill()` function

## Summary

| Category | Skills | Description |
|----------|--------|-------------|
| Health | 1 | Service health endpoints |
| Tokens | 5 | Token metadata and synchronization |
| Portfolio | 3 | Portfolio data and holdings |
| PNL | 2 | Profit and loss tracking |
| Charts | 4 | Time-series chart data |

**Total skills: 15**

---

## Health

### `healthCheck`

**Health check**

Returns service health status and version

- **Method**: `GET`
- **Path**: `/health`

**Example:**

```typescript
const result = await executeSkill('healthCheck', {});
```

---

## Tokens

### `listTokens`

**List token statistics**

Returns token metadata statistics and counts

- **Method**: `GET`
- **Path**: `/api/v1/tokens`

**Example:**

```typescript
const result = await executeSkill('listTokens', {});
```

### `auditTokens`

**Audit token metadata**

Returns detailed token metadata completeness report

- **Method**: `GET`
- **Path**: `/api/v1/tokens/audit`

**Example:**

```typescript
const result = await executeSkill('auditTokens', {});
```

### `syncTokens`

**Sync tokens from Paxscan** *(mutation)*

Triggers synchronization of token metadata from Paxscan database

- **Method**: `POST`
- **Path**: `/api/v1/tokens/sync`

**Example:**

```typescript
const result = await executeSkill('syncTokens', {});
```

### `getToken`

**Get token metadata**

Returns metadata for a specific token by contract address

- **Method**: `GET`
- **Path**: `/api/v1/tokens/{address}`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Token contract address |

**Example:**

```typescript
const result = await executeSkill('getToken', {
  "address": "example-address"
});
```

### `syncPrices`

**Sync token prices** *(mutation)*

Triggers price synchronization from all sources:
- Network pools (HLPMM, SwapDex)
- External APIs (Moralis)
- Fixed stablecoin prices


- **Method**: `POST`
- **Path**: `/api/v1/prices/sync`

**Example:**

```typescript
const result = await executeSkill('syncPrices', {});
```

---

## Portfolio

### `getPortfolio`

**Get full portfolio**

Returns complete portfolio summary including native balance, all token holdings, and totals

- **Method**: `GET`
- **Path**: `/api/v1/portfolio/{address}`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |

**Example:**

```typescript
const result = await executeSkill('getPortfolio', {
  "address": "example-address"
});
```

### `getHoldings`

**Get token holdings**

Returns only the token holdings for a wallet address

- **Method**: `GET`
- **Path**: `/api/v1/portfolio/{address}/holdings`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |

**Example:**

```typescript
const result = await executeSkill('getHoldings', {
  "address": "example-address"
});
```

### `getTransactions`

**Get transactions**

Returns transaction history including native transfers and token transfers

- **Method**: `GET`
- **Path**: `/api/v1/portfolio/{address}/transactions`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `limit` | integer | No | Maximum number of transactions to return (max 100) |
| `offset` | integer | No | Number of transactions to skip for pagination |

**Example:**

```typescript
const result = await executeSkill('getTransactions', {
  "address": "example-address"
});
```

---

## PNL

### `getBalance`

**Get balance with daily PNL**

Returns current total balance in USD with daily profit/loss calculation

- **Method**: `GET`
- **Path**: `/api/v1/portfolio/{address}/balance`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |

**Example:**

```typescript
const result = await executeSkill('getBalance', {
  "address": "example-address"
});
```

### `getPnlHistory`

**Get PNL history**

Returns historical daily PNL data for charting and analysis

- **Method**: `GET`
- **Path**: `/api/v1/portfolio/{address}/pnl`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `days` | integer | No | Number of days of history (max 365) |

**Example:**

```typescript
const result = await executeSkill('getPnlHistory', {
  "address": "example-address"
});
```

---

## Charts

### `getPortfolioValueChart`

**Portfolio value chart**

Returns time-series data of total portfolio value for charting

- **Method**: `GET`
- **Path**: `/api/v1/portfolio/{address}/charts/value`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `days` | integer | No | Number of days of data to return (max 365) |

**Example:**

```typescript
const result = await executeSkill('getPortfolioValueChart', {
  "address": "example-address"
});
```

### `getPnlChart`

**Daily PNL chart**

Returns time-series data of daily profit/loss for charting

- **Method**: `GET`
- **Path**: `/api/v1/portfolio/{address}/charts/pnl`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `days` | integer | No | Number of days of data to return (max 365) |

**Example:**

```typescript
const result = await executeSkill('getPnlChart', {
  "address": "example-address"
});
```

### `getHoldingsChart`

**Holdings count chart**

Returns time-series data of number of token holdings

- **Method**: `GET`
- **Path**: `/api/v1/portfolio/{address}/charts/holdings`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `days` | integer | No | Number of days of data to return (max 365) |

**Example:**

```typescript
const result = await executeSkill('getHoldingsChart', {
  "address": "example-address"
});
```

### `getTxVolumeChart`

**Transaction volume chart**

Returns time-series data of daily transaction volume in USD

- **Method**: `GET`
- **Path**: `/api/v1/portfolio/{address}/charts/tx-volume`

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Ethereum-style wallet address (0x-prefixed, 40 hex characters) |
| `days` | integer | No | Number of days of data to return (max 365) |

**Example:**

```typescript
const result = await executeSkill('getTxVolumeChart', {
  "address": "example-address"
});
```

