# BalanceResponse

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `address` | `string` | Yes |  |
| `native_balance_usd` | `string` | Yes | Native PAX balance in USD (2 decimals) |
| `token_balance_usd` | `string` | Yes | Total token value in USD (2 decimals) |
| `total_balance_usd` | `string` | Yes | Total portfolio value in USD (2 decimals) |
| `native_balance` | `string` | Yes | Native PAX balance (human-readable) |
| `token_count` | `number` | Yes |  |
| `daily_pnl_usd` | `string \| null` | No | Daily profit/loss in USD |
| `daily_pnl_percent` | `string \| null` | No | Daily profit/loss percentage |
| `computed_at` | `string` | Yes |  |

### TypeScript Interface

```typescript
interface BalanceResponse {
  address: string;
  native_balance_usd: string;
  token_balance_usd: string;
  total_balance_usd: string;
  native_balance: string;
  token_count: number;
  daily_pnl_usd?: string | null;
  daily_pnl_percent?: string | null;
  computed_at: string;
}
```

