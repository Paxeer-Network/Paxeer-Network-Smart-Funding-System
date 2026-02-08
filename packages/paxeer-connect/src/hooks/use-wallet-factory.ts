import {
  useReadContract,
  useWriteContract,
  useSimulateContract,
  useWatchContractEvent,
} from 'wagmi';
import { WalletFactoryAbi } from '../abis/wallet-factory';
import { WALLET_FACTORY_ADDRESS as WALLETFACTORY_ADDRESS } from '../constants/addresses';

/**
 * Read `WalletFactory.eventEmitter`
 */
export function useReadWalletFactoryEventEmitter(config?: { chainId?: number }) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'eventEmitter',
    ...config,
  });
}

/**
 * Read `WalletFactory.getWallet`
 */
export function useReadWalletFactoryGetWallet(
  args: { owner_: `0x${string}` },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'getWallet',
    args: [args.owner_],
    ...config,
  });
}

/**
 * Read `WalletFactory.implementation`
 */
export function useReadWalletFactoryImplementation(config?: { chainId?: number }) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'implementation',
    ...config,
  });
}

/**
 * Read `WalletFactory.isWallet`
 */
export function useReadWalletFactoryIsWallet(
  args: { wallet: `0x${string}` },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'isWallet',
    args: [args.wallet],
    ...config,
  });
}

/**
 * Read `WalletFactory.owner`
 */
export function useReadWalletFactoryOwner(config?: { chainId?: number }) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'owner',
    ...config,
  });
}

/**
 * Read `WalletFactory.paused`
 */
export function useReadWalletFactoryPaused(config?: { chainId?: number }) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'paused',
    ...config,
  });
}

/**
 * Read `WalletFactory.predictWalletAddress`
 */
export function useReadWalletFactoryPredictWalletAddress(
  args: { owner_: `0x${string}`; salt: `0x${string}` },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'predictWalletAddress',
    args: [args.owner_, args.salt],
    ...config,
  });
}

/**
 * Read `WalletFactory.ssoRegistry`
 */
export function useReadWalletFactorySsoRegistry(config?: { chainId?: number }) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'ssoRegistry',
    ...config,
  });
}

/**
 * Read `WalletFactory.totalWallets`
 */
export function useReadWalletFactoryTotalWallets(config?: { chainId?: number }) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'totalWallets',
    ...config,
  });
}

/**
 * Read `WalletFactory.unassignedWalletAt`
 */
export function useReadWalletFactoryUnassignedWalletAt(
  args: { index: bigint },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'unassignedWalletAt',
    args: [args.index],
    ...config,
  });
}

/**
 * Read `WalletFactory.unassignedWalletCount`
 */
export function useReadWalletFactoryUnassignedWalletCount(config?: { chainId?: number }) {
  return useReadContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'unassignedWalletCount',
    ...config,
  });
}

/**
 * Write `WalletFactory.assignWallet`
 */
export function useWriteWalletFactoryAssignWallet() {
  const result = useWriteContract();

  const write = (args: { wallet: `0x${string}`; newOwner: `0x${string}` }) =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'assignWallet',
      args: [args.wallet, args.newOwner],
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.assignWallet`
 */
export function useSimulateWalletFactoryAssignWallet(
  args: { wallet: `0x${string}`; newOwner: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'assignWallet',
    args: [args.wallet, args.newOwner],
    ...config,
  });
}

/**
 * Write `WalletFactory.createWallet`
 */
export function useWriteWalletFactoryCreateWallet() {
  const result = useWriteContract();

  const write = (args: { owner_: `0x${string}` }) =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'createWallet',
      args: [args.owner_],
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.createWallet`
 */
export function useSimulateWalletFactoryCreateWallet(
  args: { owner_: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'createWallet',
    args: [args.owner_],
    ...config,
  });
}

/**
 * Write `WalletFactory.createWalletWithSalt`
 */
export function useWriteWalletFactoryCreateWalletWithSalt() {
  const result = useWriteContract();

  const write = (args: { owner_: `0x${string}`; salt: `0x${string}` }) =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'createWalletWithSalt',
      args: [args.owner_, args.salt],
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.createWalletWithSalt`
 */
export function useSimulateWalletFactoryCreateWalletWithSalt(
  args: { owner_: `0x${string}`; salt: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'createWalletWithSalt',
    args: [args.owner_, args.salt],
    ...config,
  });
}

/**
 * Write `WalletFactory.deployWallets`
 */
export function useWriteWalletFactoryDeployWallets() {
  const result = useWriteContract();

  const write = (args: { count: bigint }) =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'deployWallets',
      args: [args.count],
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.deployWallets`
 */
export function useSimulateWalletFactoryDeployWallets(
  args: { count: bigint },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'deployWallets',
    args: [args.count],
    ...config,
  });
}

