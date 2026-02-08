/**
 * Environment variable type declarations.
 * Ensures type-safety when accessing process.env across workspaces.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";

    // Chain / RPC
    RPC_URL_PAXEER: string;
    RPC_URL_MAINNET?: string;
    RPC_URL_TESTNET?: string;
    ETHERSCAN_API_KEY?: string;

    // Admin
    ADMIN_PRIVATE_KEY: string;

    // Contract Addresses
    WALLET_FACTORY_ADDRESS: string;
    EVENT_EMITTER_ADDRESS: string;
    USDL_TOKEN_ADDRESS: string;

    // Backend
    DATABASE_URL: string;
    API_PORT: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;

    // Moralis
    MORALIS_API_KEY: string;

    // Eligibility
    MIN_QUALITY_TRANSACTIONS: string;
    TX_HISTORY_MONTHS: string;

    // Funding
    FUNDING_AMOUNT: string;

    // Workers
    ASSIGNMENT_POLL_INTERVAL: string;
    FUNDING_POLL_INTERVAL: string;

    // Graph
    SUBGRAPH_NAME: string;
    GRAPH_NODE_URL: string;

    // Wallet Stats SDK
    VITE_WALLET_STATS_API_URL: string;
  }
}
