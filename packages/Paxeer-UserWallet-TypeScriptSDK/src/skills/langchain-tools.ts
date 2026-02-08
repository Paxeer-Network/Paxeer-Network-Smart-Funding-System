import { executeSkill } from './executor';

/**
 * LangChain-compatible tool definitions.
 *
 * Use these with LangChain's tool-calling agents:
 *   import { DynamicStructuredTool } from '@langchain/core/tools';
 *   const tools = langChainToolDefs.map(def =>
 *     new DynamicStructuredTool(def)
 *   );
 */

export interface LangChainToolDef {
  name: string;
  description: string;
  schema: Record<string, unknown>;
  func: (input: Record<string, unknown>) => Promise<string>;
}

export const langChainToolDefs: LangChainToolDef[] = [
  {
    name: 'healthCheck',
    description: 'Health check. Returns service health status and version',
    schema: {
      type: 'object',
      properties: {},
    },
    func: async (input) => {
      const result = await executeSkill('healthCheck', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'listTokens',
    description: 'List token statistics. Returns token metadata statistics and counts',
    schema: {
      type: 'object',
      properties: {},
    },
    func: async (input) => {
      const result = await executeSkill('listTokens', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'auditTokens',
    description: 'Audit token metadata. Returns detailed token metadata completeness report',
    schema: {
      type: 'object',
      properties: {},
    },
    func: async (input) => {
      const result = await executeSkill('auditTokens', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'syncTokens',
    description:
      'Sync tokens from Paxscan. Triggers synchronization of token metadata from Paxscan database',
    schema: {
      type: 'object',
      properties: {},
    },
    func: async (input) => {
      const result = await executeSkill('syncTokens', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'getToken',
    description:
      'Get token metadata. Returns metadata for a specific token by contract address Required params: address (Token contract address param).',
    schema: {
      type: 'object',
      properties: {
        address: {
          description: 'Token contract address',
          type: 'string',
        },
      },
      required: ['address'],
    },
    func: async (input) => {
      const result = await executeSkill('getToken', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'syncPrices',
    description:
      'Sync token prices. Triggers price synchronization from all sources:\n- Network pools (HLPMM, SwapDex)\n- External APIs (Moralis)\n- Fixed stablecoin prices\n',
    schema: {
      type: 'object',
      properties: {},
    },
    func: async (input) => {
      const result = await executeSkill('syncPrices', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'getPortfolio',
    description:
      'Get full portfolio. Returns complete portfolio summary including native balance, all token holdings, and totals Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    schema: {
      type: 'object',
      properties: {
        address: {
          description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
          type: 'string',
        },
      },
      required: ['address'],
    },
    func: async (input) => {
      const result = await executeSkill('getPortfolio', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'getHoldings',
    description:
      'Get token holdings. Returns only the token holdings for a wallet address Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    schema: {
      type: 'object',
      properties: {
        address: {
          description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
          type: 'string',
        },
      },
      required: ['address'],
    },
    func: async (input) => {
      const result = await executeSkill('getHoldings', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'getTransactions',
    description:
      'Get transactions. Returns transaction history including native transfers and token transfers Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    schema: {
      type: 'object',
      properties: {
        address: {
          description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
          type: 'string',
        },
        limit: {
          description: 'Maximum number of transactions to return (max 100)',
          type: 'integer',
        },
        offset: {
          description: 'Number of transactions to skip for pagination',
          type: 'integer',
        },
      },
      required: ['address'],
    },
    func: async (input) => {
      const result = await executeSkill('getTransactions', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'getBalance',
    description:
      'Get balance with daily PNL. Returns current total balance in USD with daily profit/loss calculation Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    schema: {
      type: 'object',
      properties: {
        address: {
          description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
          type: 'string',
        },
      },
      required: ['address'],
    },
    func: async (input) => {
      const result = await executeSkill('getBalance', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'getPnlHistory',
    description:
      'Get PNL history. Returns historical daily PNL data for charting and analysis Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    schema: {
      type: 'object',
      properties: {
        address: {
          description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
          type: 'string',
        },
        days: {
          description: 'Number of days of history (max 365)',
          type: 'integer',
        },
      },
      required: ['address'],
    },
    func: async (input) => {
      const result = await executeSkill('getPnlHistory', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'getPortfolioValueChart',
    description:
      'Portfolio value chart. Returns time-series data of total portfolio value for charting Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    schema: {
      type: 'object',
      properties: {
        address: {
          description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
          type: 'string',
        },
        days: {
          description: 'Number of days of data to return (max 365)',
          type: 'integer',
        },
      },
      required: ['address'],
    },
    func: async (input) => {
      const result = await executeSkill('getPortfolioValueChart', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'getPnlChart',
    description:
      'Daily PNL chart. Returns time-series data of daily profit/loss for charting Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    schema: {
      type: 'object',
      properties: {
        address: {
          description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
          type: 'string',
        },
        days: {
          description: 'Number of days of data to return (max 365)',
          type: 'integer',
        },
      },
      required: ['address'],
    },
    func: async (input) => {
      const result = await executeSkill('getPnlChart', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'getHoldingsChart',
    description:
      'Holdings count chart. Returns time-series data of number of token holdings Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    schema: {
      type: 'object',
      properties: {
        address: {
          description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
          type: 'string',
        },
        days: {
          description: 'Number of days of data to return (max 365)',
          type: 'integer',
        },
      },
      required: ['address'],
    },
    func: async (input) => {
      const result = await executeSkill('getHoldingsChart', input);
      return JSON.stringify(result);
    },
  },
  {
    name: 'getTxVolumeChart',
    description:
      'Transaction volume chart. Returns time-series data of daily transaction volume in USD Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    schema: {
      type: 'object',
      properties: {
        address: {
          description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
          type: 'string',
        },
        days: {
          description: 'Number of days of data to return (max 365)',
          type: 'integer',
        },
      },
      required: ['address'],
    },
    func: async (input) => {
      const result = await executeSkill('getTxVolumeChart', input);
      return JSON.stringify(result);
    },
  },
];
