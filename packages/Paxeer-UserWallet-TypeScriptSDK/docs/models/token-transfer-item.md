# TokenTransferItem

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `tx_hash` | `string` | Yes |  |
| `block_number` | `number` | Yes |  |
| `timestamp` | `string \| null` | No |  |
| `from_address` | `string` | Yes |  |
| `to_address` | `string` | Yes |  |
| `token_address` | `string` | Yes |  |
| `token_symbol` | `string \| null` | No |  |
| `token_name` | `string \| null` | No |  |
| `token_decimals` | `number` | Yes |  |
| `amount` | `string` | Yes | Human-readable amount |
| `amount_raw` | `string` | Yes | Raw amount before decimal adjustment |
| `token_type` | `'ERC-20' | 'ERC-721' | 'ERC-1155'` | Yes |  |
| `direction` | `'in' | 'out'` | Yes |  |
| `log_index` | `number` | Yes |  |

### TypeScript Interface

```typescript
interface TokenTransferItem {
  tx_hash: string;
  block_number: number;
  timestamp?: string | null;
  from_address: string;
  to_address: string;
  token_address: string;
  token_symbol?: string | null;
  token_name?: string | null;
  token_decimals: number;
  amount: string;
  amount_raw: string;
  token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155';
  direction: 'in' | 'out';
  log_index: number;
}
```

