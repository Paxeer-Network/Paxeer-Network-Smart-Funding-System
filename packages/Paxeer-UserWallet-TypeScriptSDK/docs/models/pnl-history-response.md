# PnlHistoryResponse

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `address` | `string` | Yes |  |
| `days_requested` | `number` | Yes |  |
| `history` | `{ date: string; total_value_usd: string; native_value_usd: string; token_value_usd: string; pnl_usd: string; pnl_percent: string }[]` | Yes |  |

### TypeScript Interface

```typescript
interface PnlHistoryResponse {
  address: string;
  days_requested: number;
  history: { date: string; total_value_usd: string; native_value_usd: string; token_value_usd: string; pnl_usd: string; pnl_percent: string }[];
}
```

