export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface ContractAddresses {
  [contractName: string]: string;
}

export interface DeploymentInfo {
  network: string;
  chainId: number;
  contracts: ContractAddresses;
  deployedAt: number;
}
