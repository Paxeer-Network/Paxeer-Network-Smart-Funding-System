import {
  useReadContract,
  useWriteContract,
  useSimulateContract,
  useWatchContractEvent,
} from 'wagmi';
import { EventEmitterAbi } from '../abis/event-emitter';
import { EVENT_EMITTER_ADDRESS as EVENTEMITTER_ADDRESS } from '../constants/addresses';

/**
 * Read `EventEmitter.factory`
 */
export function useReadEventEmitterFactory(config?: { chainId?: number }) {
  return useReadContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'factory',
    ...config,
  });
}

/**
 * Read `EventEmitter.isRegisteredWallet`
 */
export function useReadEventEmitterIsRegisteredWallet(
  args: { wallet: `0x${string}` },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'isRegisteredWallet',
    args: [args.wallet],
    ...config,
  });
}

/**
 * Read `EventEmitter.owner`
 */
export function useReadEventEmitterOwner(config?: { chainId?: number }) {
  return useReadContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'owner',
    ...config,
  });
}

/**
 * Read `EventEmitter.paused`
 */
export function useReadEventEmitterPaused(config?: { chainId?: number }) {
  return useReadContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'paused',
    ...config,
  });
}

/**
 * Read `EventEmitter.totalTransactions`
 */
export function useReadEventEmitterTotalTransactions(config?: { chainId?: number }) {
  return useReadContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'totalTransactions',
    ...config,
  });
}

/**
 * Read `EventEmitter.walletOwnerOf`
 */
export function useReadEventEmitterWalletOwnerOf(
  args: { wallet: `0x${string}` },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'walletOwnerOf',
    args: [args.wallet],
    ...config,
  });
}

/**
 * Write `EventEmitter.deregisterWallet`
 */
export function useWriteEventEmitterDeregisterWallet() {
  const result = useWriteContract();

  const write = (args: { wallet: `0x${string}` }) =>
    result.writeContract({
      address: EVENTEMITTER_ADDRESS,
      abi: EventEmitterAbi,
      functionName: 'deregisterWallet',
      args: [args.wallet],
    });

  return { ...result, write };
}

/**
 * Simulate `EventEmitter.deregisterWallet`
 */
export function useSimulateEventEmitterDeregisterWallet(
  args: { wallet: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'deregisterWallet',
    args: [args.wallet],
    ...config,
  });
}

/**
 * Write `EventEmitter.emitTransaction`
 */
export function useWriteEventEmitterEmitTransaction() {
  const result = useWriteContract();

  const write = (args: {
    to: `0x${string}`;
    value: bigint;
    data: `0x${string}`;
    txNonce: bigint;
    success: boolean;
    returnData: `0x${string}`;
  }) =>
    result.writeContract({
      address: EVENTEMITTER_ADDRESS,
      abi: EventEmitterAbi,
      functionName: 'emitTransaction',
      args: [args.to, args.value, args.data, args.txNonce, args.success, args.returnData],
    });

  return { ...result, write };
}

/**
 * Simulate `EventEmitter.emitTransaction`
 */
export function useSimulateEventEmitterEmitTransaction(
  args: {
    to: `0x${string}`;
    value: bigint;
    data: `0x${string}`;
    txNonce: bigint;
    success: boolean;
    returnData: `0x${string}`;
  },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'emitTransaction',
    args: [args.to, args.value, args.data, args.txNonce, args.success, args.returnData],
    ...config,
  });
}

/**
 * Write `EventEmitter.pause`
 */
export function useWriteEventEmitterPause() {
  const result = useWriteContract();

  const write = () =>
    result.writeContract({
      address: EVENTEMITTER_ADDRESS,
      abi: EventEmitterAbi,
      functionName: 'pause',
    });

  return { ...result, write };
}

/**
 * Simulate `EventEmitter.pause`
 */
export function useSimulateEventEmitterPause(config?: { chainId?: number }) {
  return useSimulateContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'pause',
    ...config,
  });
}

/**
 * Write `EventEmitter.registerWallet`
 */
