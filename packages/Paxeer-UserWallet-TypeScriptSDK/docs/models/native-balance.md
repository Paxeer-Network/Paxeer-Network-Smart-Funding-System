# NativeBalance

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `symbol` | `string` | Yes | Native coin symbol (PAX) |
| `balance_raw` | `string` | Yes | Raw balance in wei |
| `balance` | `string` | Yes | Human-readable balance |
| `price_usd` | `string \| null` | No | Current USD price |
| `value_usd` | `string \| null` | No | Total USD value |

### TypeScript Interface

```typescript
interface NativeBalance {
  symbol: string;
  balance_raw: string;
  balance: string;
  price_usd?: string | null;
  value_usd?: string | null;
}
```

