/**
 * Examples for Health API
 *
 * These examples demonstrate how to use the Health API functions.
 */

import { ApiClient } from '../src/sdk';
import { healthCheck } from '../src/api';

// Initialize the SDK client
const client = new ApiClient({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  token: 'your-auth-token',
});

/**
 * Example: Health check
 * Returns service health status and version
 * GET /health
 */
async function exampleHealthCheck() {
  try {
    const result = await client.health.healthCheck();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
