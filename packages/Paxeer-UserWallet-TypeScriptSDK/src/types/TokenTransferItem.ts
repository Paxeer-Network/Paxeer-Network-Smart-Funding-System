export interface TokenTransferItem {
  tx_hash: string;
  block_number: number;
  timestamp?: string | null;
  from_address: string;
  to_address: string;
  token_address: string;
  token_symbol?: string | null;
  token_name?: string | null;
  token_decimals: number;
  /** Human-readable amount */
  amount: string;
  /** Raw amount before decimal adjustment */
  amount_raw: string;
  token_type: 'ERC-20' | 'ERC-721' | 'ERC-1155';
  direction: 'in' | 'out';
  log_index: number;
}
