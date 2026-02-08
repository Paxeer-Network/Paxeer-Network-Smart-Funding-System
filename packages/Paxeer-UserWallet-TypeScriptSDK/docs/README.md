# Paxeer User Stats API SDK Documentation

Portfolio tracking and analytics service for Paxeer Network wallets.

Provides real-time portfolio data, token holdings, transaction history,
PNL tracking, and chart data for visualization.

## Features
- **Portfolio Overview**: Complete wallet summary with native and token holdings
- **Token Holdings**: Detailed token balances with USD values
- **Transaction History**: Native transactions and ERC-20/721 transfers
- **PNL Tracking**: Daily profit/loss calculations and history
- **Chart Data**: Time-series data for portfolio analytics

## Authentication
Currently no authentication required. Rate limiting applies.


**Version**: 0.1.0

## Table of Contents

- [Getting Started](./getting-started.md)
- [Error Handling](./error-handling.md)
- [API Reference](#api-reference)
- [Models](#models)

## API Reference

### [Health](./api/health.md)

- `GET /health` — Health check

### [Tokens](./api/tokens.md)

- `GET /api/v1/tokens` — List token statistics
- `GET /api/v1/tokens/audit` — Audit token metadata
- `POST /api/v1/tokens/sync` — Sync tokens from Paxscan
- `GET /api/v1/tokens/{address}` — Get token metadata
- `POST /api/v1/prices/sync` — Sync token prices

### [Portfolio](./api/portfolio.md)

- `GET /api/v1/portfolio/{address}` — Get full portfolio
- `GET /api/v1/portfolio/{address}/holdings` — Get token holdings
- `GET /api/v1/portfolio/{address}/transactions` — Get transactions

### [PNL](./api/pnl.md)

- `GET /api/v1/portfolio/{address}/balance` — Get balance with daily PNL
- `GET /api/v1/portfolio/{address}/pnl` — Get PNL history

### [Charts](./api/charts.md)

- `GET /api/v1/portfolio/{address}/charts/value` — Portfolio value chart
- `GET /api/v1/portfolio/{address}/charts/pnl` — Daily PNL chart
- `GET /api/v1/portfolio/{address}/charts/holdings` — Holdings count chart
- `GET /api/v1/portfolio/{address}/charts/tx-volume` — Transaction volume chart

## Models

- [HealthResponse](./models/health-response.md)
- [TokenStats](./models/token-stats.md)
- [TokenAuditResponse](./models/token-audit-response.md)
- [TokenSyncResponse](./models/token-sync-response.md)
- [PriceSyncResponse](./models/price-sync-response.md)
- [TokenMetadata](./models/token-metadata.md)
- [Portfolio](./models/portfolio.md)
- [NativeBalance](./models/native-balance.md)
- [TokenHolding](./models/token-holding.md)
- [TransactionResponse](./models/transaction-response.md)
- [TransactionItem](./models/transaction-item.md)
- [TokenTransferItem](./models/token-transfer-item.md)
- [BalanceResponse](./models/balance-response.md)
- [PnlHistoryResponse](./models/pnl-history-response.md)
- [PnlHistoryItem](./models/pnl-history-item.md)
- [ChartResponse](./models/chart-response.md)
- [ChartDataPoint](./models/chart-data-point.md)
