export interface TransactionItem {
  /** Transaction hash */
  tx_hash: string;
  block_number: number;
  timestamp?: string | null;
  from_address: string;
  to_address?: string | null;
  /** Value in PAX (human-readable) */
  value: string;
  /** Value in wei */
  value_raw: string;
  gas_used: string;
  gas_price: string;
  /** Gas fee in PAX */
  gas_fee: string;
  /** Transaction success status */
  status: boolean;
  direction: 'in' | 'out';
  tx_type: string;
  token_transfers: {
    tx_hash: string;
    block_number: number;
    timestamp?: string;
    from_address: string;
    to_address: string;
    token_address: string;
    token_symbol?: string;
    token_name?: string;
    token_decimals: number;
    amount: string;
    amount_raw: string;
    token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155';
    direction: 'in' | 'out';
    log_index: number;
  }[];
}
