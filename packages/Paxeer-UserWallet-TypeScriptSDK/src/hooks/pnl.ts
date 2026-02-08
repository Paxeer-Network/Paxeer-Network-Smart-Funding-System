import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { getBalance, getPnlHistory } from '../api/pnl';
import {
  GetBalanceRequest,
  GetBalanceResponse,
  GetPnlHistoryRequest,
  GetPnlHistoryResponse,
} from '../types/api-types';
import { pNLKeys } from './query-keys';

/**
 * Get balance with daily PNL
 */
export function useGetBalance(
  params: GetBalanceRequest,
  options?: Omit<UseQueryOptions<GetBalanceResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetBalanceResponse, Error>({
    queryKey: pNLKeys.getBalance(params),
    queryFn: () => getBalance(params),
    ...options,
  });
}

/**
 * Get PNL history
 */
export function useGetPnlHistory(
  params: GetPnlHistoryRequest,
  options?: Omit<UseQueryOptions<GetPnlHistoryResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetPnlHistoryResponse, Error>({
    queryKey: pNLKeys.getPnlHistory(params),
    queryFn: () => getPnlHistory(params),
    ...options,
  });
}
