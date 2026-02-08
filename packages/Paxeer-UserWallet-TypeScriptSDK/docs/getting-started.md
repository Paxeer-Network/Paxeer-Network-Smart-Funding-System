# Getting Started

## Installation

```bash
npm install @paxeer-network/user-stats-typescript-sdk
```

## Quick Setup

```typescript
import { ApiClient } from '@paxeer-network/user-stats-typescript-sdk';

const client = new ApiClient({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  token: 'your-auth-token',
});
```

## Using Individual Functions

You can also import and use API functions directly:

```typescript
import { httpClient } from '@paxeer-network/user-stats-typescript-sdk/lib';

// Configure the HTTP client first
httpClient.configure({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  token: 'your-auth-token',
});

import { healthCheck } from '@paxeer-network/user-stats-typescript-sdk/api';

const result = await healthCheck(/* params */);
```

## Using React Hooks

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApiClient } from '@paxeer-network/user-stats-typescript-sdk';

// Initialize SDK before rendering
const client = new ApiClient({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  token: 'your-auth-token',
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  );
}
```
