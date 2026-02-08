# ChartResponse

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `address` | `string` | Yes |  |
| `chart_type` | `'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume'` | Yes |  |
| `days` | `number` | Yes |  |
| `data` | `{ date: string; value: string }[]` | Yes |  |

### TypeScript Interface

```typescript
interface ChartResponse {
  address: string;
  chart_type: 'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume';
  days: number;
  data: { date: string; value: string }[];
}
```

