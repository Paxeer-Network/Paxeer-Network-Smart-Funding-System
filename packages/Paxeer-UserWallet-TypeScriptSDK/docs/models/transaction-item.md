# TransactionItem

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `tx_hash` | `string` | Yes | Transaction hash |
| `block_number` | `number` | Yes |  |
| `timestamp` | `string \| null` | No |  |
| `from_address` | `string` | Yes |  |
| `to_address` | `string \| null` | No |  |
| `value` | `string` | Yes | Value in PAX (human-readable) |
| `value_raw` | `string` | Yes | Value in wei |
| `gas_used` | `string` | Yes |  |
| `gas_price` | `string` | Yes |  |
| `gas_fee` | `string` | Yes | Gas fee in PAX |
| `status` | `boolean` | Yes | Transaction success status |
| `direction` | `'in' | 'out'` | Yes |  |
| `tx_type` | `string` | Yes |  |
| `token_transfers` | `{ tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address: string; token_address: string; token_symbol?: string; token_name?: string; token_decimals: number; amount: string; amount_raw: string; token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155'; direction: 'in' | 'out'; log_index: number }[]` | Yes |  |

### TypeScript Interface

```typescript
interface TransactionItem {
  tx_hash: string;
  block_number: number;
  timestamp?: string | null;
  from_address: string;
  to_address?: string | null;
  value: string;
  value_raw: string;
  gas_used: string;
  gas_price: string;
  gas_fee: string;
  status: boolean;
  direction: 'in' | 'out';
  tx_type: string;
  token_transfers: { tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address: string; token_address: string; token_symbol?: string; token_name?: string; token_decimals: number; amount: string; amount_raw: string; token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155'; direction: 'in' | 'out'; log_index: number }[];
}
```

