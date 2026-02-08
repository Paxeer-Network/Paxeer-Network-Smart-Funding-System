# API Reference

## Backend API (Express — port 4200)

### Authentication

#### `POST /auth/nonce`
Request a nonce for wallet signature verification.

**Request:**
```json
{ "address": "0x..." }
```

**Response:**
```json
{
  "nonce": "abc123",
  "message": "Sign this message to verify your wallet: abc123"
}
```

#### `POST /auth/verify`
Verify wallet signature and check eligibility.

**Request:**
```json
{
  "address": "0x...",
  "signature": "0x...",
  "network": "ethereum",
  "chainId": 1,
  "chainType": "evm"
}
```

**Response (eligible):**
```json
{
  "eligible": true,
  "token": "jwt-token-here",
  "user": { "address": "0x...", "signupComplete": false }
}
```

**Response (not eligible):**
```json
{
  "eligible": false,
  "message": "Insufficient transaction history"
}
```

### Users

#### `POST /users/complete-signup`
Complete user registration.

**Headers:** `Authorization: Bearer <jwt>`

**Request:**
```json
{
  "email": "user@example.com",
  "pin": "123456",
  "alias": "satoshi"
}
```

#### `GET /users/status`
Get current user status.

**Headers:** `Authorization: Bearer <jwt>`

**Response:**
```json
{
  "address": "0x...",
  "signupComplete": true,
  "smartWallet": "0x...",
  "funded": true
}
```

---

## User Stats SDK REST API

Base URL: `https://us-east-1.user-stats.sidiora.exchange`

### Portfolio

#### `GET /api/v1/portfolio/{address}/balance`
```json
{
  "address": "0x...",
  "native_balance_usd": "150.00",
  "token_balance_usd": "1000.00",
  "total_balance_usd": "1150.00",
  "native_balance": "0.5",
  "token_count": 3,
  "daily_pnl_usd": "12.50",
  "daily_pnl_percent": "1.1"
}
```

#### `GET /api/v1/portfolio/{address}/holdings`
```json
{
  "holdings": [
    {
      "contract_address": "0x...",
      "symbol": "USDL",
      "name": "USDL Stablecoin",
      "decimals": 18,
      "balance": "1000.0",
      "price_usd": "1.00",
      "value_usd": "1000.00",
      "icon_url": "https://..."
    }
  ]
}
```

#### `GET /api/v1/portfolio/{address}/transactions?limit=50`
```json
{
  "transactions": [
    {
      "tx_hash": "0x...",
      "block_number": 12345,
      "timestamp": "2025-01-15T10:30:00Z",
      "from_address": "0x...",
      "to_address": "0x...",
      "value": "1.5",
      "gas_fee": "0.001",
      "status": true,
      "direction": "out",
      "tx_type": "transfer"
    }
  ]
}
```

#### `GET /api/v1/portfolio/{address}/pnl?period=30d`
#### `GET /api/v1/portfolio/{address}/charts/portfolio-value?period=30d`
#### `GET /api/v1/portfolio/{address}/charts/pnl?period=30d`
#### `GET /api/v1/portfolio/{address}/charts/holdings-count?period=30d`
#### `GET /api/v1/portfolio/{address}/charts/tx-volume?period=30d`

---

## Subgraph (The Graph)

Endpoint: `http://localhost:8000/subgraphs/name/paxeer/smart-wallets`

### Queries

```graphql
# Get wallet transactions
query WalletTransactions($wallet: Bytes!, $first: Int) {
  transactionExecuteds(
    where: { wallet: $wallet }
    first: $first
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    wallet
    target
    value
    data
    blockTimestamp
    transactionHash
  }
}

# Get global stats
query GlobalStats {
  walletFactories {
    totalWalletsCreated
    totalWalletsAssigned
  }
}
```
