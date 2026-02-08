/**
 * API endpoint paths
 */
export const HEALTH_ENDPOINTS = {
  /** GET /health - Health check */
  HEALTH_CHECK: '/health',
} as const;

export const TOKENS_ENDPOINTS = {
  /** GET /api/v1/tokens - List token statistics */
  LIST_TOKENS: '/api/v1/tokens',
  /** GET /api/v1/tokens/audit - Audit token metadata */
  AUDIT_TOKENS: '/api/v1/tokens/audit',
  /** POST /api/v1/tokens/sync - Sync tokens from Paxscan */
  SYNC_TOKENS: '/api/v1/tokens/sync',
  /** GET /api/v1/tokens/{address} - Get token metadata */
  GET_TOKEN: '/api/v1/tokens/{address}',
  /** POST /api/v1/prices/sync - Sync token prices */
  SYNC_PRICES: '/api/v1/prices/sync',
} as const;

export const PORTFOLIO_ENDPOINTS = {
  /** GET /api/v1/portfolio/{address} - Get full portfolio */
  GET_PORTFOLIO: '/api/v1/portfolio/{address}',
  /** GET /api/v1/portfolio/{address}/holdings - Get token holdings */
  GET_HOLDINGS: '/api/v1/portfolio/{address}/holdings',
  /** GET /api/v1/portfolio/{address}/transactions - Get transactions */
  GET_TRANSACTIONS: '/api/v1/portfolio/{address}/transactions',
} as const;

export const PNL_ENDPOINTS = {
  /** GET /api/v1/portfolio/{address}/balance - Get balance with daily PNL */
  GET_BALANCE: '/api/v1/portfolio/{address}/balance',
  /** GET /api/v1/portfolio/{address}/pnl - Get PNL history */
  GET_PNL_HISTORY: '/api/v1/portfolio/{address}/pnl',
} as const;

export const CHARTS_ENDPOINTS = {
  /** GET /api/v1/portfolio/{address}/charts/value - Portfolio value chart */
  GET_PORTFOLIO_VALUE_CHART: '/api/v1/portfolio/{address}/charts/value',
  /** GET /api/v1/portfolio/{address}/charts/pnl - Daily PNL chart */
  GET_PNL_CHART: '/api/v1/portfolio/{address}/charts/pnl',
  /** GET /api/v1/portfolio/{address}/charts/holdings - Holdings count chart */
  GET_HOLDINGS_CHART: '/api/v1/portfolio/{address}/charts/holdings',
  /** GET /api/v1/portfolio/{address}/charts/tx-volume - Transaction volume chart */
  GET_TX_VOLUME_CHART: '/api/v1/portfolio/{address}/charts/tx-volume',
} as const;

/** All API endpoints */
export const ENDPOINTS = {
  ...HEALTH_ENDPOINTS,
  ...TOKENS_ENDPOINTS,
  ...PORTFOLIO_ENDPOINTS,
  ...PNL_ENDPOINTS,
  ...CHARTS_ENDPOINTS,
} as const;
