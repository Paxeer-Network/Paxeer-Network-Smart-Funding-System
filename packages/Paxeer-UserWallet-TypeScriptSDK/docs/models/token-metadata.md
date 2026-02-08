# TokenMetadata

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `address` | `string` | No |  |
| `symbol` | `string` | No |  |
| `name` | `string` | No |  |
| `decimals` | `number` | No |  |
| `icon_url` | `string \| null` | No |  |
| `price_usd` | `string \| null` | No |  |
| `token_type` | `'ERC-20' | 'ERC-721' | 'ERC-1155'` | No |  |

### TypeScript Interface

```typescript
interface TokenMetadata {
  address?: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  icon_url?: string | null;
  price_usd?: string | null;
  token_type?: 'ERC-20' | 'ERC-721' | 'ERC-1155';
}
```

