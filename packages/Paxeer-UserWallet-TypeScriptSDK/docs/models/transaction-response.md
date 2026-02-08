# TransactionResponse

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `address` | `string` | Yes |  |
| `transactions` | `{ tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address?: string; value: string; value_raw: string; gas_used: string; gas_price: string; gas_fee: string; status: boolean; direction: 'in' | 'out'; tx_type: string; token_transfers: { tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address: string; token_address: string; token_symbol?: string; token_name?: string; token_decimals: number; amount: string; amount_raw: string; token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155'; direction: 'in' | 'out'; log_index: number }[] }[]` | Yes |  |
| `token_transfers` | `{ tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address: string; token_address: string; token_symbol?: string; token_name?: string; token_decimals: number; amount: string; amount_raw: string; token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155'; direction: 'in' | 'out'; log_index: number }[]` | Yes |  |
| `limit` | `number` | Yes |  |
| `offset` | `number` | Yes |  |

### TypeScript Interface

```typescript
interface TransactionResponse {
  address: string;
  transactions: { tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address?: string; value: string; value_raw: string; gas_used: string; gas_price: string; gas_fee: string; status: boolean; direction: 'in' | 'out'; tx_type: string; token_transfers: { tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address: string; token_address: string; token_symbol?: string; token_name?: string; token_decimals: number; amount: string; amount_raw: string; token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155'; direction: 'in' | 'out'; log_index: number }[] }[];
  token_transfers: { tx_hash: string; block_number: number; timestamp?: string; from_address: string; to_address: string; token_address: string; token_symbol?: string; token_name?: string; token_decimals: number; amount: string; amount_raw: string; token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155'; direction: 'in' | 'out'; log_index: number }[];
  limit: number;
  offset: number;
}
```

