import { httpClient } from '../lib/http-client';
import { HealthCheckResponse } from '../types/api-types';

/**
 * Health check
 * Returns service health status and version
 */
export async function healthCheck(): Promise<HealthCheckResponse> {
  const path = '/health';

  return httpClient.request<HealthCheckResponse>({
    method: 'GET',
    path,
  });
}
