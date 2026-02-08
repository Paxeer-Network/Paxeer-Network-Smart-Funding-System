import { SDKConfig, SDKError, RequestOptions } from './config';
import { httpClient } from '../lib/http-client';
import { healthCheck } from '../api/health';
import { listTokens, auditTokens, syncTokens, getToken, syncPrices } from '../api/tokens';
import { getPortfolio, getHoldings, getTransactions } from '../api/portfolio';
import { getBalance, getPnlHistory } from '../api/pnl';
import {
  getPortfolioValueChart,
  getPnlChart,
  getHoldingsChart,
  getTxVolumeChart,
} from '../api/charts';
import {
  HealthCheckResponse,
  ListTokensResponse,
  AuditTokensResponse,
  SyncTokensResponse,
  GetTokenRequest,
  GetTokenResponse,
  SyncPricesResponse,
  GetPortfolioRequest,
  GetPortfolioResponse,
  GetHoldingsRequest,
  GetHoldingsResponse,
  GetTransactionsRequest,
  GetTransactionsResponse,
  GetBalanceRequest,
  GetBalanceResponse,
  GetPnlHistoryRequest,
  GetPnlHistoryResponse,
  GetPortfolioValueChartRequest,
  GetPortfolioValueChartResponse,
  GetPnlChartRequest,
  GetPnlChartResponse,
  GetHoldingsChartRequest,
  GetHoldingsChartResponse,
  GetTxVolumeChartRequest,
  GetTxVolumeChartResponse,
} from '../types/api-types';

class HealthApi {
  /** Health check */
  async healthCheck(): Promise<HealthCheckResponse> {
    return healthCheck();
  }
}

class TokensApi {
  /** List token statistics */
  async listTokens(): Promise<ListTokensResponse> {
    return listTokens();
  }

  /** Audit token metadata */
  async auditTokens(): Promise<AuditTokensResponse> {
    return auditTokens();
  }

  /** Sync tokens from Paxscan */
  async syncTokens(): Promise<SyncTokensResponse> {
    return syncTokens();
  }

  /** Get token metadata */
  async getToken(params: GetTokenRequest): Promise<GetTokenResponse> {
    return getToken(params);
  }

  /** Sync token prices */
  async syncPrices(): Promise<SyncPricesResponse> {
    return syncPrices();
  }
}

class PortfolioApi {
  /** Get full portfolio */
  async getPortfolio(params: GetPortfolioRequest): Promise<GetPortfolioResponse> {
    return getPortfolio(params);
  }

  /** Get token holdings */
  async getHoldings(params: GetHoldingsRequest): Promise<GetHoldingsResponse> {
    return getHoldings(params);
  }

  /** Get transactions */
  async getTransactions(params: GetTransactionsRequest): Promise<GetTransactionsResponse> {
    return getTransactions(params);
  }
}

class PNLApi {
  /** Get balance with daily PNL */
  async getBalance(params: GetBalanceRequest): Promise<GetBalanceResponse> {
    return getBalance(params);
  }

  /** Get PNL history */
  async getPnlHistory(params: GetPnlHistoryRequest): Promise<GetPnlHistoryResponse> {
    return getPnlHistory(params);
  }
}

class ChartsApi {
  /** Portfolio value chart */
  async getPortfolioValueChart(
    params: GetPortfolioValueChartRequest,
  ): Promise<GetPortfolioValueChartResponse> {
    return getPortfolioValueChart(params);
  }

  /** Daily PNL chart */
  async getPnlChart(params: GetPnlChartRequest): Promise<GetPnlChartResponse> {
    return getPnlChart(params);
  }

  /** Holdings count chart */
  async getHoldingsChart(params: GetHoldingsChartRequest): Promise<GetHoldingsChartResponse> {
    return getHoldingsChart(params);
  }

  /** Transaction volume chart */
  async getTxVolumeChart(params: GetTxVolumeChartRequest): Promise<GetTxVolumeChartResponse> {
    return getTxVolumeChart(params);
  }
}

/**
 * Paxeer User Stats API SDK Client
 * Portfolio tracking and analytics service for Paxeer Network wallets.

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

 * Version: 0.1.0
 */
export class ApiClient {
  private config: SDKConfig;

  public readonly health: HealthApi;
  public readonly tokens: TokensApi;
  public readonly portfolio: PortfolioApi;
  public readonly pNL: PNLApi;
  public readonly charts: ChartsApi;

  constructor(config: SDKConfig) {
    this.config = config;

    // Configure the HTTP client
    httpClient.configure({
      baseUrl: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      token: config.token,
      apiKey: config.apiKey,
      timeout: config.timeout,
      onRequest: config.onRequest,
      onResponse: config.onResponse,
      onError: config.onError,
    });

    this.health = new HealthApi();
    this.tokens = new TokensApi();
    this.portfolio = new PortfolioApi();
    this.pNL = new PNLApi();
    this.charts = new ChartsApi();
  }

  /** Update SDK configuration */
  configure(config: Partial<SDKConfig>): void {
    this.config = { ...this.config, ...config };
    httpClient.configure({
      baseUrl: this.config.baseUrl,
      headers: this.config.headers,
      token: this.config.token,
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
      onRequest: this.config.onRequest,
      onResponse: this.config.onResponse,
      onError: this.config.onError,
    });
  }

  /** Set authentication token */
  setToken(token: string): void {
    this.configure({ token });
  }

  /** Set API key */
  setApiKey(apiKey: string): void {
    this.configure({ apiKey });
  }
}
