export type HealthCheckResponse = { status: 'ok'; version: string };

export type ListTokensResponse = {
  total?: number;
  complete_basic?: number;
  with_icon?: number;
  with_price?: number;
  erc20_count?: number;
  erc721_count?: number;
};

export type AuditTokensResponse = {
  total?: number;
  complete_basic?: number;
  with_icon?: number;
  with_price?: number;
  verified?: number;
  by_type?: { erc20?: number; erc721?: number; erc1155?: number };
  needing_enrichment_count?: number;
  needing_enrichment_sample?: {
    address?: string;
    symbol?: string;
    missing_icon?: boolean;
    missing_price?: boolean;
    missing_decimals?: boolean;
  }[];
};

export type SyncTokensResponse = {
  success?: boolean;
  total?: number;
  complete?: number;
  partial?: number;
  missing?: number;
  with_icon?: number;
};

export interface GetTokenRequest {
  /** Token contract address */
  address: string;
}

export type GetTokenResponse = {
  address?: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  icon_url?: string;
  price_usd?: string;
  token_type?: 'ERC-20' | 'ERC-721' | 'ERC-1155';
};

export type SyncPricesResponse = {
  success?: boolean;
  total_tokens?: number;
  updated?: number;
  by_source?: { network?: number; external?: number; stablecoin?: number };
  native_pax_price?: string;
};

export interface GetPortfolioRequest {
  /** Ethereum-style wallet address (0x-prefixed, 40 hex characters) */
  address: string;
}

export type GetPortfolioResponse = {
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
  total_value_usd?: string;
  token_count: number;
  transaction_count: number;
  transfer_count: number;
  computed_at: string;
};

export interface GetHoldingsRequest {
  /** Ethereum-style wallet address (0x-prefixed, 40 hex characters) */
  address: string;
}

export type GetHoldingsResponse = {
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

export interface GetTransactionsRequest {
  /** Ethereum-style wallet address (0x-prefixed, 40 hex characters) */
  address: string;
  /** Maximum number of transactions to return (max 100) */
  limit?: number;
  /** Number of transactions to skip for pagination */
  offset?: number;
}

export type GetTransactionsResponse = {
  address: string;
  transactions: {
    tx_hash: string;
    block_number: number;
    timestamp?: string;
    from_address: string;
    to_address?: string;
    value: string;
    value_raw: string;
    gas_used: string;
    gas_price: string;
    gas_fee: string;
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
  }[];
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
  limit: number;
  offset: number;
};

export interface GetBalanceRequest {
  /** Ethereum-style wallet address (0x-prefixed, 40 hex characters) */
  address: string;
}

export type GetBalanceResponse = {
  address: string;
  native_balance_usd: string;
  token_balance_usd: string;
  total_balance_usd: string;
  native_balance: string;
  token_count: number;
  daily_pnl_usd?: string;
  daily_pnl_percent?: string;
  computed_at: string;
};

export interface GetPnlHistoryRequest {
  /** Ethereum-style wallet address (0x-prefixed, 40 hex characters) */
  address: string;
  /** Number of days of history (max 365) */
  days?: number;
}

export type GetPnlHistoryResponse = {
  address: string;
  days_requested: number;
  history: {
    date: string;
    total_value_usd: string;
    native_value_usd: string;
    token_value_usd: string;
    pnl_usd: string;
    pnl_percent: string;
  }[];
};

export interface GetPortfolioValueChartRequest {
  /** Ethereum-style wallet address (0x-prefixed, 40 hex characters) */
  address: string;
  /** Number of days of data to return (max 365) */
  days?: number;
}

export type GetPortfolioValueChartResponse = {
  address: string;
  chart_type: 'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume';
  days: number;
  data: { date: string; value: string }[];
};

export interface GetPnlChartRequest {
  /** Ethereum-style wallet address (0x-prefixed, 40 hex characters) */
  address: string;
  /** Number of days of data to return (max 365) */
  days?: number;
}

export type GetPnlChartResponse = {
  address: string;
  chart_type: 'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume';
  days: number;
  data: { date: string; value: string }[];
};

export interface GetHoldingsChartRequest {
  /** Ethereum-style wallet address (0x-prefixed, 40 hex characters) */
  address: string;
  /** Number of days of data to return (max 365) */
  days?: number;
}

export type GetHoldingsChartResponse = {
  address: string;
  chart_type: 'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume';
  days: number;
  data: { date: string; value: string }[];
};

export interface GetTxVolumeChartRequest {
  /** Ethereum-style wallet address (0x-prefixed, 40 hex characters) */
  address: string;
  /** Number of days of data to return (max 365) */
  days?: number;
}

export type GetTxVolumeChartResponse = {
  address: string;
  chart_type: 'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume';
  days: number;
  data: { date: string; value: string }[];
};
