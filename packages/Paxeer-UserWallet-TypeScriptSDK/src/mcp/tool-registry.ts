import { MCPToolDefinition } from './types';
import { toolSchemas } from './tool-schemas';

/**
 * Registry of all MCP tools exposed by this server.
 * Each tool maps to one API endpoint.
 */
export const toolRegistry: MCPToolDefinition[] = [
  {
    name: 'healthCheck',
    description: 'Health check. Returns service health status and version. [GET /health]',
    inputSchema: toolSchemas['healthCheck'],
  },
  {
    name: 'listTokens',
    description:
      'List token statistics. Returns token metadata statistics and counts. [GET /api/v1/tokens]',
    inputSchema: toolSchemas['listTokens'],
  },
  {
    name: 'auditTokens',
    description:
      'Audit token metadata. Returns detailed token metadata completeness report. [GET /api/v1/tokens/audit]',
    inputSchema: toolSchemas['auditTokens'],
  },
  {
    name: 'syncTokens',
    description:
      'Sync tokens from Paxscan. Triggers synchronization of token metadata from Paxscan database. [POST /api/v1/tokens/sync]',
    inputSchema: toolSchemas['syncTokens'],
  },
  {
    name: 'getToken',
    description:
      'Get token metadata. Returns metadata for a specific token by contract address. [GET /api/v1/tokens/{address}]',
    inputSchema: toolSchemas['getToken'],
  },
  {
    name: 'syncPrices',
    description:
      'Sync token prices. Triggers price synchronization from all sources:\n- Network pools (HLPMM, SwapDex)\n- External APIs (Moralis)\n- Fixed stablecoin prices\n. [POST /api/v1/prices/sync]',
    inputSchema: toolSchemas['syncPrices'],
  },
  {
    name: 'getPortfolio',
    description:
      'Get full portfolio. Returns complete portfolio summary including native balance, all token holdings, and totals. [GET /api/v1/portfolio/{address}]',
    inputSchema: toolSchemas['getPortfolio'],
  },
  {
    name: 'getHoldings',
    description:
      'Get token holdings. Returns only the token holdings for a wallet address. [GET /api/v1/portfolio/{address}/holdings]',
    inputSchema: toolSchemas['getHoldings'],
  },
  {
    name: 'getTransactions',
    description:
      'Get transactions. Returns transaction history including native transfers and token transfers. [GET /api/v1/portfolio/{address}/transactions]',
    inputSchema: toolSchemas['getTransactions'],
  },
  {
    name: 'getBalance',
    description:
      'Get balance with daily PNL. Returns current total balance in USD with daily profit/loss calculation. [GET /api/v1/portfolio/{address}/balance]',
    inputSchema: toolSchemas['getBalance'],
  },
  {
    name: 'getPnlHistory',
    description:
      'Get PNL history. Returns historical daily PNL data for charting and analysis. [GET /api/v1/portfolio/{address}/pnl]',
    inputSchema: toolSchemas['getPnlHistory'],
  },
  {
    name: 'getPortfolioValueChart',
    description:
      'Portfolio value chart. Returns time-series data of total portfolio value for charting. [GET /api/v1/portfolio/{address}/charts/value]',
    inputSchema: toolSchemas['getPortfolioValueChart'],
  },
  {
    name: 'getPnlChart',
    description:
      'Daily PNL chart. Returns time-series data of daily profit/loss for charting. [GET /api/v1/portfolio/{address}/charts/pnl]',
    inputSchema: toolSchemas['getPnlChart'],
  },
  {
    name: 'getHoldingsChart',
    description:
      'Holdings count chart. Returns time-series data of number of token holdings. [GET /api/v1/portfolio/{address}/charts/holdings]',
    inputSchema: toolSchemas['getHoldingsChart'],
  },
  {
    name: 'getTxVolumeChart',
    description:
      'Transaction volume chart. Returns time-series data of daily transaction volume in USD. [GET /api/v1/portfolio/{address}/charts/tx-volume]',
    inputSchema: toolSchemas['getTxVolumeChart'],
  },
];
