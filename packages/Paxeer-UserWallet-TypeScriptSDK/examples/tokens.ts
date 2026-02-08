/**
 * Examples for Tokens API
 *
 * These examples demonstrate how to use the Tokens API functions.
 */

import { ApiClient } from '../src/sdk';
import { listTokens, auditTokens, syncTokens, getToken, syncPrices } from '../src/api';

// Initialize the SDK client
const client = new ApiClient({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  token: 'your-auth-token',
});

/**
 * Example: List token statistics
 * Returns token metadata statistics and counts
 * GET /api/v1/tokens
 */
async function exampleListTokens() {
  try {
    const result = await client.tokens.listTokens();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Audit token metadata
 * Returns detailed token metadata completeness report
 * GET /api/v1/tokens/audit
 */
async function exampleAuditTokens() {
  try {
    const result = await client.tokens.auditTokens();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Sync tokens from Paxscan
 * Triggers synchronization of token metadata from Paxscan database
 * POST /api/v1/tokens/sync
 */
async function exampleSyncTokens() {
  try {
    const result = await client.tokens.syncTokens();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Get token metadata
 * Returns metadata for a specific token by contract address
 * GET /api/v1/tokens/{address}
 */
async function exampleGetToken() {
  try {
    const result = await client.tokens.getToken({
      address: 'example-address',
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Sync token prices
 * Triggers price synchronization from all sources:
- Network pools (HLPMM, SwapDex)
- External APIs (Moralis)
- Fixed stablecoin prices

 * POST /api/v1/prices/sync
 */
async function exampleSyncPrices() {
  try {
    const result = await client.tokens.syncPrices();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
