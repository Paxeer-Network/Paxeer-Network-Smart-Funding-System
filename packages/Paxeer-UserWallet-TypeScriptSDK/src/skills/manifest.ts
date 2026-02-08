import { SkillManifest } from './types';
import { skills } from './definitions';

/**
 * Complete skill manifest for the Paxeer User Stats API API.
 *
 * This manifest provides a high-level overview of all available skills,
 * organized by category. AI models can use this to understand the full
 * scope of what they can do with this API.
 */
export const skillManifest: SkillManifest = {
  apiName: 'Paxeer User Stats API',
  apiVersion: '0.1.0',
  apiDescription:
    'Portfolio tracking and analytics service for Paxeer Network wallets.\n\nProvides real-time portfolio data, token holdings, transaction history,\nPNL tracking, and chart data for visualization.\n\n## Features\n- **Portfolio Overview**: Complete wallet summary with native and token holdings\n- **Token Holdings**: Detailed token balances with USD values\n- **Transaction History**: Native transactions and ERC-20/721 transfers\n- **PNL Tracking**: Daily profit/loss calculations and history\n- **Chart Data**: Time-series data for portfolio analytics\n\n## Authentication\nCurrently no authentication required. Rate limiting applies.\n',
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  totalSkills: 15,
  categories: [
    {
      name: 'Health',
      skillCount: 1,
      description: 'Service health endpoints',
    },
    {
      name: 'Tokens',
      skillCount: 5,
      description: 'Token metadata and synchronization',
    },
    {
      name: 'Portfolio',
      skillCount: 3,
      description: 'Portfolio data and holdings',
    },
    {
      name: 'PNL',
      skillCount: 2,
      description: 'Profit and loss tracking',
    },
    {
      name: 'Charts',
      skillCount: 4,
      description: 'Time-series chart data',
    },
  ],
  skills,
};
