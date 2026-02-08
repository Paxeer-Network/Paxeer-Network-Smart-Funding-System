export interface BalanceResponse {
  address: string;
  /** Native PAX balance in USD (2 decimals) */
  native_balance_usd: string;
  /** Total token value in USD (2 decimals) */
  token_balance_usd: string;
  /** Total portfolio value in USD (2 decimals) */
  total_balance_usd: string;
  /** Native PAX balance (human-readable) */
  native_balance: string;
  token_count: number;
  /** Daily profit/loss in USD */
  daily_pnl_usd?: string | null;
  /** Daily profit/loss percentage */
  daily_pnl_percent?: string | null;
  computed_at: string;
}
