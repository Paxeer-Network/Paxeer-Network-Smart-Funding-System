import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { listTokens, auditTokens, syncTokens, getToken, syncPrices } from '../api/tokens';
import {
  ListTokensResponse,
  AuditTokensResponse,
  SyncTokensResponse,
  GetTokenRequest,
  GetTokenResponse,
  SyncPricesResponse,
} from '../types/api-types';
import { tokensKeys } from './query-keys';

/**
 * List token statistics
 */
export function useListTokens(
  options?: Omit<UseQueryOptions<ListTokensResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<ListTokensResponse, Error>({
    queryKey: tokensKeys.listTokens(),
    queryFn: () => listTokens(),
    ...options,
  });
}

/**
 * Audit token metadata
 */
export function useAuditTokens(
  options?: Omit<UseQueryOptions<AuditTokensResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<AuditTokensResponse, Error>({
    queryKey: tokensKeys.auditTokens(),
    queryFn: () => auditTokens(),
    ...options,
  });
}

/**
 * Sync tokens from Paxscan
 */
export function useSyncTokensMutation(
  options?: UseMutationOptions<SyncTokensResponse, Error, void>,
) {
  const queryClient = useQueryClient();

  return useMutation<SyncTokensResponse, Error, void>({
    mutationFn: () => syncTokens(),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['Tokens'] });
    },
    ...options,
  });
}

/**
 * Get token metadata
 */
export function useGetToken(
  params: GetTokenRequest,
  options?: Omit<UseQueryOptions<GetTokenResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<GetTokenResponse, Error>({
    queryKey: tokensKeys.getToken(params),
    queryFn: () => getToken(params),
    ...options,
  });
}

/**
 * Sync token prices
 */
export function useSyncPricesMutation(
  options?: UseMutationOptions<SyncPricesResponse, Error, void>,
) {
  const queryClient = useQueryClient();

  return useMutation<SyncPricesResponse, Error, void>({
    mutationFn: () => syncPrices(),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['Tokens'] });
    },
    ...options,
  });
}