export function useWriteEventEmitterRegisterWallet() {
  const result = useWriteContract();

  const write = (args: { wallet: `0x${string}`; walletOwner: `0x${string}` }) =>
    result.writeContract({
      address: EVENTEMITTER_ADDRESS,
      abi: EventEmitterAbi,
      functionName: 'registerWallet',
      args: [args.wallet, args.walletOwner],
    });

  return { ...result, write };
}

/**
 * Simulate `EventEmitter.registerWallet`
 */
export function useSimulateEventEmitterRegisterWallet(
  args: { wallet: `0x${string}`; walletOwner: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'registerWallet',
    args: [args.wallet, args.walletOwner],
    ...config,
  });
}

/**
 * Write `EventEmitter.renounceOwnership`
 */
export function useWriteEventEmitterRenounceOwnership() {
  const result = useWriteContract();

  const write = () =>
    result.writeContract({
      address: EVENTEMITTER_ADDRESS,
      abi: EventEmitterAbi,
      functionName: 'renounceOwnership',
    });

  return { ...result, write };
}

/**
 * Simulate `EventEmitter.renounceOwnership`
 */
export function useSimulateEventEmitterRenounceOwnership(config?: { chainId?: number }) {
  return useSimulateContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'renounceOwnership',
    ...config,
  });
}

/**
 * Write `EventEmitter.setFactory`
 */
export function useWriteEventEmitterSetFactory() {
  const result = useWriteContract();

  const write = (args: { _factory: `0x${string}` }) =>
    result.writeContract({
      address: EVENTEMITTER_ADDRESS,
      abi: EventEmitterAbi,
      functionName: 'setFactory',
      args: [args._factory],
    });

  return { ...result, write };
}

/**
 * Simulate `EventEmitter.setFactory`
 */
export function useSimulateEventEmitterSetFactory(
  args: { _factory: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'setFactory',
    args: [args._factory],
    ...config,
  });
}

/**
 * Write `EventEmitter.transferOwnership`
 */
export function useWriteEventEmitterTransferOwnership() {
  const result = useWriteContract();

  const write = (args: { newOwner: `0x${string}` }) =>
    result.writeContract({
      address: EVENTEMITTER_ADDRESS,
      abi: EventEmitterAbi,
      functionName: 'transferOwnership',
      args: [args.newOwner],
    });

  return { ...result, write };
}

/**
 * Simulate `EventEmitter.transferOwnership`
 */
export function useSimulateEventEmitterTransferOwnership(
  args: { newOwner: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
    ...config,
  });
}

/**
 * Write `EventEmitter.unpause`
 */
export function useWriteEventEmitterUnpause() {
  const result = useWriteContract();

  const write = () =>
    result.writeContract({
      address: EVENTEMITTER_ADDRESS,
      abi: EventEmitterAbi,
      functionName: 'unpause',
    });

  return { ...result, write };
}

/**
 * Simulate `EventEmitter.unpause`
 */
export function useSimulateEventEmitterUnpause(config?: { chainId?: number }) {
  return useSimulateContract({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'unpause',
    ...config,
  });
}

/**
 * Watch `EventEmitter.OwnershipTransferred` event
 */
export function useWatchEventEmitterOwnershipTransferred(config: {
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
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    eventName: 'OwnershipTransferred',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `EventEmitter.Paused` event
 */
export function useWatchEventEmitterPaused(config: {
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
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    eventName: 'Paused',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `EventEmitter.TransactionExecuted` event
 */
export function useWatchEventEmitterTransactionExecuted(config: {
  onLogs: (
    logs: Array<{
      args: {
        wallet: `0x${string}`;
        to: `0x${string}`;
        value: bigint;
        data: `0x${string}`;
        nonce: bigint;
        timestamp: bigint;
        success: boolean;
        returnData: `0x${string}`;
      };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    eventName: 'TransactionExecuted',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `EventEmitter.Unpaused` event
 */
export function useWatchEventEmitterUnpaused(config: {
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
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    eventName: 'Unpaused',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `EventEmitter.WalletDeregistered` event
 */
export function useWatchEventEmitterWalletDeregistered(config: {
  onLogs: (
    logs: Array<{
      args: { wallet: `0x${string}` };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    eventName: 'WalletDeregistered',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `EventEmitter.WalletRegistered` event
 */
export function useWatchEventEmitterWalletRegistered(config: {
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
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    eventName: 'WalletRegistered',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}
