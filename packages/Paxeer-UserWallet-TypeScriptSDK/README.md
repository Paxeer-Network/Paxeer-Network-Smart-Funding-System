# @paxeer-network/user-stats-typescript-sdk

[![npm version](https://img.shields.io/npm/v/@paxeer-network/user-stats-typescript-sdk.svg)](https://www.npmjs.com/package/@paxeer-network/user-stats-typescript-sdk)
[![license](https://img.shields.io/npm/l/@paxeer-network/user-stats-typescript-sdk.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

> Fully typed TypeScript SDK — auto-generated from an OpenAPI specification on 2026-02-08.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [React Hooks](#react-hooks)
- [MCP Server](#mcp-server)
- [AI Skills](#ai-skills)
- [API Playground](#api-playground)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Development](#development)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Requirements

| Dependency | Version |
| ---------- | ------- |
| Node.js    | `>= 18` |
| TypeScript | `>= 5.0` |
| React      | `>= 18` |
| @tanstack/react-query | `>= 5.0` |

## Installation

```sh
# npm
npm install @paxeer-network/user-stats-typescript-sdk

# pnpm
pnpm add @paxeer-network/user-stats-typescript-sdk

# yarn
yarn add @paxeer-network/user-stats-typescript-sdk
```

## Quick Start

```typescript
import { ApiClient } from '@paxeer-network/user-stats-typescript-sdk';

const client = new ApiClient({
  baseUrl: 'https://api.example.com',
  token: process.env.API_TOKEN,
});

// All methods are fully typed — enjoy autocomplete
const response = await client.get('/example');
console.log(response.data);
```

### Using individual API functions

If you prefer a more functional approach, import standalone API functions directly:

```typescript
import { createHttpClient } from '@paxeer-network/user-stats-typescript-sdk';

const http = createHttpClient({ baseUrl: 'https://api.example.com' });
// Use typed API functions with the HTTP client
```

## Configuration

The `ApiClient` accepts the following options:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `baseUrl` | `string` | — | Base URL of the API |
| `token` | `string` | — | Bearer token for authentication |
| `timeout` | `number` | `30000` | Request timeout in milliseconds |
| `headers` | `Record<string, string>` | `{}` | Additional default headers |
| `interceptors` | `Interceptors` | — | Request/response interceptors |
| `retries` | `number` | `0` | Number of automatic retries |

**Environment variables** — The SDK respects the following env vars:

```sh
_PAXEER_NETWORK_USER_STATS_TYPESCRIPT_SDK_BASE_URL=   # Override the base URL
_PAXEER_NETWORK_USER_STATS_TYPESCRIPT_SDK_API_TOKEN=   # Set the auth token
```

## React Hooks

The SDK ships with auto-generated React Query hooks for every endpoint:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExampleQuery } from '@paxeer-network/user-stats-typescript-sdk';

function App() {
  const { data, isLoading, error } = useExampleQuery({ id: 1 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

Each hook is fully typed — return values, parameters, and errors all have proper TypeScript types.

## MCP Server

The SDK includes a [Model Context Protocol](https://modelcontextprotocol.io/) server that exposes every API endpoint as a tool for AI assistants:

```sh
# Start the MCP server
npx ts-node src/mcp/server.ts
```

Compatible with Claude, ChatGPT, and any MCP-compliant client.

## AI Skills

Pre-built function definitions for LLM tool-calling:

```typescript
import { openAiFunctions } from '@paxeer-network/user-stats-typescript-sdk/skills';

// Use with OpenAI function calling
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  tools: openAiFunctions,
  messages: [...],
});
```

Also includes LangChain tool definitions — see `src/skills/` for details.

## API Playground

An interactive API explorer is included in the `playground/` directory:

```sh
cd playground
pnpm install
pnpm dev        # Development server on http://localhost:3000
pnpm build      # Static export to playground/out/
npx serve out   # Serve the static build
```

Edit `playground/playground.config.ts` to customize branding, auth defaults, and feature toggles.

## Error Handling

The SDK provides typed error classes for common failure modes:

```typescript
import { ApiClient, ApiError, NetworkError, TimeoutError } from '@paxeer-network/user-stats-typescript-sdk';

try {
  const result = await client.get('/resource');
} catch (error) {
  if (error instanceof ApiError) {
    // Server returned an error status (4xx / 5xx)
    console.error(error.status, error.body);
  } else if (error instanceof NetworkError) {
    // Network-level failure (DNS, connection refused, etc.)
    console.error(error.message);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out');
  }
}
```

## Project Structure

```
.
├── src/
│   ├── types/         # TypeScript interfaces & enums from OpenAPI schemas
│   ├── models/        # Runtime model classes with validation helpers
│   ├── api/           # One typed function per API endpoint
│   ├── hooks/         # Auto-generated React Query hooks
│   ├── sdk/           # High-level SDK client with tag-based sub-clients
│   ├── lib/           # HTTP client, error classes, utilities
│   ├── constants/     # Endpoint paths, headers, status codes
│   ├── mcp/           # MCP server & tool definitions
│   ├── skills/        # AI skill / function-calling definitions
│   └── index.ts       # Barrel export
├── examples/          # Runnable usage examples
├── docs/              # Generated API documentation
├── playground/        # Interactive API explorer (Next.js)
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```sh
# Install dependencies
pnpm install

# Build the SDK
pnpm build

# Run tests
pnpm test

# Lint & format
pnpm lint
pnpm fix
```

### Regenerating from the OpenAPI spec

```sh
npx sdk-gen generate \
  --input path/to/openapi.yaml \
  --output ./ \
  --name @paxeer-network/user-stats-typescript-sdk
```

## API Reference

Full API surface documentation is available in [`api.md`](./api.md) and the [`docs/`](./docs/) directory.

## Contributing

Contributions are welcome! Please read the [Contributing Guide](./CONTRIBUTING.md) before submitting a pull request.

## Security

To report a vulnerability, please see our [Security Policy](./SECURITY.md).

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
