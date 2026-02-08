import { readContract, writeContract, simulateContract, getPublicClient } from 'wagmi/actions';
import type { Config } from 'wagmi';
import { SmartWalletAbi } from '../abis/smart-wallet';
import { SMARTWALLET_ADDRESS } from '../constants/addresses';

/**
 * Read `SmartWallet.DOMAIN_SEPARATOR`
 */
export async function readSmartWalletDOMAINSEPARATOR(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'DOMAIN_SEPARATOR',
    chainId,
  });
}

/**
 * Read `SmartWallet.DOMAIN_TYPEHASH`
 */
export async function readSmartWalletDOMAINTYPEHASH(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'DOMAIN_TYPEHASH',
    chainId,
  });
}

/**
 * Read `SmartWallet.EXECUTE_TYPEHASH`
 */
export async function readSmartWalletEXECUTETYPEHASH(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'EXECUTE_TYPEHASH',
    chainId,
  });
}

/**
 * Read `SmartWallet.eventEmitter`
 */
export async function readSmartWalletEventEmitter(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'eventEmitter',
    chainId,
  });
}

/**
 * Read `SmartWallet.factory`
 */
export async function readSmartWalletFactory(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'factory',
    chainId,
  });
}

/**
 * Read `SmartWallet.getBalance`
 */
export async function readSmartWalletGetBalance(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'getBalance',
    chainId,
  });
}

/**
 * Read `SmartWallet.getMetadata`
 */
export async function readSmartWalletGetMetadata(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'getMetadata',
    chainId,
  });
}

/**
 * Read `SmartWallet.getNonce`
 */
export async function readSmartWalletGetNonce(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'getNonce',
    chainId,
  });
}

/**
 * Read `SmartWallet.getTokenBalance`
 */
export async function readSmartWalletGetTokenBalance(
  config: Config,
  args: { token: `0x${string}` },
  chainId?: number,
) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'getTokenBalance',
    args: [args.token],
    chainId,
  });
}

/**
 * Read `SmartWallet.getTransaction`
 */
export async function readSmartWalletGetTransaction(
  config: Config,
  args: { txNonce: bigint },
  chainId?: number,
) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'getTransaction',
    args: [args.txNonce],
    chainId,
  });
}

/**
 * Read `SmartWallet.isAssigned`
 */
export async function readSmartWalletIsAssigned(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'isAssigned',
    chainId,
  });
}

/**
 * Read `SmartWallet.paused`
 */
export async function readSmartWalletPaused(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'paused',
    chainId,
  });
}

/**
 * Read `SmartWallet.ssoRegistry`
 */
export async function readSmartWalletSsoRegistry(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'ssoRegistry',
    chainId,
  });
}

/**
 * Read `SmartWallet.walletOwner`
 */
export async function readSmartWalletWalletOwner(config: Config, chainId?: number) {
  return readContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'walletOwner',
    chainId,
  });
}

/**
 * Write `SmartWallet.assignOwner`
 */
export async function writeSmartWalletAssignOwner(
  config: Config,
  args: { newOwner: `0x${string}` },
) {
  return writeContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'assignOwner',
    args: [args.newOwner],
  });
}

/**
 * Simulate `SmartWallet.assignOwner`
 */
export async function simulateSmartWalletAssignOwner(
  config: Config,
  args: { newOwner: `0x${string}` },
) {
  return simulateContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'assignOwner',
    args: [args.newOwner],
  });
}

/**
 * Write `SmartWallet.execute`
 */
export async function writeSmartWalletExecute(
  config: Config,
  args: { to: `0x${string}`; value: bigint; data: `0x${string}` },
  value?: bigint,
) {
  return writeContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'execute',
    args: [args.to, args.value, args.data],
    value,
  });
}

/**
 * Simulate `SmartWallet.execute`
 */
export async function simulateSmartWalletExecute(
  config: Config,
  args: { to: `0x${string}`; value: bigint; data: `0x${string}` },
  value?: bigint,
) {
  return simulateContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'execute',
    args: [args.to, args.value, args.data],
    value,
  });
}

/**
 * Write `SmartWallet.executeBatch`
 */
