import { readContract, writeContract, simulateContract, getPublicClient } from 'wagmi/actions';
import type { Config } from 'wagmi';
import { EventEmitterAbi } from '../abis/event-emitter';
import { EVENTEMITTER_ADDRESS } from '../constants/addresses';

/**
 * Read `EventEmitter.factory`
 */
export async function readEventEmitterFactory(config: Config, chainId?: number) {
  return readContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'factory',
    chainId,
  });
}

/**
 * Read `EventEmitter.isRegisteredWallet`
 */
export async function readEventEmitterIsRegisteredWallet(
  config: Config,
  args: { wallet: `0x${string}` },
  chainId?: number,
) {
  return readContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'isRegisteredWallet',
    args: [args.wallet],
    chainId,
  });
}

/**
 * Read `EventEmitter.owner`
 */
export async function readEventEmitterOwner(config: Config, chainId?: number) {
  return readContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'owner',
    chainId,
  });
}

/**
 * Read `EventEmitter.paused`
 */
export async function readEventEmitterPaused(config: Config, chainId?: number) {
  return readContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'paused',
    chainId,
  });
}

/**
 * Read `EventEmitter.totalTransactions`
 */
export async function readEventEmitterTotalTransactions(config: Config, chainId?: number) {
  return readContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'totalTransactions',
    chainId,
  });
}

/**
 * Read `EventEmitter.walletOwnerOf`
 */
export async function readEventEmitterWalletOwnerOf(
  config: Config,
  args: { wallet: `0x${string}` },
  chainId?: number,
) {
  return readContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'walletOwnerOf',
    args: [args.wallet],
    chainId,
  });
}

/**
 * Write `EventEmitter.deregisterWallet`
 */
export async function writeEventEmitterDeregisterWallet(
  config: Config,
  args: { wallet: `0x${string}` },
) {
  return writeContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'deregisterWallet',
    args: [args.wallet],
  });
}

/**
 * Simulate `EventEmitter.deregisterWallet`
 */
export async function simulateEventEmitterDeregisterWallet(
  config: Config,
  args: { wallet: `0x${string}` },
) {
  return simulateContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'deregisterWallet',
    args: [args.wallet],
  });
}

/**
 * Write `EventEmitter.emitTransaction`
 */
export async function writeEventEmitterEmitTransaction(
  config: Config,
  args: {
    to: `0x${string}`;
    value: bigint;
    data: `0x${string}`;
    txNonce: bigint;
    success: boolean;
    returnData: `0x${string}`;
  },
) {
  return writeContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'emitTransaction',
    args: [args.to, args.value, args.data, args.txNonce, args.success, args.returnData],
  });
}

/**
 * Simulate `EventEmitter.emitTransaction`
 */
export async function simulateEventEmitterEmitTransaction(
  config: Config,
  args: {
    to: `0x${string}`;
    value: bigint;
    data: `0x${string}`;
    txNonce: bigint;
    success: boolean;
    returnData: `0x${string}`;
  },
) {
  return simulateContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'emitTransaction',
    args: [args.to, args.value, args.data, args.txNonce, args.success, args.returnData],
  });
}

/**
 * Write `EventEmitter.pause`
 */
export async function writeEventEmitterPause(config: Config) {
  return writeContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'pause',
  });
}

/**
 * Simulate `EventEmitter.pause`
 */
export async function simulateEventEmitterPause(config: Config) {
  return simulateContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'pause',
  });
}

/**
 * Write `EventEmitter.registerWallet`
 */
export async function writeEventEmitterRegisterWallet(
  config: Config,
  args: { wallet: `0x${string}`; walletOwner: `0x${string}` },
) {
  return writeContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'registerWallet',
    args: [args.wallet, args.walletOwner],
  });
}

/**
 * Simulate `EventEmitter.registerWallet`
 */
export async function simulateEventEmitterRegisterWallet(
  config: Config,
  args: { wallet: `0x${string}`; walletOwner: `0x${string}` },
) {
  return simulateContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'registerWallet',
    args: [args.wallet, args.walletOwner],
  });
}

/**
 * Write `EventEmitter.renounceOwnership`
 */
export async function writeEventEmitterRenounceOwnership(config: Config) {
  return writeContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'renounceOwnership',
  });
}

/**
 * Simulate `EventEmitter.renounceOwnership`
 */
export async function simulateEventEmitterRenounceOwnership(config: Config) {
  return simulateContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'renounceOwnership',
  });
}

/**
 * Write `EventEmitter.setFactory`
 */
export async function writeEventEmitterSetFactory(
  config: Config,
  args: { _factory: `0x${string}` },
) {
  return writeContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'setFactory',
    args: [args._factory],
  });
}

/**
 * Simulate `EventEmitter.setFactory`
 */
export async function simulateEventEmitterSetFactory(
  config: Config,
  args: { _factory: `0x${string}` },
) {
  return simulateContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'setFactory',
    args: [args._factory],
  });
}

/**
 * Write `EventEmitter.transferOwnership`
 */
export async function writeEventEmitterTransferOwnership(
  config: Config,
  args: { newOwner: `0x${string}` },
) {
  return writeContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
  });
}

/**
 * Simulate `EventEmitter.transferOwnership`
 */
export async function simulateEventEmitterTransferOwnership(
  config: Config,
  args: { newOwner: `0x${string}` },
) {
  return simulateContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
  });
}

/**
 * Write `EventEmitter.unpause`
 */
export async function writeEventEmitterUnpause(config: Config) {
  return writeContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'unpause',
  });
}

/**
 * Simulate `EventEmitter.unpause`
 */
export async function simulateEventEmitterUnpause(config: Config) {
  return simulateContract(config, {
    address: EVENTEMITTER_ADDRESS,
    abi: EventEmitterAbi,
    functionName: 'unpause',
  });
}
