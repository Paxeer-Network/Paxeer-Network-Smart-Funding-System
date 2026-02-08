/**
 * Examples for PNL API
 *
 * These examples demonstrate how to use the PNL API functions.
 */

import { ApiClient } from '../src/sdk';
import { getBalance, getPnlHistory } from '../src/api';

// Initialize the SDK client
const client = new ApiClient({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  token: 'your-auth-token',
});

/**
 * Example: Get balance with daily PNL
 * Returns current total balance in USD with daily profit/loss calculation
 * GET /api/v1/portfolio/{address}/balance
 */
async function exampleGetBalance() {
  try {
    const result = await client.pNL.getBalance({
      address: 'example-address',
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Get PNL history
 * Returns historical daily PNL data for charting and analysis
 * GET /api/v1/portfolio/{address}/pnl
 */
async function exampleGetPnlHistory() {
  try {
    const result = await client.pNL.getPnlHistory({
      address: 'example-address',
      days: 42,
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
