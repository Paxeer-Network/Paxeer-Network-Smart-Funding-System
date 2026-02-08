import {
  useReadContract,
  useWriteContract,
  useSimulateContract,
  useWatchContractEvent,
} from 'wagmi';
import { SmartWalletAbi } from '../abis/smart-wallet';
import { SMARTWALLET_ADDRESS } from '../constants/addresses';

/**
 * Read `SmartWallet.DOMAIN_SEPARATOR`
 */
export function useReadSmartWalletDOMAINSEPARATOR(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'DOMAIN_SEPARATOR',
    ...config,
  });
}

/**
 * Read `SmartWallet.DOMAIN_TYPEHASH`
 */
export function useReadSmartWalletDOMAINTYPEHASH(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'DOMAIN_TYPEHASH',
    ...config,
  });
}

/**
 * Read `SmartWallet.EXECUTE_TYPEHASH`
 */
export function useReadSmartWalletEXECUTETYPEHASH(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'EXECUTE_TYPEHASH',
    ...config,
  });
}

/**
 * Read `SmartWallet.eventEmitter`
 */
export function useReadSmartWalletEventEmitter(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'eventEmitter',
    ...config,
  });
}

/**
 * Read `SmartWallet.factory`
 */
export function useReadSmartWalletFactory(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'factory',
    ...config,
  });
}

/**
 * Read `SmartWallet.getBalance`
 */
export function useReadSmartWalletGetBalance(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'getBalance',
    ...config,
  });
}

/**
 * Read `SmartWallet.getMetadata`
 */
export function useReadSmartWalletGetMetadata(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'getMetadata',
    ...config,
  });
}

/**
 * Read `SmartWallet.getNonce`
 */
export function useReadSmartWalletGetNonce(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'getNonce',
    ...config,
  });
}

/**
 * Read `SmartWallet.getTokenBalance`
 */
export function useReadSmartWalletGetTokenBalance(
  args: { token: `0x${string}` },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'getTokenBalance',
    args: [args.token],
    ...config,
  });
}

/**
 * Read `SmartWallet.getTransaction`
 */
export function useReadSmartWalletGetTransaction(
  args: { txNonce: bigint },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'getTransaction',
    args: [args.txNonce],
    ...config,
  });
}

/**
 * Read `SmartWallet.isAssigned`
 */
export function useReadSmartWalletIsAssigned(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'isAssigned',
    ...config,
  });
}

/**
 * Read `SmartWallet.paused`
 */
export function useReadSmartWalletPaused(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'paused',
    ...config,
  });
}

/**
 * Read `SmartWallet.ssoRegistry`
 */
export function useReadSmartWalletSsoRegistry(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'ssoRegistry',
    ...config,
  });
}

/**
 * Read `SmartWallet.walletOwner`
 */
export function useReadSmartWalletWalletOwner(config?: { chainId?: number }) {
  return useReadContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'walletOwner',
    ...config,
  });
}

/**
 * Write `SmartWallet.assignOwner`
 */
export function useWriteSmartWalletAssignOwner() {
  const result = useWriteContract();

  const write = (args: { newOwner: `0x${string}` }) =>
    result.writeContract({
      address: SMARTWALLET_ADDRESS,
      abi: SmartWalletAbi,
      functionName: 'assignOwner',
      args: [args.newOwner],
    });

  return { ...result, write };
}

/**
 * Simulate `SmartWallet.assignOwner`
 */
export function useSimulateSmartWalletAssignOwner(
  args: { newOwner: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'assignOwner',
    args: [args.newOwner],
    ...config,
  });
}

/**
 * Write `SmartWallet.execute`
 */
export function useWriteSmartWalletExecute() {
  const result = useWriteContract();

  const write = (args: { to: `0x${string}`; value: bigint; data: `0x${string}` }, value?: bigint) =>
    result.writeContract({
      address: SMARTWALLET_ADDRESS,
      abi: SmartWalletAbi,
      functionName: 'execute',
      args: [args.to, args.value, args.data],
      value,
    });

  return { ...result, write };
}

