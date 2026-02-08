import { httpClient } from '../lib/http-client';
import {
  GetPortfolioRequest,
  GetPortfolioResponse,
  GetHoldingsRequest,
  GetHoldingsResponse,
  GetTransactionsRequest,
  GetTransactionsResponse,
} from '../types/api-types';

/**
 * Get full portfolio
 * Returns complete portfolio summary including native balance, all token holdings, and totals
 */
export async function getPortfolio(params: GetPortfolioRequest): Promise<GetPortfolioResponse> {
  const path = `/api/v1/portfolio/${params.address}`;

  return httpClient.request<GetPortfolioResponse>({
    method: 'GET',
    path,
  });
}

/**
 * Get token holdings
 * Returns only the token holdings for a wallet address
 */
export async function getHoldings(params: GetHoldingsRequest): Promise<GetHoldingsResponse> {
  const path = `/api/v1/portfolio/${params.address}/holdings`;

  return httpClient.request<GetHoldingsResponse>({
    method: 'GET',
    path,
  });
}

/**
 * Get transactions
 * Returns transaction history including native transfers and token transfers
 */
export async function getTransactions(
  params: GetTransactionsRequest,
): Promise<GetTransactionsResponse> {
  const path = `/api/v1/portfolio/${params.address}/transactions`;
  const query: Record<string, string> = {};
  if (params.limit !== undefined) {
    query['limit'] = String(params.limit);
  }
  if (params.offset !== undefined) {
    query['offset'] = String(params.offset);
  }

  return httpClient.request<GetTransactionsResponse>({
    method: 'GET',
    path,
    query,
  });
}
