import { httpClient } from '../lib/http-client';
import {
  GetBalanceRequest,
  GetBalanceResponse,
  GetPnlHistoryRequest,
  GetPnlHistoryResponse,
} from '../types/api-types';

/**
 * Get balance with daily PNL
 * Returns current total balance in USD with daily profit/loss calculation
 */
export async function getBalance(params: GetBalanceRequest): Promise<GetBalanceResponse> {
  const path = `/api/v1/portfolio/${params.address}/balance`;

  return httpClient.request<GetBalanceResponse>({
    method: 'GET',
    path,
  });
}

/**
 * Get PNL history
 * Returns historical daily PNL data for charting and analysis
 */
export async function getPnlHistory(params: GetPnlHistoryRequest): Promise<GetPnlHistoryResponse> {
  const path = `/api/v1/portfolio/${params.address}/pnl`;
  const query: Record<string, string> = {};
  if (params.days !== undefined) {
    query['days'] = String(params.days);
  }

  return httpClient.request<GetPnlHistoryResponse>({
    method: 'GET',
    path,
    query,
  });
}