/**
 * Write `WalletFactory.pause`
 */
export function useWriteWalletFactoryPause() {
  const result = useWriteContract();

  const write = () =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'pause',
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.pause`
 */
export function useSimulateWalletFactoryPause(config?: { chainId?: number }) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'pause',
    ...config,
  });
}

/**
 * Write `WalletFactory.renounceOwnership`
 */
export function useWriteWalletFactoryRenounceOwnership() {
  const result = useWriteContract();

  const write = () =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'renounceOwnership',
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.renounceOwnership`
 */
export function useSimulateWalletFactoryRenounceOwnership(config?: { chainId?: number }) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'renounceOwnership',
    ...config,
  });
}

/**
 * Write `WalletFactory.setEventEmitter`
 */
export function useWriteWalletFactorySetEventEmitter() {
  const result = useWriteContract();

  const write = (args: { newEventEmitter: `0x${string}` }) =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'setEventEmitter',
      args: [args.newEventEmitter],
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.setEventEmitter`
 */
export function useSimulateWalletFactorySetEventEmitter(
  args: { newEventEmitter: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'setEventEmitter',
    args: [args.newEventEmitter],
    ...config,
  });
}

/**
 * Write `WalletFactory.setImplementation`
 */
export function useWriteWalletFactorySetImplementation() {
  const result = useWriteContract();

  const write = (args: { newImplementation: `0x${string}` }) =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'setImplementation',
      args: [args.newImplementation],
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.setImplementation`
 */
export function useSimulateWalletFactorySetImplementation(
  args: { newImplementation: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'setImplementation',
    args: [args.newImplementation],
    ...config,
  });
}

/**
 * Write `WalletFactory.setSSORegistry`
 */
export function useWriteWalletFactorySetSSORegistry() {
  const result = useWriteContract();

  const write = (args: { newSSORegistry: `0x${string}` }) =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'setSSORegistry',
      args: [args.newSSORegistry],
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.setSSORegistry`
 */
export function useSimulateWalletFactorySetSSORegistry(
  args: { newSSORegistry: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'setSSORegistry',
    args: [args.newSSORegistry],
    ...config,
  });
}

/**
 * Write `WalletFactory.transferOwnership`
 */
export function useWriteWalletFactoryTransferOwnership() {
  const result = useWriteContract();

  const write = (args: { newOwner: `0x${string}` }) =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'transferOwnership',
      args: [args.newOwner],
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.transferOwnership`
 */
export function useSimulateWalletFactoryTransferOwnership(
  args: { newOwner: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
    ...config,
  });
}

/**
 * Write `WalletFactory.unpause`
 */
export function useWriteWalletFactoryUnpause() {
  const result = useWriteContract();

  const write = () =>
    result.writeContract({
      address: WALLETFACTORY_ADDRESS,
      abi: WalletFactoryAbi,
      functionName: 'unpause',
    });

  return { ...result, write };
}

/**
 * Simulate `WalletFactory.unpause`
 */
export function useSimulateWalletFactoryUnpause(config?: { chainId?: number }) {
  return useSimulateContract({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    functionName: 'unpause',
    ...config,
  });
}

/**
 * Watch `WalletFactory.OwnershipTransferred` event
 */
export function useWatchWalletFactoryOwnershipTransferred(config: {
  onLogs: (
    logs: Array<{
      args: { previousOwner: `0x${string}`; newOwner: `0x${string}` };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    eventName: 'OwnershipTransferred',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `WalletFactory.Paused` event
 */
export function useWatchWalletFactoryPaused(config: {
  onLogs: (
    logs: Array<{
      args: { account: `0x${string}` };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    eventName: 'Paused',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `WalletFactory.Unpaused` event
 */
export function useWatchWalletFactoryUnpaused(config: {
  onLogs: (
    logs: Array<{
      args: { account: `0x${string}` };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    eventName: 'Unpaused',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `WalletFactory.WalletAssigned` event
 */
export function useWatchWalletFactoryWalletAssigned(config: {
  onLogs: (
    logs: Array<{
      args: { wallet: `0x${string}`; owner: `0x${string}` };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    eventName: 'WalletAssigned',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `WalletFactory.WalletCreated` event
 */
export function useWatchWalletFactoryWalletCreated(config: {
  onLogs: (
    logs: Array<{
      args: { owner: `0x${string}`; wallet: `0x${string}`; salt: `0x${string}` };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    eventName: 'WalletCreated',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `WalletFactory.WalletPreDeployed` event
 */
export function useWatchWalletFactoryWalletPreDeployed(config: {
  onLogs: (
    logs: Array<{
      args: { wallet: `0x${string}`; index: bigint };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: WALLETFACTORY_ADDRESS,
    abi: WalletFactoryAbi,
    eventName: 'WalletPreDeployed',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}
