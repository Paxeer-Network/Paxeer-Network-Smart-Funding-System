# Error Handling

The SDK provides structured error handling through the `ApiError` class.

## Basic Error Handling

```typescript
import { ApiError } from '@paxeer-network/user-stats-typescript-sdk/lib';

try {
  const result = await client.someEndpoint();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Status: ${error.statusCode}`);
    console.error(`Message: ${error.message}`);
    console.error(`Response: ${JSON.stringify(error.response)}`);
  }
}
```

## Error Properties

| Property | Type | Description |
|----------|------|-------------|
| `statusCode` | `number` | HTTP status code (0 for network errors) |
| `message` | `string` | Error message |
| `response` | `unknown` | Raw error response body |
| `isClientError` | `boolean` | True for 4xx errors |
| `isServerError` | `boolean` | True for 5xx errors |
| `isNetworkError` | `boolean` | True for network failures |
| `isTimeout` | `boolean` | True for request timeouts |
| `isUnauthorized` | `boolean` | True for 401 errors |
| `isForbidden` | `boolean` | True for 403 errors |
| `isNotFound` | `boolean` | True for 404 errors |

## Global Error Handler

You can set up a global error handler when initializing the client:

```typescript
const client = new ApiClient({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  onError: (error) => {
    if (error.isUnauthorized) {
      // Redirect to login
      window.location.href = '/login';
    }
    // Log to error tracking service
    console.error(error.toJSON());
  },
});
```

## Request/Response Interceptors

```typescript
const client = new ApiClient({
  baseUrl: 'https://us-east-1.user-stats.sidiora.exchange',
  onRequest: (config) => {
    // Modify request before sending
    console.log(`${config.method} ${config.url}`);
    return config;
  },
  onResponse: (response) => {
    // Process response
    console.log(`Response: ${response.status}`);
    return response;
  },
});
```