/**
 * Simulate `SmartWallet.execute`
 */
export function useSimulateSmartWalletExecute(
  args: { to: `0x${string}`; value: bigint; data: `0x${string}` },
  value?: bigint,
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'execute',
    args: [args.to, args.value, args.data],
    value,
    ...config,
  });
}

/**
 * Write `SmartWallet.executeBatch`
 */
export function useWriteSmartWalletExecuteBatch() {
  const result = useWriteContract();

  const write = (
    args: {
      targets: readonly `0x${string}`[];
      values: readonly bigint[];
      datas: readonly `0x${string}`[];
    },
    value?: bigint,
  ) =>
    result.writeContract({
      address: SMARTWALLET_ADDRESS,
      abi: SmartWalletAbi,
      functionName: 'executeBatch',
      args: [args.targets, args.values, args.datas],
      value,
    });

  return { ...result, write };
}

/**
 * Simulate `SmartWallet.executeBatch`
 */
export function useSimulateSmartWalletExecuteBatch(
  args: {
    targets: readonly `0x${string}`[];
    values: readonly bigint[];
    datas: readonly `0x${string}`[];
  },
  value?: bigint,
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'executeBatch',
    args: [args.targets, args.values, args.datas],
    value,
    ...config,
  });
}

/**
 * Write `SmartWallet.executeWithSignature`
 */
export function useWriteSmartWalletExecuteWithSignature() {
  const result = useWriteContract();

  const write = (
    args: {
      to: `0x${string}`;
      value: bigint;
      data: `0x${string}`;
      deadline: bigint;
      signature: `0x${string}`;
    },
    value?: bigint,
  ) =>
    result.writeContract({
      address: SMARTWALLET_ADDRESS,
      abi: SmartWalletAbi,
      functionName: 'executeWithSignature',
      args: [args.to, args.value, args.data, args.deadline, args.signature],
      value,
    });

  return { ...result, write };
}

/**
 * Simulate `SmartWallet.executeWithSignature`
 */
export function useSimulateSmartWalletExecuteWithSignature(
  args: {
    to: `0x${string}`;
    value: bigint;
    data: `0x${string}`;
    deadline: bigint;
    signature: `0x${string}`;
  },
  value?: bigint,
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'executeWithSignature',
    args: [args.to, args.value, args.data, args.deadline, args.signature],
    value,
    ...config,
  });
}

/**
 * Write `SmartWallet.initialize`
 */
export function useWriteSmartWalletInitialize() {
  const result = useWriteContract();

  const write = (args: {
    owner_: `0x${string}`;
    eventEmitter_: `0x${string}`;
    ssoRegistry_: `0x${string}`;
  }) =>
    result.writeContract({
      address: SMARTWALLET_ADDRESS,
      abi: SmartWalletAbi,
      functionName: 'initialize',
      args: [args.owner_, args.eventEmitter_, args.ssoRegistry_],
    });

  return { ...result, write };
}

/**
 * Simulate `SmartWallet.initialize`
 */
export function useSimulateSmartWalletInitialize(
  args: { owner_: `0x${string}`; eventEmitter_: `0x${string}`; ssoRegistry_: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'initialize',
    args: [args.owner_, args.eventEmitter_, args.ssoRegistry_],
    ...config,
  });
}

/**
 * Write `SmartWallet.pause`
 */
export function useWriteSmartWalletPause() {
  const result = useWriteContract();

  const write = () =>
    result.writeContract({
      address: SMARTWALLET_ADDRESS,
      abi: SmartWalletAbi,
      functionName: 'pause',
    });

  return { ...result, write };
}

/**
 * Simulate `SmartWallet.pause`
 */
export function useSimulateSmartWalletPause(config?: { chainId?: number }) {
  return useSimulateContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'pause',
    ...config,
  });
}

