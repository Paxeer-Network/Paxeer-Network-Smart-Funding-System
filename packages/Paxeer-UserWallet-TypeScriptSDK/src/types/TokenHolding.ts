export interface TokenHolding {
  /** Token contract address */
  contract_address: string;
  symbol?: string | null;
  name?: string | null;
  decimals: number;
  /** Raw balance before decimal adjustment */
  balance_raw: string;
  /** Human-readable balance */
  balance: string;
  /** Current USD price per token */
  price_usd?: string | null;
  /** Total USD value of holding */
  value_usd?: string | null;
  icon_url?: string | null;
}
