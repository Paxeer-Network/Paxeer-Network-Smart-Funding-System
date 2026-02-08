# TokenAuditResponse

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `total` | `number` | No |  |
| `complete_basic` | `number` | No |  |
| `with_icon` | `number` | No |  |
| `with_price` | `number` | No |  |
| `verified` | `number` | No |  |
| `by_type` | `{ erc20?: number; erc721?: number; erc1155?: number }` | No |  |
| `needing_enrichment_count` | `number` | No |  |
| `needing_enrichment_sample` | `{ address?: string; symbol?: string; missing_icon?: boolean; missing_price?: boolean; missing_decimals?: boolean }[]` | No |  |

### TypeScript Interface

```typescript
interface TokenAuditResponse {
  total?: number;
  complete_basic?: number;
  with_icon?: number;
  with_price?: number;
  verified?: number;
  by_type?: { erc20?: number; erc721?: number; erc1155?: number };
  needing_enrichment_count?: number;
  needing_enrichment_sample?: { address?: string; symbol?: string; missing_icon?: boolean; missing_price?: boolean; missing_decimals?: boolean }[];
}
```

