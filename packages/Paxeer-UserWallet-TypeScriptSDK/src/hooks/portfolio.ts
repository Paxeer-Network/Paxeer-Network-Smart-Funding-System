import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { getPortfolio, getHoldings, getTransactions } from '../api/portfolio';
import {
  GetPortfolioRequest,
  GetPortfolioResponse,
  GetHoldingsRequest,
  GetHoldingsResponse,
  GetTransactionsRequest,
  GetTransactionsResponse,
} from '../types/api-types';
import { portfolioKeys } from './query-keys';

/**
 * Get full portfolio
 */
export function useGetPortfolio(
  params: GetPortfolioRequest,
  options?: Omit<UseQueryOptions<GetPortfolioResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetPortfolioResponse, Error>({
    queryKey: portfolioKeys.getPortfolio(params),
    queryFn: () => getPortfolio(params),
    ...options,
  });
}

/**
 * Get token holdings
 */
export function useGetHoldings(
  params: GetHoldingsRequest,
  options?: Omit<UseQueryOptions<GetHoldingsResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetHoldingsResponse, Error>({
    queryKey: portfolioKeys.getHoldings(params),
    queryFn: () => getHoldings(params),
    ...options,
  });
}

/**
 * Get transactions
 */
export function useGetTransactions(
  params: GetTransactionsRequest,
  options?: Omit<UseQueryOptions<GetTransactionsResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetTransactionsResponse, Error>({
    queryKey: portfolioKeys.getTransactions(params),
    queryFn: () => getTransactions(params),
    ...options,
  });
}
