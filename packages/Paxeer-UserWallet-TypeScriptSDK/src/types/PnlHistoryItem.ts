export interface PnlHistoryItem {
  date: string;
  total_value_usd: string;
  native_value_usd: string;
  token_value_usd: string;
  /** Daily PNL in USD */
  pnl_usd: string;
  /** Daily PNL percentage */
  pnl_percent: string;
}
