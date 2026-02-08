import { readContract, writeContract, simulateContract, getPublicClient } from 'wagmi/actions';
import type { Config } from 'wagmi';
import { WalletFactoryAbi } from '../abis/wallet-factory';
import { WALLETFACTORY_ADDRESS } from '../constants/addresses';

/**
 * Read `WalletFactory.eventEmitter`
 */
export async function readWalletFactoryEventEmitter(config: Config, chainId?: number) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'eventEmitter',
    chainId,
  });
}

/**
 * Read `WalletFactory.getWallet`
 */
export async function readWalletFactoryGetWallet(
  config: Config,
  args: { owner_: `0x${string}` },
  chainId?: number,
) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'getWallet',
    args: [args.owner_],
    chainId,
  });
}

/**
 * Read `WalletFactory.implementation`
 */
export async function readWalletFactoryImplementation(config: Config, chainId?: number) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'implementation',
    chainId,
  });
}

/**
 * Read `WalletFactory.isWallet`
 */
export async function readWalletFactoryIsWallet(
  config: Config,
  args: { wallet: `0x${string}` },
  chainId?: number,
) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'isWallet',
    args: [args.wallet],
    chainId,
  });
}

/**
 * Read `WalletFactory.owner`
 */
export async function readWalletFactoryOwner(config: Config, chainId?: number) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'owner',
    chainId,
  });
}

/**
 * Read `WalletFactory.paused`
 */
export async function readWalletFactoryPaused(config: Config, chainId?: number) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'paused',
    chainId,
  });
}

/**
 * Read `WalletFactory.predictWalletAddress`
 */
export async function readWalletFactoryPredictWalletAddress(
  config: Config,
  args: { owner_: `0x${string}`; salt: `0x${string}` },
  chainId?: number,
) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'predictWalletAddress',
    args: [args.owner_, args.salt],
    chainId,
  });
}

/**
 * Read `WalletFactory.ssoRegistry`
 */
export async function readWalletFactorySsoRegistry(config: Config, chainId?: number) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'ssoRegistry',
    chainId,
  });
}

/**
 * Read `WalletFactory.totalWallets`
 */
export async function readWalletFactoryTotalWallets(config: Config, chainId?: number) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'totalWallets',
    chainId,
  });
}

/**
 * Read `WalletFactory.unassignedWalletAt`
 */
export async function readWalletFactoryUnassignedWalletAt(
  config: Config,
  args: { index: bigint },
  chainId?: number,
) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'unassignedWalletAt',
    args: [args.index],
    chainId,
  });
}

/**
 * Read `WalletFactory.unassignedWalletCount`
 */
export async function readWalletFactoryUnassignedWalletCount(config: Config, chainId?: number) {
  return readContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'unassignedWalletCount',
    chainId,
  });
}

/**
 * Write `WalletFactory.assignWallet`
 */
export async function writeWalletFactoryAssignWallet(
  config: Config,
  args: { wallet: `0x${string}`; newOwner: `0x${string}` },
) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'assignWallet',
    args: [args.wallet, args.newOwner],
  });
}

/**
 * Simulate `WalletFactory.assignWallet`
 */
export async function simulateWalletFactoryAssignWallet(
  config: Config,
  args: { wallet: `0x${string}`; newOwner: `0x${string}` },
) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'assignWallet',
    args: [args.wallet, args.newOwner],
  });
}

/**
 * Write `WalletFactory.createWallet`
 */
export async function writeWalletFactoryCreateWallet(
  config: Config,
  args: { owner_: `0x${string}` },
) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'createWallet',
    args: [args.owner_],
  });
}

/**
 * Simulate `WalletFactory.createWallet`
 */
export async function simulateWalletFactoryCreateWallet(
  config: Config,
  args: { owner_: `0x${string}` },
) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'createWallet',
    args: [args.owner_],
  });
}

/**
 * Write `WalletFactory.createWalletWithSalt`
 */