/**
 * Write `SmartWallet.setMetadata`
 */
export function useWriteSmartWalletSetMetadata() {
  const result = useWriteContract();

  const write = (args: {
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
  }) =>
    result.writeContract({
      address: SMARTWALLET_ADDRESS,
      abi: SmartWalletAbi,
      functionName: 'setMetadata',
      args: [args.metadata_],
    });

  return { ...result, write };
}

/**
 * Simulate `SmartWallet.setMetadata`
 */
export function useSimulateSmartWalletSetMetadata(
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
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'setMetadata',
    args: [args.metadata_],
    ...config,
  });
}

/**
 * Write `SmartWallet.transferOwnership`
 */
export function useWriteSmartWalletTransferOwnership() {
  const result = useWriteContract();

  const write = (args: { newOwner: `0x${string}` }) =>
    result.writeContract({
      address: SMARTWALLET_ADDRESS,
      abi: SmartWalletAbi,
      functionName: 'transferOwnership',
      args: [args.newOwner],
    });

  return { ...result, write };
}

/**
 * Simulate `SmartWallet.transferOwnership`
 */
export function useSimulateSmartWalletTransferOwnership(
  args: { newOwner: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
    ...config,
  });
}

/**
 * Write `SmartWallet.unpause`
 */
export function useWriteSmartWalletUnpause() {
  const result = useWriteContract();

  const write = () =>
    result.writeContract({
      address: SMARTWALLET_ADDRESS,
      abi: SmartWalletAbi,
      functionName: 'unpause',
    });

  return { ...result, write };
}

/**
 * Simulate `SmartWallet.unpause`
 */
export function useSimulateSmartWalletUnpause(config?: { chainId?: number }) {
  return useSimulateContract({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    functionName: 'unpause',
    ...config,
  });
}

/**
 * Watch `SmartWallet.BatchExecuted` event
 */
export function useWatchSmartWalletBatchExecuted(config: {
  onLogs: (
    logs: Array<{
      args: { count: bigint; startNonce: bigint };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    eventName: 'BatchExecuted',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SmartWallet.Executed` event
 */
export function useWatchSmartWalletExecuted(config: {
  onLogs: (
    logs: Array<{
      args: { to: `0x${string}`; value: bigint; nonce: bigint; success: boolean };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    eventName: 'Executed',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SmartWallet.MetadataUpdated` event
 */
export function useWatchSmartWalletMetadataUpdated(config: {
  onLogs: (
    logs: Array<{
      args: { argusId: string; onchainId: `0x${string}`; userAlias: string };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    eventName: 'MetadataUpdated',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SmartWallet.OwnerAssigned` event
 */
export function useWatchSmartWalletOwnerAssigned(config: {
  onLogs: (
    logs: Array<{
      args: { owner: `0x${string}` };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    eventName: 'OwnerAssigned',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SmartWallet.Paused` event
 */
export function useWatchSmartWalletPaused(config: {
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
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    eventName: 'Paused',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SmartWallet.Received` event
 */
export function useWatchSmartWalletReceived(config: {
  onLogs: (
    logs: Array<{
      args: { from: `0x${string}`; value: bigint };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    eventName: 'Received',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SmartWallet.SessionKeyAuthorized` event
 */
export function useWatchSmartWalletSessionKeyAuthorized(config: {
  onLogs: (
    logs: Array<{
      args: { signer: `0x${string}` };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    eventName: 'SessionKeyAuthorized',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SmartWallet.SessionKeyRevoked` event
 */
export function useWatchSmartWalletSessionKeyRevoked(config: {
  onLogs: (
    logs: Array<{
      args: { signer: `0x${string}` };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    eventName: 'SessionKeyRevoked',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SmartWallet.Unpaused` event
 */
export function useWatchSmartWalletUnpaused(config: {
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
    address: SMARTWALLET_ADDRESS,
    abi: SmartWalletAbi,
    eventName: 'Unpaused',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}
