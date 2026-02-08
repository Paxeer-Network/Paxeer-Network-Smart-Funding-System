import { httpClient } from '../lib/http-client';
import {
  ListTokensResponse,
  AuditTokensResponse,
  SyncTokensResponse,
  GetTokenRequest,
  GetTokenResponse,
  SyncPricesResponse,
} from '../types/api-types';

/**
 * List token statistics
 * Returns token metadata statistics and counts
 */
export async function listTokens(): Promise<ListTokensResponse> {
  const path = '/api/v1/tokens';

  return httpClient.request<ListTokensResponse>({
    method: 'GET',
    path,
  });
}

/**
 * Audit token metadata
 * Returns detailed token metadata completeness report
 */
export async function auditTokens(): Promise<AuditTokensResponse> {
  const path = '/api/v1/tokens/audit';

  return httpClient.request<AuditTokensResponse>({
    method: 'GET',
    path,
  });
}

/**
 * Sync tokens from Paxscan
 * Triggers synchronization of token metadata from Paxscan database
 */
export async function syncTokens(): Promise<SyncTokensResponse> {
  const path = '/api/v1/tokens/sync';

  return httpClient.request<SyncTokensResponse>({
    method: 'POST',
    path,
  });
}

/**
 * Get token metadata
 * Returns metadata for a specific token by contract address
 */
export async function getToken(params: GetTokenRequest): Promise<GetTokenResponse> {
  const path = `/api/v1/tokens/${params.address}`;

  return httpClient.request<GetTokenResponse>({
    method: 'GET',
    path,
  });
}

/**
 * Sync token prices
 * Triggers price synchronization from all sources:
- Network pools (HLPMM, SwapDex)
- External APIs (Moralis)
- Fixed stablecoin prices

 */
export async function syncPrices(): Promise<SyncPricesResponse> {
  const path = '/api/v1/prices/sync';

  return httpClient.request<SyncPricesResponse>({
    method: 'POST',
    path,
  });
}
