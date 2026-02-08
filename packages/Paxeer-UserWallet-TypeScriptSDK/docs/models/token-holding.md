# TokenHolding

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `contract_address` | `string` | Yes | Token contract address |
| `symbol` | `string \| null` | No |  |
| `name` | `string \| null` | No |  |
| `decimals` | `number` | Yes |  |
| `balance_raw` | `string` | Yes | Raw balance before decimal adjustment |
| `balance` | `string` | Yes | Human-readable balance |
| `price_usd` | `string \| null` | No | Current USD price per token |
| `value_usd` | `string \| null` | No | Total USD value of holding |
| `icon_url` | `string \| null` | No |  |

### TypeScript Interface

```typescript
interface TokenHolding {
  contract_address: string;
  symbol?: string | null;
  name?: string | null;
  decimals: number;
  balance_raw: string;
  balance: string;
  price_usd?: string | null;
  value_usd?: string | null;
  icon_url?: string | null;
}
```

