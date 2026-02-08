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
import { SkillExecutionResult } from './types';
import { skills } from './definitions';

/**
 * Execute an AI skill by its ID.
 *
 * This function is the main entry point for AI models to invoke skills.
 * It maps skill IDs to SDK functions and handles errors gracefully.
 */
export async function executeSkill(
  skillId: string,
  params: Record<string, unknown>,
): Promise<SkillExecutionResult> {
  const skill = skills.find((s) => s.id === skillId);
  if (!skill) {
    return { success: false, error: `Unknown skill: ${skillId}` };
  }

  // Validate required parameters
  for (const param of skill.parameters) {
    if (param.required && params[param.name] === undefined) {
      return {
        success: false,
        error: `Missing required parameter: ${param.name} (${param.description})`,
      };
    }
  }

  try {
    const result = await dispatchSkill(skillId, params);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Skill execution failed',
      statusCode: error.statusCode,
    };
  }
}

async function dispatchSkill(skillId: string, params: Record<string, unknown>): Promise<unknown> {
  switch (skillId) {
    case 'healthCheck':
      return healthCheck();
    case 'listTokens':
      return listTokens();
    case 'auditTokens':
      return auditTokens();
    case 'syncTokens':
      return syncTokens();
    case 'getToken':
      return getToken(params as any);
    case 'syncPrices':
      return syncPrices();
    case 'getPortfolio':
      return getPortfolio(params as any);
    case 'getHoldings':
      return getHoldings(params as any);
    case 'getTransactions':
      return getTransactions(params as any);
    case 'getBalance':
      return getBalance(params as any);
    case 'getPnlHistory':
      return getPnlHistory(params as any);
    case 'getPortfolioValueChart':
      return getPortfolioValueChart(params as any);
    case 'getPnlChart':
      return getPnlChart(params as any);
    case 'getHoldingsChart':
      return getHoldingsChart(params as any);
    case 'getTxVolumeChart':
      return getTxVolumeChart(params as any);
    default:
      throw new Error(`No handler for skill: ${skillId}`);
  }
}

/** Extract body params by removing non-body params from the flat params object */
function buildBody(
  params: Record<string, unknown>,
  nonBodyKeys: string[],
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!nonBodyKeys.includes(key)) {
      body[key] = value;
    }
  }
  return body;
}
