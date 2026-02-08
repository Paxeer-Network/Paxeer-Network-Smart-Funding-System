export const healthKeys = {
  all: ['Health'] as const,
  healthCheck: () => ['Health', 'healthCheck'] as const,
};

export const tokensKeys = {
  all: ['Tokens'] as const,
  listTokens: () => ['Tokens', 'listTokens'] as const,
  auditTokens: () => ['Tokens', 'auditTokens'] as const,
  getToken: (params: object) => ['Tokens', 'getToken', params] as const,
};

export const portfolioKeys = {
  all: ['Portfolio'] as const,
  getPortfolio: (params: object) => ['Portfolio', 'getPortfolio', params] as const,
  getHoldings: (params: object) => ['Portfolio', 'getHoldings', params] as const,
  getTransactions: (params: object) => ['Portfolio', 'getTransactions', params] as const,
};

export const pNLKeys = {
  all: ['PNL'] as const,
  getBalance: (params: object) => ['PNL', 'getBalance', params] as const,
  getPnlHistory: (params: object) => ['PNL', 'getPnlHistory', params] as const,
};

export const chartsKeys = {
  all: ['Charts'] as const,
  getPortfolioValueChart: (params: object) => ['Charts', 'getPortfolioValueChart', params] as const,
  getPnlChart: (params: object) => ['Charts', 'getPnlChart', params] as const,
  getHoldingsChart: (params: object) => ['Charts', 'getHoldingsChart', params] as const,
  getTxVolumeChart: (params: object) => ['Charts', 'getTxVolumeChart', params] as const,
};
