export interface NativeBalance {
  /** Native coin symbol (PAX) */
  symbol: string;
  /** Raw balance in wei */
  balance_raw: string;
  /** Human-readable balance */
  balance: string;
  /** Current USD price */
  price_usd?: string | null;
  /** Total USD value */
  value_usd?: string | null;
}
