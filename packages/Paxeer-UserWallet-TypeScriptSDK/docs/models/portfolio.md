# Portfolio

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `address` | `string` | Yes | Wallet address |
| `native_balance` | `{ symbol: string; balance_raw: string; balance: string; price_usd?: string; value_usd?: string }` | Yes |  |
| `token_holdings` | `{ contract_address: string; symbol?: string; name?: string; decimals: number; balance_raw: string; balance: string; price_usd?: string; value_usd?: string; icon_url?: string }[]` | Yes |  |
| `total_value_usd` | `string \| null` | No | Total portfolio value in USD (2 decimal string) |
| `token_count` | `number` | Yes | Number of unique tokens held |
| `transaction_count` | `number` | Yes | Total transaction count |
| `transfer_count` | `number` | Yes | Total token transfer count |
| `computed_at` | `string` | Yes | When the portfolio was computed |

### TypeScript Interface

```typescript
interface Portfolio {
  address: string;
  native_balance: { symbol: string; balance_raw: string; balance: string; price_usd?: string; value_usd?: string };
  token_holdings: { contract_address: string; symbol?: string; name?: string; decimals: number; balance_raw: string; balance: string; price_usd?: string; value_usd?: string; icon_url?: string }[];
  total_value_usd?: string | null;
  token_count: number;
  transaction_count: number;
  transfer_count: number;
  computed_at: string;
}
```

