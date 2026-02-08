# Paxeer User Stats API — MCP Server

This MCP (Model Context Protocol) server exposes all **Paxeer User Stats API** API endpoints as tools that AI models can invoke.

## Setup

Add this to your MCP client configuration (e.g. Claude Desktop, Windsurf, Cursor):

```json
{
  "mcpServers": {
    "paxeer-user-stats-api": {
      "command": "node",
      "args": ["/root/dev-portal/Paxeer-UserWallet-TypeScriptSDK/dist/mcp/server.js"],
      "env": {
        "API_BASE_URL": "https://us-east-1.user-stats.sidiora.exchange",
        "API_TOKEN": "your-token-here"
      }
    }
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_BASE_URL` | Base URL for the API | `https://us-east-1.user-stats.sidiora.exchange` |
| `API_TOKEN` | Bearer token for authentication | — |
| `API_KEY` | API key for authentication | — |

## Available Tools

| Tool | Method | Path | Description |
|------|--------|------|-------------|
| `healthCheck` | GET | `/health` | Health check |
| `listTokens` | GET | `/api/v1/tokens` | List token statistics |
| `auditTokens` | GET | `/api/v1/tokens/audit` | Audit token metadata |
| `syncTokens` | POST | `/api/v1/tokens/sync` | Sync tokens from Paxscan |
| `getToken` | GET | `/api/v1/tokens/{address}` | Get token metadata |
| `syncPrices` | POST | `/api/v1/prices/sync` | Sync token prices |
| `getPortfolio` | GET | `/api/v1/portfolio/{address}` | Get full portfolio |
| `getHoldings` | GET | `/api/v1/portfolio/{address}/holdings` | Get token holdings |
| `getTransactions` | GET | `/api/v1/portfolio/{address}/transactions` | Get transactions |
| `getBalance` | GET | `/api/v1/portfolio/{address}/balance` | Get balance with daily PNL |
| `getPnlHistory` | GET | `/api/v1/portfolio/{address}/pnl` | Get PNL history |
| `getPortfolioValueChart` | GET | `/api/v1/portfolio/{address}/charts/value` | Portfolio value chart |
| `getPnlChart` | GET | `/api/v1/portfolio/{address}/charts/pnl` | Daily PNL chart |
| `getHoldingsChart` | GET | `/api/v1/portfolio/{address}/charts/holdings` | Holdings count chart |
| `getTxVolumeChart` | GET | `/api/v1/portfolio/{address}/charts/tx-volume` | Transaction volume chart |

## How It Works

1. The MCP server starts and listens on **stdio** (JSON-RPC 2.0)
2. An AI model (e.g. Claude) discovers available tools via `tools/list`
3. The model calls a tool via `tools/call` with the required arguments
4. The server dispatches the call to the corresponding SDK function
5. The result is returned as structured text content
