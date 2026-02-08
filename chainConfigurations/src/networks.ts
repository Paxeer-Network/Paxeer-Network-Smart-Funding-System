import type { NetworkConfig, ContractAddresses, DeploymentInfo } from "@paxeer/common";

export const networks: Record<string, NetworkConfig> = {
  "paxeer-network": {
    chainId: 125,
    name: "Paxeer Network",
    rpcUrl: process.env.RPC_URL_PAXEER || "https://public-rpc.paxeer.app/rpc",
    explorerUrl: "https://paxscan.paxeer.app",
    nativeCurrency: {
      name: "Paxeer",
      symbol: "PAX",
      decimals: 18,
    },
  },
  mainnet: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: process.env.RPC_URL_MAINNET || "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  sepolia: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: process.env.RPC_URL_TESTNET || "https://rpc.sepolia.org",
    explorerUrl: "https://sepolia.etherscan.io",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
};

// =========================================================================
// Contract addresses per network
// =========================================================================

export const contractAddresses: Record<string, ContractAddresses> = {
  "paxeer-network": {
    EventEmitter: "0x5fF05F82928C9f742AAF8Ac03dBEFbeaDC493a58",
    SSORegistry: "0x6cf9392abc7947Dbc9289Fd1F65c4a4B9d423332",
    SmartWalletImplementation: "0x444490870B799544d841625E7a040b41F17FCe21",
    WalletFactory: "0xec0f990c01a3571259Be6183Ec8ED25a0aC67AD6",
  },
};

// =========================================================================
// Deployment records
// =========================================================================

export const deployments: Record<string, DeploymentInfo> = {
  "paxeer-network": {
    network: "paxeer-network",
    chainId: 125,
    contracts: contractAddresses["paxeer-network"],
    deployedAt: Date.now(),
  },
};

// =========================================================================
// Helpers
// =========================================================================

export function getNetwork(name: string): NetworkConfig | undefined {
  return networks[name];
}

export function getNetworkByChainId(chainId: number): NetworkConfig | undefined {
  return Object.values(networks).find((n) => n.chainId === chainId);
}

export function getContracts(network: string): ContractAddresses | undefined {
  return contractAddresses[network];
}

export function getDeployment(network: string): DeploymentInfo | undefined {
  return deployments[network];
}
