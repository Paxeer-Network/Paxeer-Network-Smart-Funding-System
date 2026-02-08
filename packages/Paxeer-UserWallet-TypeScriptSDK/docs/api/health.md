# Health API

Service health endpoints

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |

## GET /health

**Health check**

Returns service health status and version

### Usage

```typescript
import { healthCheck } from './api';

const result = await healthCheck();
```

### React Hook

```typescript
import { useHealthCheck } from './hooks';

const { data, isLoading, error } = useHealthCheck();
```

### Responses

| Status | Description | Type |
|--------|-------------|------|
| 200 | Service is healthy | `{ status: 'ok'; version: string }` |

---

