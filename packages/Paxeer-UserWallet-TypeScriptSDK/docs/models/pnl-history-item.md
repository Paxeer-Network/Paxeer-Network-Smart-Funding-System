# PnlHistoryItem

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `date` | `string` | Yes |  |
| `total_value_usd` | `string` | Yes |  |
| `native_value_usd` | `string` | Yes |  |
| `token_value_usd` | `string` | Yes |  |
| `pnl_usd` | `string` | Yes | Daily PNL in USD |
| `pnl_percent` | `string` | Yes | Daily PNL percentage |

### TypeScript Interface

```typescript
interface PnlHistoryItem {
  date: string;
  total_value_usd: string;
  native_value_usd: string;
  token_value_usd: string;
  pnl_usd: string;
  pnl_percent: string;
}
```

