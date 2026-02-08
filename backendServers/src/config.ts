import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const CONFIG = {
  port: parseInt(process.env.API_PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://paxeer:paxeer@localhost:5432/paxeer_funding",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "paxeer-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // Moralis
  moralisApiKey: process.env.MORALIS_API_KEY || "",

  // Chain / RPC
  paxeerRpcUrl:
    process.env.RPC_URL_PAXEER || "https://public-rpc.paxeer.app/rpc",
  adminPrivateKey: process.env.ADMIN_PRIVATE_KEY || "",

  // Contract addresses (Paxeer Network)
  walletFactoryAddress:
    process.env.WALLET_FACTORY_ADDRESS ||
    "0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6",
  eventEmitterAddress:
    process.env.EVENT_EMITTER_ADDRESS ||
    "0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58",

  // USDL token
  usdlTokenAddress: process.env.USDL_TOKEN_ADDRESS || "",
  fundingAmount: process.env.FUNDING_AMOUNT || "100", // default USDL amount

  // Eligibility
  minQualityTransactions: parseInt(
    process.env.MIN_QUALITY_TRANSACTIONS || "20",
    10,
  ),
  txHistoryMonths: parseInt(process.env.TX_HISTORY_MONTHS || "2", 10),
} as const;
