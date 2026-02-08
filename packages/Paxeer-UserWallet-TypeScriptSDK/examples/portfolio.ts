/**
 * Examples for Portfolio API
 *
 * These examples demonstrate how to use the Portfolio API functions.
 */

import { ApiClient } from '../src/sdk';
import { getPortfolio, getHoldings, getTransactions } from '../src/api';

// Initialize the SDK client
const client = new ApiClient({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  token: 'your-auth-token',
});

/**
 * Example: Get full portfolio
 * Returns complete portfolio summary including native balance, all token holdings, and totals
 * GET /api/v1/portfolio/{address}
 */
async function exampleGetPortfolio() {
  try {
    const result = await client.portfolio.getPortfolio({
      address: 'example-address',
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Get token holdings
 * Returns only the token holdings for a wallet address
 * GET /api/v1/portfolio/{address}/holdings
 */
async function exampleGetHoldings() {
  try {
    const result = await client.portfolio.getHoldings({
      address: 'example-address',
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Get transactions
 * Returns transaction history including native transfers and token transfers
 * GET /api/v1/portfolio/{address}/transactions
 */
async function exampleGetTransactions() {
  try {
    const result = await client.portfolio.getTransactions({
      address: 'example-address',
      limit: 10,
      offset: 42,
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
