import { healthCheck } from '../api/health';
import { listTokens, auditTokens, syncTokens, getToken, syncPrices } from '../api/tokens';
import { getPortfolio, getHoldings, getTransactions } from '../api/portfolio';
import { getBalance, getPnlHistory } from '../api/pnl';
import {
  getPortfolioValueChart,
  getPnlChart,
  getHoldingsChart,
  getTxVolumeChart,
} from '../api/charts';
import { MCPToolResult } from './types';

/**
 * Dispatches an MCP tool call to the corresponding SDK function.
 * Transforms the result into MCP-compatible content.
 */
export async function handleToolCall(
  toolName: string,
  args: Record<string, unknown>,
): Promise<MCPToolResult> {
  switch (toolName) {
    case 'healthCheck': {
      const result = await healthCheck();
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'listTokens': {
      const result = await listTokens();
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'auditTokens': {
      const result = await auditTokens();
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'syncTokens': {
      const result = await syncTokens();
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'getToken': {
      const result = await getToken(args as any);
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'syncPrices': {
      const result = await syncPrices();
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'getPortfolio': {
      const result = await getPortfolio(args as any);
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'getHoldings': {
      const result = await getHoldings(args as any);
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'getTransactions': {
      const result = await getTransactions(args as any);
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'getBalance': {
      const result = await getBalance(args as any);
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'getPnlHistory': {
      const result = await getPnlHistory(args as any);
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'getPortfolioValueChart': {
      const result = await getPortfolioValueChart(args as any);
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'getPnlChart': {
      const result = await getPnlChart(args as any);
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'getHoldingsChart': {
      const result = await getHoldingsChart(args as any);
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    case 'getTxVolumeChart': {
      const result = await getTxVolumeChart(args as any);
      return {
        content: [
          {
            type: 'text',
            text: result !== undefined ? JSON.stringify(result, null, 2) : 'Success (no content)',
          },
        ],
      };
    }

    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${toolName}` }],
        isError: true,
      };
  }
}
