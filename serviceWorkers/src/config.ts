import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const CONFIG = {
  // Database
  databaseUrl:
    process.env.DATABASE_URL ||
    "postgresql://paxeer:paxeer@localhost:5432/paxeer_funding",

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
  fundingAmount: process.env.FUNDING_AMOUNT || "100",

  // Worker intervals (ms)
  assignmentPollInterval: parseInt(
    process.env.ASSIGNMENT_POLL_INTERVAL || "10000",
    10,
  ),
  fundingPollInterval: parseInt(
    process.env.FUNDING_POLL_INTERVAL || "15000",
    10,
  ),
} as const;
