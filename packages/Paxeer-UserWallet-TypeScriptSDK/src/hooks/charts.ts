import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import {
  getPortfolioValueChart,
  getPnlChart,
  getHoldingsChart,
  getTxVolumeChart,
} from '../api/charts';
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
import { chartsKeys } from './query-keys';

/**
 * Portfolio value chart
 */
export function useGetPortfolioValueChart(
  params: GetPortfolioValueChartRequest,
  options?: Omit<UseQueryOptions<GetPortfolioValueChartResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetPortfolioValueChartResponse, Error>({
    queryKey: chartsKeys.getPortfolioValueChart(params),
    queryFn: () => getPortfolioValueChart(params),
    ...options,
  });
}

/**
 * Daily PNL chart
 */
export function useGetPnlChart(
  params: GetPnlChartRequest,
  options?: Omit<UseQueryOptions<GetPnlChartResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetPnlChartResponse, Error>({
    queryKey: chartsKeys.getPnlChart(params),
    queryFn: () => getPnlChart(params),
    ...options,
  });
}

/**
 * Holdings count chart
 */
export function useGetHoldingsChart(
  params: GetHoldingsChartRequest,
  options?: Omit<UseQueryOptions<GetHoldingsChartResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetHoldingsChartResponse, Error>({
    queryKey: chartsKeys.getHoldingsChart(params),
    queryFn: () => getHoldingsChart(params),
    ...options,
  });
}

/**
 * Transaction volume chart
 */
export function useGetTxVolumeChart(
  params: GetTxVolumeChartRequest,
  options?: Omit<UseQueryOptions<GetTxVolumeChartResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetTxVolumeChartResponse, Error>({
    queryKey: chartsKeys.getTxVolumeChart(params),
    queryFn: () => getTxVolumeChart(params),
    ...options,
  });
}
