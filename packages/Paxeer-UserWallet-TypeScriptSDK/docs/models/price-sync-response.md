# PriceSyncResponse

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `success` | `boolean` | No |  |
| `total_tokens` | `number` | No |  |
| `updated` | `number` | No |  |
| `by_source` | `{ network?: number; external?: number; stablecoin?: number }` | No |  |
| `native_pax_price` | `string` | No | Current PAX native coin price in USD |

### TypeScript Interface

```typescript
interface PriceSyncResponse {
  success?: boolean;
  total_tokens?: number;
  updated?: number;
  by_source?: { network?: number; external?: number; stablecoin?: number };
  native_pax_price?: string;
}
```

