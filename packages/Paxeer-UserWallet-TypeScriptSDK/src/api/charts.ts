import { httpClient } from '../lib/http-client';
import {
  GetPortfolioValueChartRequest,
  GetPortfolioValueChartResponse,
  GetPnlChartRequest,
  GetPnlChartResponse,
  GetHoldingsChartRequest,
  GetHoldingsChartResponse,
  GetTxVolumeChartRequest,
  GetTxVolumeChartResponse,
} from '../types/api-types';

/**
 * Portfolio value chart
 * Returns time-series data of total portfolio value for charting
 */
export async function getPortfolioValueChart(
  params: GetPortfolioValueChartRequest,
): Promise<GetPortfolioValueChartResponse> {
  const path = `/api/v1/portfolio/${params.address}/charts/value`;
  const query: Record<string, string> = {};
  if (params.days !== undefined) {
    query['days'] = String(params.days);
  }

  return httpClient.request<GetPortfolioValueChartResponse>({
    method: 'GET',
    path,
    query,
  });
}

/**
 * Daily PNL chart
 * Returns time-series data of daily profit/loss for charting
 */
export async function getPnlChart(params: GetPnlChartRequest): Promise<GetPnlChartResponse> {
  const path = `/api/v1/portfolio/${params.address}/charts/pnl`;
  const query: Record<string, string> = {};
  if (params.days !== undefined) {
    query['days'] = String(params.days);
  }

  return httpClient.request<GetPnlChartResponse>({
    method: 'GET',
    path,
    query,
  });
}

/**
 * Holdings count chart
 * Returns time-series data of number of token holdings
 */
export async function getHoldingsChart(
  params: GetHoldingsChartRequest,
): Promise<GetHoldingsChartResponse> {
  const path = `/api/v1/portfolio/${params.address}/charts/holdings`;
  const query: Record<string, string> = {};
  if (params.days !== undefined) {
    query['days'] = String(params.days);
  }

  return httpClient.request<GetHoldingsChartResponse>({
    method: 'GET',
    path,
    query,
  });
}

/**
 * Transaction volume chart
 * Returns time-series data of daily transaction volume in USD
 */
export async function getTxVolumeChart(
  params: GetTxVolumeChartRequest,
): Promise<GetTxVolumeChartResponse> {
  const path = `/api/v1/portfolio/${params.address}/charts/tx-volume`;
  const query: Record<string, string> = {};
  if (params.days !== undefined) {
    query['days'] = String(params.days);
  }

  return httpClient.request<GetTxVolumeChartResponse>({
    method: 'GET',
    path,
    query,
  });
}
