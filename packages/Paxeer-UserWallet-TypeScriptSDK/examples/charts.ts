/**
 * Examples for Charts API
 *
 * These examples demonstrate how to use the Charts API functions.
 */

import { ApiClient } from '../src/sdk';
import {
  getPortfolioValueChart,
  getPnlChart,
  getHoldingsChart,
  getTxVolumeChart,
} from '../src/api';

// Initialize the SDK client
const client = new ApiClient({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  token: 'your-auth-token',
});

/**
 * Example: Portfolio value chart
 * Returns time-series data of total portfolio value for charting
 * GET /api/v1/portfolio/{address}/charts/value
 */
async function exampleGetPortfolioValueChart() {
  try {
    const result = await client.charts.getPortfolioValueChart({
      address: 'example-address',
      days: 42,
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Daily PNL chart
 * Returns time-series data of daily profit/loss for charting
 * GET /api/v1/portfolio/{address}/charts/pnl
 */
async function exampleGetPnlChart() {
  try {
    const result = await client.charts.getPnlChart({
      address: 'example-address',
      days: 42,
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Holdings count chart
 * Returns time-series data of number of token holdings
 * GET /api/v1/portfolio/{address}/charts/holdings
 */
async function exampleGetHoldingsChart() {
  try {
    const result = await client.charts.getHoldingsChart({
      address: 'example-address',
      days: 42,
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Example: Transaction volume chart
 * Returns time-series data of daily transaction volume in USD
 * GET /api/v1/portfolio/{address}/charts/tx-volume
 */
async function exampleGetTxVolumeChart() {
  try {
    const result = await client.charts.getTxVolumeChart({
      address: 'example-address',
      days: 42,
    });
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
