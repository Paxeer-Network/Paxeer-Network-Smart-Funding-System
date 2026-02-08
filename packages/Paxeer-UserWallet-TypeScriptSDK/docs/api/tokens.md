# Tokens API

Token metadata and synchronization

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/tokens` | List token statistics |
| `GET` | `/api/v1/tokens/audit` | Audit token metadata |
| `POST` | `/api/v1/tokens/sync` | Sync tokens from Paxscan |
| `GET` | `/api/v1/tokens/{address}` | Get token metadata |
| `POST` | `/api/v1/prices/sync` | Sync token prices |

## GET /api/v1/tokens

**List token statistics**

Returns token metadata statistics and counts

### Usage

```typescript
import { listTokens } from './api';

const result = await listTokens();
```

### React Hook

```typescript
import { useListTokens } from './hooks';

const { data, isLoading, error } = useListTokens();
```

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Token statistics | `{ total?: number; complete_basic?: number; with_icon?: number; with_price?: number; erc20_count?: number; erc721_count?: number }` |
| 500 | Internal server error | `string` |

---

## GET /api/v1/tokens/audit

**Audit token metadata**

Returns detailed token metadata completeness report

### Usage

```typescript
import { auditTokens } from './api';

const result = await auditTokens();
```

### React Hook

```typescript
import { useAuditTokens } from './hooks';

const { data, isLoading, error } = useAuditTokens();
```

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Token audit report | `{ total?: number; complete_basic?: number; with_icon?: number; with_price?: number; verified?: number; by_type?: { erc20?: number; erc721?: number; erc1155?: number }; needing_enrichment_count?: number; needing_enrichment_sample?: { address?: string; symbol?: string; missing_icon?: boolean; missing_price?: boolean; missing_decimals?: boolean }[] }` |
| 500 | Internal server error | `string` |

---

## POST /api/v1/tokens/sync

**Sync tokens from Paxscan**

Triggers synchronization of token metadata from Paxscan database

### Usage

```typescript
import { syncTokens } from './api';

const result = await syncTokens();
```

### React Hook

```typescript
import { useSyncTokensMutation } from './hooks';

const { mutate, isLoading } = useSyncTokensMutation();

mutate();
```

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Sync completed | `{ success?: boolean; total?: number; complete?: number; partial?: number; missing?: number; with_icon?: number }` |
| 500 | Internal server error | `string` |

---

## GET /api/v1/tokens/{address}

**Get token metadata**

Returns metadata for a specific token by contract address

### Usage

```typescript
import { getToken } from './api';

const result = await getToken({
  address: 'example',
});
```

### React Hook

```typescript
import { useGetToken } from './hooks';

const { data, isLoading, error } = useGetToken({
  address: 'example',
});
```

### Parameters

| Name | In | Type | Required | Description |
|------|-----|------|----------|-------------|
| `address` | path | `string` | Yes | Token contract address |

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Token metadata | `{ address?: string; symbol?: string; name?: string; decimals?: number; icon_url?: string; price_usd?: string; token_type?: 'ERC-20' | 'ERC-721' | 'ERC-1155' }` |
| 404 | Token not found | No content |
| 500 | Internal server error | `string` |

---

## POST /api/v1/prices/sync

**Sync token prices**

Triggers price synchronization from all sources:
- Network pools (HLPMM, SwapDex)
- External APIs (Moralis)
- Fixed stablecoin prices


### Usage

```typescript
import { syncPrices } from './api';

const result = await syncPrices();
```

### React Hook

```typescript
import { useSyncPricesMutation } from './hooks';

const { mutate, isLoading } = useSyncPricesMutation();

mutate();
```

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Price sync completed | `{ success?: boolean; total_tokens?: number; updated?: number; by_source?: { network?: number; external?: number; stablecoin?: number }; native_pax_price?: string }` |
| 500 | Internal server error | `string` |

---

