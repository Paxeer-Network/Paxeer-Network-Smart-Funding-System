import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { healthCheck } from '../api/health';
import { HealthCheckResponse } from '../types/api-types';
import { healthKeys } from './query-keys';

/**
 * Health check
 */
export function useHealthCheck(
  options?: Omit<UseQueryOptions<HealthCheckResponse, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<HealthCheckResponse, Error>({
    queryKey: healthKeys.healthCheck(),
    queryFn: () => healthCheck(),
    ...options,
  });
}
