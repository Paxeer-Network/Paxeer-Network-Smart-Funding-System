export interface Portfolio {
  /** Wallet address */
  address: string;
  native_balance: {
    symbol: string;
    balance_raw: string;
    balance: string;
    price_usd?: string;
    value_usd?: string;
  };
  token_holdings: {
    contract_address: string;
    symbol?: string;
    name?: string;
    decimals: number;
    balance_raw: string;
    balance: string;
    price_usd?: string;
    value_usd?: string;
    icon_url?: string;
  }[];
  /** Total portfolio value in USD (2 decimal string) */
  total_value_usd?: string | null;
  /** Number of unique tokens held */
  token_count: number;
  /** Total transaction count */
  transaction_count: number;
  /** Total token transfer count */
  transfer_count: number;
  /** When the portfolio was computed */
  computed_at: string;
}
