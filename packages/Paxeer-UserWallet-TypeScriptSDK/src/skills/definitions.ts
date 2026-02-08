import { Skill } from './types';

/**
 * All available AI skills for the Paxeer User Stats API API.
 *
 * Each skill represents one API endpoint with rich metadata
 * that helps AI models understand when and how to use it.
 */
export const skills: Skill[] = [
  {
    id: 'healthCheck',
    name: 'Health check',
    description: 'Health check. Returns service health status and version',
    method: 'GET',
    path: '/health',
    category: 'Health',
    parameters: [],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Health check',
        input: {},
        expectedBehavior: 'Returns HTTP 200: Service is healthy',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: [],
    whenToUse:
      'Use this skill when the user wants to retrieve or view health check. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'listTokens',
    name: 'List token statistics',
    description: 'List token statistics. Returns token metadata statistics and counts',
    method: 'GET',
    path: '/api/v1/tokens',
    category: 'Tokens',
    parameters: [],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of List token statistics',
        input: {},
        expectedBehavior: 'Returns HTTP 200: Token statistics',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['auditTokens', 'syncTokens', 'getToken', 'syncPrices'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view list token statistics. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'auditTokens',
    name: 'Audit token metadata',
    description: 'Audit token metadata. Returns detailed token metadata completeness report',
    method: 'GET',
    path: '/api/v1/tokens/audit',
    category: 'Tokens',
    parameters: [],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Audit token metadata',
        input: {},
        expectedBehavior: 'Returns HTTP 200: Token audit report',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['listTokens', 'syncTokens', 'getToken', 'syncPrices'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view audit token metadata. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'syncTokens',
    name: 'Sync tokens from Paxscan',
    description:
      'Sync tokens from Paxscan. Triggers synchronization of token metadata from Paxscan database',
    method: 'POST',
    path: '/api/v1/tokens/sync',
    category: 'Tokens',
    parameters: [],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Sync tokens from Paxscan',
        input: {},
        expectedBehavior: 'Returns HTTP 200: Sync completed',
      },
    ],
    isMutation: true,
    deprecated: false,
    relatedSkills: ['listTokens', 'auditTokens', 'getToken', 'syncPrices'],
    whenToUse:
      'Use this skill when the user wants to create or submit sync tokens from paxscan. This will create new data.',
    whenNotToUse:
      'Do not use this skill if the user only wants to view data — use a GET skill instead.',
  },
  {
    id: 'getToken',
    name: 'Get token metadata',
    description:
      'Get token metadata. Returns metadata for a specific token by contract address Required params: address (Token contract address param).',
    method: 'GET',
    path: '/api/v1/tokens/{address}',
    category: 'Tokens',
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Token contract address',
        in: 'path',
      },
    ],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Get token metadata',
        input: { address: 'example-address' },
        expectedBehavior: 'Returns HTTP 200: Token metadata',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['listTokens', 'auditTokens', 'syncTokens', 'syncPrices'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view get token metadata. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'syncPrices',
    name: 'Sync token prices',
    description:
      'Sync token prices. Triggers price synchronization from all sources:\n- Network pools (HLPMM, SwapDex)\n- External APIs (Moralis)\n- Fixed stablecoin prices\n',
    method: 'POST',
    path: '/api/v1/prices/sync',
    category: 'Tokens',
    parameters: [],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Sync token prices',
        input: {},
        expectedBehavior: 'Returns HTTP 200: Price sync completed',
      },
    ],
    isMutation: true,
    deprecated: false,
    relatedSkills: ['listTokens', 'auditTokens', 'syncTokens', 'getToken'],
    whenToUse:
      'Use this skill when the user wants to create or submit sync token prices. This will create new data.',
    whenNotToUse:
      'Do not use this skill if the user only wants to view data — use a GET skill instead.',
  },
  {
    id: 'getPortfolio',
    name: 'Get full portfolio',
    description:
      'Get full portfolio. Returns complete portfolio summary including native balance, all token holdings, and totals Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    method: 'GET',
    path: '/api/v1/portfolio/{address}',
    category: 'Portfolio',
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        in: 'path',
      },
    ],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Get full portfolio',
        input: { address: 'example-address' },
        expectedBehavior: 'Returns HTTP 200: Portfolio data',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['getHoldings', 'getTransactions'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view get full portfolio. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'getHoldings',
    name: 'Get token holdings',
    description:
      'Get token holdings. Returns only the token holdings for a wallet address Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    method: 'GET',
    path: '/api/v1/portfolio/{address}/holdings',
    category: 'Portfolio',
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        in: 'path',
      },
    ],
    outputDescription: 'Returns an array of results.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Get token holdings',
        input: { address: 'example-address' },
        expectedBehavior: 'Returns HTTP 200: Token holdings list',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['getPortfolio', 'getTransactions'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view get token holdings. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'getTransactions',
    name: 'Get transactions',
    description:
      'Get transactions. Returns transaction history including native transfers and token transfers Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    method: 'GET',
    path: '/api/v1/portfolio/{address}/transactions',
    category: 'Portfolio',
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        in: 'path',
      },
      {
        name: 'limit',
        type: 'integer',
        required: false,
        description: 'Maximum number of transactions to return (max 100)',
        in: 'query',
      },
      {
        name: 'offset',
        type: 'integer',
        required: false,
        description: 'Number of transactions to skip for pagination',
        in: 'query',
      },
    ],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Get transactions',
        input: { address: 'example-address' },
        expectedBehavior: 'Returns HTTP 200: Transaction list',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['getPortfolio', 'getHoldings'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view get transactions. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'getBalance',
    name: 'Get balance with daily PNL',
    description:
      'Get balance with daily PNL. Returns current total balance in USD with daily profit/loss calculation Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    method: 'GET',
    path: '/api/v1/portfolio/{address}/balance',
    category: 'PNL',
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        in: 'path',
      },
    ],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Get balance with daily PNL',
        input: { address: 'example-address' },
        expectedBehavior: 'Returns HTTP 200: Balance with PNL',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['getPnlHistory'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view get balance with daily pnl. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'getPnlHistory',
    name: 'Get PNL history',
    description:
      'Get PNL history. Returns historical daily PNL data for charting and analysis Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    method: 'GET',
    path: '/api/v1/portfolio/{address}/pnl',
    category: 'PNL',
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        in: 'path',
      },
      {
        name: 'days',
        type: 'integer',
        required: false,
        description: 'Number of days of history (max 365)',
        in: 'query',
      },
    ],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Get PNL history',
        input: { address: 'example-address' },
        expectedBehavior: 'Returns HTTP 200: PNL history',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['getBalance'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view get pnl history. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'getPortfolioValueChart',
    name: 'Portfolio value chart',
    description:
      'Portfolio value chart. Returns time-series data of total portfolio value for charting Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    method: 'GET',
    path: '/api/v1/portfolio/{address}/charts/value',
    category: 'Charts',
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        in: 'path',
      },
      {
        name: 'days',
        type: 'integer',
        required: false,
        description: 'Number of days of data to return (max 365)',
        in: 'query',
      },
    ],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Portfolio value chart',
        input: { address: 'example-address' },
        expectedBehavior: 'Returns HTTP 200: Chart data',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['getPnlChart', 'getHoldingsChart', 'getTxVolumeChart'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view portfolio value chart. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'getPnlChart',
    name: 'Daily PNL chart',
    description:
      'Daily PNL chart. Returns time-series data of daily profit/loss for charting Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    method: 'GET',
    path: '/api/v1/portfolio/{address}/charts/pnl',
    category: 'Charts',
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        in: 'path',
      },
      {
        name: 'days',
        type: 'integer',
        required: false,
        description: 'Number of days of data to return (max 365)',
        in: 'query',
      },
    ],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Daily PNL chart',
        input: { address: 'example-address' },
        expectedBehavior: 'Returns HTTP 200: Chart data',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['getPortfolioValueChart', 'getHoldingsChart', 'getTxVolumeChart'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view daily pnl chart. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'getHoldingsChart',
    name: 'Holdings count chart',
    description:
      'Holdings count chart. Returns time-series data of number of token holdings Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    method: 'GET',
    path: '/api/v1/portfolio/{address}/charts/holdings',
    category: 'Charts',
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        in: 'path',
      },
      {
        name: 'days',
        type: 'integer',
        required: false,
        description: 'Number of days of data to return (max 365)',
        in: 'query',
      },
    ],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Holdings count chart',
        input: { address: 'example-address' },
        expectedBehavior: 'Returns HTTP 200: Chart data',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['getPortfolioValueChart', 'getPnlChart', 'getTxVolumeChart'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view holdings count chart. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
  {
    id: 'getTxVolumeChart',
    name: 'Transaction volume chart',
    description:
      'Transaction volume chart. Returns time-series data of daily transaction volume in USD Required params: address (Ethereum-style wallet address (0x-prefixed, 40 hex characters) param).',
    method: 'GET',
    path: '/api/v1/portfolio/{address}/charts/tx-volume',
    category: 'Charts',
    parameters: [
      {
        name: 'address',
        type: 'string',
        required: true,
        description: 'Ethereum-style wallet address (0x-prefixed, 40 hex characters)',
        in: 'path',
      },
      {
        name: 'days',
        type: 'integer',
        required: false,
        description: 'Number of days of data to return (max 365)',
        in: 'query',
      },
    ],
    outputDescription: 'Returns a JSON object.',
    examples: [
      {
        title: 'Basic usage',
        description: 'Basic example of Transaction volume chart',
        input: { address: 'example-address' },
        expectedBehavior: 'Returns HTTP 200: Chart data',
      },
    ],
    isMutation: false,
    deprecated: false,
    relatedSkills: ['getPortfolioValueChart', 'getPnlChart', 'getHoldingsChart'],
    whenToUse:
      'Use this skill when the user wants to retrieve or view transaction volume chart. This is a read-only operation.',
    whenNotToUse: "Do not use this skill if a more specific skill exists for the user's intent.",
  },
];

/** Skills grouped by category */
export const skillsByCategory: Record<string, Skill[]> = {};
for (const skill of skills) {
  if (!skillsByCategory[skill.category]) {
    skillsByCategory[skill.category] = [];
  }
  skillsByCategory[skill.category].push(skill);
}

/** Skill lookup by ID */
export const skillById: Record<string, Skill> = {};
for (const skill of skills) {
  skillById[skill.id] = skill;
}
