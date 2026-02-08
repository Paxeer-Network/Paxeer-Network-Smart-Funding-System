/**
 * OpenAI Function Calling definitions.
 *
 * Use these with the OpenAI Chat Completions API:
 *   const response = await openai.chat.completions.create({
 *     model: 'gpt-4',
 *     messages: [...],
 *     tools: openAITools,
 *   });
 */

export interface OpenAITool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export const openAITools: OpenAITool[] = [
  {
    type: 'function',
    function: {
      name: 'healthCheck',
      description: 'Health check. Returns service health status and version',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'listTokens',
      description: 'List token statistics. Returns token metadata statistics and counts',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'auditTokens',
      description: 'Audit token metadata. Returns detailed token metadata completeness report',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'syncTokens',
      description:
        'Sync tokens from Paxscan. Triggers synchronization of token metadata from Paxscan database',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getToken',
      description:
        'Get token metadata. Returns metadata for a specific token by contract address Required params: address (Token contract address param).',
      parameters: {
        type: 'object',
        properties: {
          address: {
            description: 'Token contract address',
            type: 'string',
          },
        },
        required: ['address'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'syncPrices',
      description:
        'Sync token prices. Triggers price synchronization from all sources:\n- Network pools (HLPMM, SwapDex)\n- External APIs (Moralis)\n- Fixed stablecoin prices\n',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getPortfolio',
      description:
        'Get full portfolio. Returns complete portfolio summary including native balance, all token holdings, and totals Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
      parameters: {
        type: 'object',
        properties: {
          address: {
            description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
            type: 'string',
          },
        },
        required: ['address'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getHoldings',
      description:
        'Get token holdings. Returns only the token holdings for a wallet address Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
      parameters: {
        type: 'object',
        properties: {
          address: {
            description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
            type: 'string',
          },
        },
        required: ['address'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getTransactions',
      description:
        'Get transactions. Returns transaction history including native transfers and token transfers Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
      parameters: {
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
    },
  },
  {
    type: 'function',
    function: {
      name: 'getBalance',
      description:
        'Get balance with daily PNL. Returns current total balance in USD with daily profit/loss calculation Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
      parameters: {
        type: 'object',
        properties: {
          address: {
            description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
            type: 'string',
          },
        },
        required: ['address'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getPnlHistory',
      description:
        'Get PNL history. Returns historical daily PNL data for charting and analysis Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
      parameters: {
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
    },
  },
  {
    type: 'function',
    function: {
      name: 'getPortfolioValueChart',
      description:
        'Portfolio value chart. Returns time-series data of total portfolio value for charting Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
      parameters: {
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
    },
  },
  {
    type: 'function',
    function: {
      name: 'getPnlChart',
      description:
        'Daily PNL chart. Returns time-series data of daily profit/loss for charting Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
      parameters: {
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
    },
  },
  {
    type: 'function',
    function: {
      name: 'getHoldingsChart',
      description:
        'Holdings count chart. Returns time-series data of number of token holdings Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
      parameters: {
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
    },
  },
  {
    type: 'function',
    function: {
      name: 'getTxVolumeChart',
      description:
        'Transaction volume chart. Returns time-series data of daily transaction volume in USD Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
      parameters: {
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
    },
  },
];

/**
 * Map of function names to their definitions for quick lookup.
 */
export const openAIToolMap: Record<string, OpenAITool> = {};
for (const tool of openAITools) {
  openAIToolMap[tool.function.name] = tool;
}