export async function writeWalletFactoryCreateWalletWithSalt(
  config: Config,
  args: { owner_: `0x${string}`; salt: `0x${string}` },
) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'createWalletWithSalt',
    args: [args.owner_, args.salt],
  });
}

/**
 * Simulate `WalletFactory.createWalletWithSalt`
 */
export async function simulateWalletFactoryCreateWalletWithSalt(
  config: Config,
  args: { owner_: `0x${string}`; salt: `0x${string}` },
) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'createWalletWithSalt',
    args: [args.owner_, args.salt],
  });
}

/**
 * Write `WalletFactory.deployWallets`
 */
export async function writeWalletFactoryDeployWallets(config: Config, args: { count: bigint }) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'deployWallets',
    args: [args.count],
  });
}

/**
 * Simulate `WalletFactory.deployWallets`
 */
export async function simulateWalletFactoryDeployWallets(config: Config, args: { count: bigint }) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'deployWallets',
    args: [args.count],
  });
}

/**
 * Write `WalletFactory.pause`
 */
export async function writeWalletFactoryPause(config: Config) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'pause',
  });
}

/**
 * Simulate `WalletFactory.pause`
 */
export async function simulateWalletFactoryPause(config: Config) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'pause',
  });
}

/**
 * Write `WalletFactory.renounceOwnership`
 */
export async function writeWalletFactoryRenounceOwnership(config: Config) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'renounceOwnership',
  });
}

/**
 * Simulate `WalletFactory.renounceOwnership`
 */
export async function simulateWalletFactoryRenounceOwnership(config: Config) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'renounceOwnership',
  });
}

/**
 * Write `WalletFactory.setEventEmitter`
 */
export async function writeWalletFactorySetEventEmitter(
  config: Config,
  args: { newEventEmitter: `0x${string}` },
) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'setEventEmitter',
    args: [args.newEventEmitter],
  });
}

/**
 * Simulate `WalletFactory.setEventEmitter`
 */
export async function simulateWalletFactorySetEventEmitter(
  config: Config,
  args: { newEventEmitter: `0x${string}` },
) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'setEventEmitter',
    args: [args.newEventEmitter],
  });
}

/**
 * Write `WalletFactory.setImplementation`
 */
export async function writeWalletFactorySetImplementation(
  config: Config,
  args: { newImplementation: `0x${string}` },
) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'setImplementation',
    args: [args.newImplementation],
  });
}

/**
 * Simulate `WalletFactory.setImplementation`
 */
export async function simulateWalletFactorySetImplementation(
  config: Config,
  args: { newImplementation: `0x${string}` },
) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'setImplementation',
    args: [args.newImplementation],
  });
}

/**
 * Write `WalletFactory.setSSORegistry`
 */
export async function writeWalletFactorySetSSORegistry(
  config: Config,
  args: { newSSORegistry: `0x${string}` },
) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'setSSORegistry',
    args: [args.newSSORegistry],
  });
}

/**
 * Simulate `WalletFactory.setSSORegistry`
 */
export async function simulateWalletFactorySetSSORegistry(
  config: Config,
  args: { newSSORegistry: `0x${string}` },
) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'setSSORegistry',
    args: [args.newSSORegistry],
  });
}

/**
 * Write `WalletFactory.transferOwnership`
 */
export async function writeWalletFactoryTransferOwnership(
  config: Config,
  args: { newOwner: `0x${string}` },
) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
  });
}

/**
 * Simulate `WalletFactory.transferOwnership`
 */
export async function simulateWalletFactoryTransferOwnership(
  config: Config,
  args: { newOwner: `0x${string}` },
) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
  });
}

/**
 * Write `WalletFactory.unpause`
 */
export async function writeWalletFactoryUnpause(config: Config) {
  return writeContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'unpause',
  });
}

/**
 * Simulate `WalletFactory.unpause`
 */
export async function simulateWalletFactoryUnpause(config: Config) {
  return simulateContract(config, {
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'unpause',
  });
}
