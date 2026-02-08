export interface PriceSyncResponse {
  success?: boolean;
  total_tokens?: number;
  updated?: number;
  by_source?: { network?: number; external?: number; stablecoin?: number };
  /** Current PAX native coin price in USD */
  native_pax_price?: string;
}
