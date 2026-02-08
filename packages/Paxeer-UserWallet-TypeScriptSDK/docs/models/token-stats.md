# TokenStats

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `total` | `number` | No | Total number of tokens |
| `complete_basic` | `number` | No | Tokens with complete basic metadata |
| `with_icon` | `number` | No | Tokens with icon URLs |
| `with_price` | `number` | No | Tokens with price data |
| `erc20_count` | `number` | No | Number of ERC-20 tokens |
| `erc721_count` | `number` | No | Number of ERC-721 tokens |

### TypeScript Interface

```typescript
interface TokenStats {
  total?: number;
  complete_basic?: number;
  with_icon?: number;
  with_price?: number;
  erc20_count?: number;
  erc721_count?: number;
}
```

