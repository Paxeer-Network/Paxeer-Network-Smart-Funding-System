/**
 * Quick Start Guide
 *
 * This file demonstrates the basic setup and usage of the SDK.
 */

import { ApiClient } from '../src/sdk';
import { ApiError } from '../src/lib';

// ============================================
// 1. Initialize the client
// ============================================

const client = new ApiClient({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  // Authentication (choose one)
  token: 'your-bearer-token',
  // apiKey: 'your-api-key',
  timeout: 30000,
});

// ============================================
// 2. Make API calls
// ============================================

async function main() {
  try {
    // Example: Health check
    const result = await client.health.healthCheck();
    console.log(result);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error [${error.statusCode}]: ${error.message}`);
      if (error.isUnauthorized) {
        console.error('Please check your authentication credentials.');
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

main();

// ============================================
// 3. Using with React (hooks)
// ============================================

/*
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHealthCheck } from '../src/hooks';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  );
}

function MyComponent() {
  const { data, isLoading, error } = useHealthCheck();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
*/