export async function writeSmartWalletExecuteBatch(
  config: Config,
  args: {
    targets: readonly `0x${string}`[];
    values: readonly bigint[];
    datas: readonly `0x${string}`[];
  },
  value?: bigint,
) {
  return writeContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'executeBatch',
    args: [args.targets, args.values, args.datas],
    value,
  });
}

/**
 * Simulate `SmartWallet.executeBatch`
 */
export async function simulateSmartWalletExecuteBatch(
  config: Config,
  args: {
    targets: readonly `0x${string}`[];
    values: readonly bigint[];
    datas: readonly `0x${string}`[];
  },
  value?: bigint,
) {
  return simulateContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'executeBatch',
    args: [args.targets, args.values, args.datas],
    value,
  });
}

/**
 * Write `SmartWallet.executeWithSignature`
 */
export async function writeSmartWalletExecuteWithSignature(
  config: Config,
  args: {
    to: `0x${string}`;
    value: bigint;
    data: `0x${string}`;
    deadline: bigint;
    signature: `0x${string}`;
  },
  value?: bigint,
) {
  return writeContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'executeWithSignature',
    args: [args.to, args.value, args.data, args.deadline, args.signature],
    value,
  });
}

/**
 * Simulate `SmartWallet.executeWithSignature`
 */
export async function simulateSmartWalletExecuteWithSignature(
  config: Config,
  args: {
    to: `0x${string}`;
    value: bigint;
    data: `0x${string}`;
    deadline: bigint;
    signature: `0x${string}`;
  },
  value?: bigint,
) {
  return simulateContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'executeWithSignature',
    args: [args.to, args.value, args.data, args.deadline, args.signature],
    value,
  });
}

/**
 * Write `SmartWallet.initialize`
 */
export async function writeSmartWalletInitialize(
  config: Config,
  args: { owner_: `0x${string}`; eventEmitter_: `0x${string}`; ssoRegistry_: `0x${string}` },
) {
  return writeContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'initialize',
    args: [args.owner_, args.eventEmitter_, args.ssoRegistry_],
  });
}

/**
 * Simulate `SmartWallet.initialize`
 */
export async function simulateSmartWalletInitialize(
  config: Config,
  args: { owner_: `0x${string}`; eventEmitter_: `0x${string}`; ssoRegistry_: `0x${string}` },
) {
  return simulateContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'initialize',
    args: [args.owner_, args.eventEmitter_, args.ssoRegistry_],
  });
}

/**
 * Write `SmartWallet.pause`
 */
export async function writeSmartWalletPause(config: Config) {
  return writeContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'pause',
  });
}

/**
 * Simulate `SmartWallet.pause`
 */
export async function simulateSmartWalletPause(config: Config) {
  return simulateContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'pause',
  });
}

/**
 * Write `SmartWallet.setMetadata`
 */
export async function writeSmartWalletSetMetadata(
  config: Config,
  args: {
    metadata_: {
      argusId: string;
      onchainId: `0x${string}`;
      userAlias: string;
      telegram: string;
      twitter: string;
      website: string;
      github: string;
      discord: string;
    };
  },
) {
  return writeContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'setMetadata',
    args: [args.metadata_],
  });
}

/**
 * Simulate `SmartWallet.setMetadata`
 */
export async function simulateSmartWalletSetMetadata(
  config: Config,
  args: {
    metadata_: {
      argusId: string;
      onchainId: `0x${string}`;
      userAlias: string;
      telegram: string;
      twitter: string;
      website: string;
      github: string;
      discord: string;
    };
  },
) {
  return simulateContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'setMetadata',
    args: [args.metadata_],
  });
}

/**
 * Write `SmartWallet.transferOwnership`
 */
export async function writeSmartWalletTransferOwnership(
  config: Config,
  args: { newOwner: `0x${string}` },
) {
  return writeContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
  });
}

/**
 * Simulate `SmartWallet.transferOwnership`
 */
export async function simulateSmartWalletTransferOwnership(
  config: Config,
  args: { newOwner: `0x${string}` },
) {
  return simulateContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
  });
}

/**
 * Write `SmartWallet.unpause`
 */
export async function writeSmartWalletUnpause(config: Config) {
  return writeContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'unpause',
  });
}

/**
 * Simulate `SmartWallet.unpause`
 */
export async function simulateSmartWalletUnpause(config: Config) {
  return simulateContract(config, {
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'unpause',
  });
}
