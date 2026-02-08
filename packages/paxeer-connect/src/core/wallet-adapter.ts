// ── Wallet Adapter ───────────────────────────────────────────────────────────
//
// Resolves an EOA address to its assigned SmartWallet via the WalletFactory,
// fetches metadata, balances, and nonce from the SmartWallet contract.

import {
  createPublicClient,
  http,
  type PublicClient,
  type Transport,
  type Chain,
  getContract,
} from 'viem';
import { SmartWalletAbi } from '../abis/smart-wallet';
import { WalletFactoryAbi } from '../abis/wallet-factory';
import {
  WALLET_FACTORY_ADDRESS,
} from '../constants/addresses';
import { PAXEER_NETWORK_CHAIN } from '../constants/chains';
import { WalletNotFoundError } from './errors';
import type { Address, PaxeerWallet, WalletMetadata } from './types';

/** Paxeer chain definition for viem */
export const paxeerChain: Chain = {
  id: PAXEER_NETWORK_CHAIN.id,
  name: PAXEER_NETWORK_CHAIN.name,
  nativeCurrency: { name: 'Paxeer', symbol: 'PAX', decimals: 18 },
  rpcUrls: {
    default: { http: [PAXEER_NETWORK_CHAIN.rpc] },
  },
  blockExplorers: {
    default: { name: 'Paxscan', url: PAXEER_NETWORK_CHAIN.explorer },
  },
};

export class WalletAdapter {
  private _publicClient: PublicClient<Transport, Chain>;
  private _factoryAddress: Address;

  constructor(rpcUrl?: string, factoryAddress?: Address) {
    this._factoryAddress = factoryAddress ?? WALLET_FACTORY_ADDRESS;
    this._publicClient = createPublicClient({
      chain: paxeerChain,
      transport: http(rpcUrl ?? PAXEER_NETWORK_CHAIN.rpc),
    });
  }

  get publicClient(): PublicClient<Transport, Chain> {
    return this._publicClient;
  }

  /**
   * Resolves an EOA to its SmartWallet address via WalletFactory.getWallet().
   * Throws WalletNotFoundError if no wallet is assigned.
   */
  async resolveSmartWallet(owner: Address): Promise<Address> {
    const wallet = await this._publicClient.readContract({
      address: this._factoryAddress,
      abi: WalletFactoryAbi,
      functionName: 'getWallet',
      args: [owner],
    });

    const addr = wallet as Address;
    if (!addr || addr === '0x0000000000000000000000000000000000000000') {
      throw new WalletNotFoundError(owner);
    }

    return addr;
  }

  /**
   * Verifies that an address is a factory-deployed SmartWallet.
   */
  async isFactoryWallet(wallet: Address): Promise<boolean> {
    const result = await this._publicClient.readContract({
      address: this._factoryAddress,
      abi: WalletFactoryAbi,
      functionName: 'isWallet',
      args: [wallet],
    });
    return result as boolean;
  }

  /**
   * Fetches the full PaxeerWallet state for a connected user.
   */
  async getWalletState(owner: Address, smartWallet: Address): Promise<PaxeerWallet> {
    const [metadata, nonce, balance] = await Promise.all([
      this.getMetadata(smartWallet),
      this.getNonce(smartWallet),
      this.getNativeBalance(smartWallet),
    ]);

    return {
      owner,
      smartWallet,
      metadata,
      nonce,
      nativeBalance: balance,
      isConnected: true,
    };
  }

  /**
   * Fetches on-chain wallet metadata (argusId, userAlias, socials).
   */
  async getMetadata(smartWallet: Address): Promise<WalletMetadata> {
    const result = await this._publicClient.readContract({
      address: smartWallet,
      abi: SmartWalletAbi,
      functionName: 'getMetadata',
    });

    const meta = result as {
      argusId: string;
      onchainId: Address;
      userAlias: string;
      telegram: string;
      twitter: string;
      website: string;
      github: string;
      discord: string;
    };
    return {
      argusId: meta.argusId,
      onchainId: meta.onchainId,
      userAlias: meta.userAlias,
      telegram: meta.telegram,
      twitter: meta.twitter,
      website: meta.website,
      github: meta.github,
      discord: meta.discord,
    };
  }

  /**
   * Fetches the current nonce from the SmartWallet.
   */
  async getNonce(smartWallet: Address): Promise<bigint> {
    const result = await this._publicClient.readContract({
      address: smartWallet,
      abi: SmartWalletAbi,
      functionName: 'getNonce',
    });
    return result as bigint;
  }

  /**
   * Fetches native balance held by the SmartWallet.
   */
  async getNativeBalance(smartWallet: Address): Promise<bigint> {
    const result = await this._publicClient.readContract({
      address: smartWallet,
      abi: SmartWalletAbi,
      functionName: 'getBalance',
    });
    return result as bigint;
  }

  /**
   * Fetches ERC-20 token balance held by the SmartWallet.
   */
  async getTokenBalance(smartWallet: Address, token: Address): Promise<bigint> {
    const result = await this._publicClient.readContract({
      address: smartWallet,
      abi: SmartWalletAbi,
      functionName: 'getTokenBalance',
      args: [token],
    });
    return result as bigint;
  }

  /**
   * Fetches the EIP-712 domain separator from the SmartWallet.
   */
  async getDomainSeparator(smartWallet: Address): Promise<`0x${string}`> {
    const result = await this._publicClient.readContract({
      address: smartWallet,
      abi: SmartWalletAbi,
      functionName: 'DOMAIN_SEPARATOR',
    });
    return result as `0x${string}`;
  }
}
