import { JSONSchema } from './types';

/**
 * JSON Schema definitions for each tool's input parameters.
 * These schemas tell the AI model what arguments each tool accepts.
 */
export const toolSchemas: Record<string, JSONSchema> = {
  healthCheck: {
    type: 'object',
    properties: {},
  },
  listTokens: {
    type: 'object',
    properties: {},
  },
  auditTokens: {
    type: 'object',
    properties: {},
  },
  syncTokens: {
    type: 'object',
    properties: {},
  },
  getToken: {
    type: 'object',
    properties: {
      address: { description: 'Token contract address', type: 'string' },
    },
    required: ['address'],
  },
  syncPrices: {
    type: 'object',
    properties: {},
  },
  getPortfolio: {
    type: 'object',
    properties: {
      address: {
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        type: 'string',
      },
    },
    required: ['address'],
  },
  getHoldings: {
    type: 'object',
    properties: {
      address: {
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        type: 'string',
      },
    },
    required: ['address'],
  },
  getTransactions: {
    type: 'object',
    properties: {
      address: {
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        type: 'string',
      },
      limit: { description: 'Maximum number of transactions to return (max 100)', type: 'integer' },
      offset: { description: 'Number of transactions to skip for pagination', type: 'integer' },
    },
    required: ['address'],
  },
  getBalance: {
    type: 'object',
    properties: {
      address: {
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        type: 'string',
      },
    },
    required: ['address'],
  },
  getPnlHistory: {
    type: 'object',
    properties: {
      address: {
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        type: 'string',
      },
      days: { description: 'Number of days of history (max 365)', type: 'integer' },
    },
    required: ['address'],
  },
  getPortfolioValueChart: {
    type: 'object',
    properties: {
      address: {
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        type: 'string',
      },
      days: { description: 'Number of days of data to return (max 365)', type: 'integer' },
    },
    required: ['address'],
  },
  getPnlChart: {
    type: 'object',
    properties: {
      address: {
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        type: 'string',
      },
      days: { description: 'Number of days of data to return (max 365)', type: 'integer' },
    },
    required: ['address'],
  },
  getHoldingsChart: {
    type: 'object',
    properties: {
      address: {
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        type: 'string',
      },
      days: { description: 'Number of days of data to return (max 365)', type: 'integer' },
    },
    required: ['address'],
  },
  getTxVolumeChart: {
    type: 'object',
    properties: {
      address: {
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        type: 'string',
      },
      days: { description: 'Number of days of data to return (max 365)', type: 'integer' },
    },
    required: ['address'],
  },
};
