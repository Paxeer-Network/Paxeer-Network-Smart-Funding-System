import {
  useReadContract,
  useWriteContract,
  useSimulateContract,
  useWatchContractEvent,
} from 'wagmi';
import { SSORegistryAbi } from '../abis/ssoregistry';
import { SSOREGISTRY_ADDRESS } from '../constants/addresses';

/**
 * Read `SSORegistry.MAX_KEYS_PER_WALLET`
 */
export function useReadSSORegistryMAXKEYSPERWALLET(config?: { chainId?: number }) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'MAX_KEYS_PER_WALLET',
    ...config,
  });
}

/**
 * Read `SSORegistry.MAX_SESSION_DURATION`
 */
export function useReadSSORegistryMAXSESSIONDURATION(config?: { chainId?: number }) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'MAX_SESSION_DURATION',
    ...config,
  });
}

/**
 * Read `SSORegistry.PERMISSION_ALL`
 */
export function useReadSSORegistryPERMISSIONALL(config?: { chainId?: number }) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_ALL',
    ...config,
  });
}

/**
 * Read `SSORegistry.PERMISSION_CALL_CONTRACT`
 */
export function useReadSSORegistryPERMISSIONCALLCONTRACT(config?: { chainId?: number }) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_CALL_CONTRACT',
    ...config,
  });
}

/**
 * Read `SSORegistry.PERMISSION_EXECUTE`
 */
export function useReadSSORegistryPERMISSIONEXECUTE(config?: { chainId?: number }) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_EXECUTE',
    ...config,
  });
}

/**
 * Read `SSORegistry.PERMISSION_EXECUTE_BATCH`
 */
export function useReadSSORegistryPERMISSIONEXECUTEBATCH(config?: { chainId?: number }) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_EXECUTE_BATCH',
    ...config,
  });
}

/**
 * Read `SSORegistry.PERMISSION_TRANSFER_ERC20`
 */
export function useReadSSORegistryPERMISSIONTRANSFERERC20(config?: { chainId?: number }) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_TRANSFER_ERC20',
    ...config,
  });
}

/**
 * Read `SSORegistry.PERMISSION_TRANSFER_ETH`
 */
export function useReadSSORegistryPERMISSIONTRANSFERETH(config?: { chainId?: number }) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_TRANSFER_ETH',
    ...config,
  });
}

/**
 * Read `SSORegistry.authorizedCallers`
 */
export function useReadSSORegistryAuthorizedCallers(
  args: { arg0: `0x${string}` },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'authorizedCallers',
    args: [args.arg0],
    ...config,
  });
}

/**
 * Read `SSORegistry.getActiveSigners`
 */
export function useReadSSORegistryGetActiveSigners(
  args: { wallet: `0x${string}` },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'getActiveSigners',
    args: [args.wallet],
    ...config,
  });
}

/**
 * Read `SSORegistry.getSessionKey`
 */
export function useReadSSORegistryGetSessionKey(
  args: { wallet: `0x${string}`; signer: `0x${string}` },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'getSessionKey',
    args: [args.wallet, args.signer],
    ...config,
  });
}

/**
 * Read `SSORegistry.owner`
 */
export function useReadSSORegistryOwner(config?: { chainId?: number }) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'owner',
    ...config,
  });
}

/**
 * Read `SSORegistry.validateSessionKey`
 */
export function useReadSSORegistryValidateSessionKey(
  args: { wallet: `0x${string}`; signer: `0x${string}`; requiredPermissions: bigint },
  config?: { chainId?: number },
) {
  return useReadContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'validateSessionKey',
    args: [args.wallet, args.signer, args.requiredPermissions],
    ...config,
  });
}

/**
 * Write `SSORegistry.registerSessionKey`
 */
export function useWriteSSORegistryRegisterSessionKey() {
  const result = useWriteContract();

  const write = (args: {
    signer: `0x${string}`;
    validAfter: bigint;
    validUntil: bigint;
    permissions: bigint;
  }) =>
    result.writeContract({
      address: SSOREGISTRY_ADDRESS,
      abi: SSORegistryAbi,
      functionName: 'registerSessionKey',
      args: [args.signer, args.validAfter, args.validUntil, args.permissions],
    });

  return { ...result, write };
}

/**
 * Simulate `SSORegistry.registerSessionKey`
 */
export function useSimulateSSORegistryRegisterSessionKey(
  args: { signer: `0x${string}`; validAfter: bigint; validUntil: bigint; permissions: bigint },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'registerSessionKey',
    args: [args.signer, args.validAfter, args.validUntil, args.permissions],
    ...config,
  });
}

/**
 * Write `SSORegistry.registerSessionKeyFor`
 */
export function useWriteSSORegistryRegisterSessionKeyFor() {
  const result = useWriteContract();

  const write = (args: {
    wallet: `0x${string}`;
    signer: `0x${string}`;
    validAfter: bigint;
    validUntil: bigint;
    permissions: bigint;
  }) =>
    result.writeContract({
      address: SSOREGISTRY_ADDRESS,
      abi: SSORegistryAbi,
      functionName: 'registerSessionKeyFor',
      args: [args.wallet, args.signer, args.validAfter, args.validUntil, args.permissions],
    });

  return { ...result, write };
}

/**
 * Simulate `SSORegistry.registerSessionKeyFor`
 */
export function useSimulateSSORegistryRegisterSessionKeyFor(
  args: {
    wallet: `0x${string}`;
    signer: `0x${string}`;
    validAfter: bigint;
    validUntil: bigint;
    permissions: bigint;
  },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'registerSessionKeyFor',
    args: [args.wallet, args.signer, args.validAfter, args.validUntil, args.permissions],
    ...config,
  });
}

/**
 * Write `SSORegistry.renounceOwnership`
 */
export function useWriteSSORegistryRenounceOwnership() {
  const result = useWriteContract();

  const write = () =>
    result.writeContract({
      address: SSOREGISTRY_ADDRESS,
      abi: SSORegistryAbi,
      functionName: 'renounceOwnership',
    });

  return { ...result, write };
}

/**
 * Simulate `SSORegistry.renounceOwnership`
 */
export function useSimulateSSORegistryRenounceOwnership(config?: { chainId?: number }) {
  return useSimulateContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'renounceOwnership',
    ...config,
  });
}

/**
 * Write `SSORegistry.revokeSessionKey`
 */
export function useWriteSSORegistryRevokeSessionKey() {
  const result = useWriteContract();

  const write = (args: { signer: `0x${string}` }) =>
    result.writeContract({
      address: SSOREGISTRY_ADDRESS,
      abi: SSORegistryAbi,
      functionName: 'revokeSessionKey',
      args: [args.signer],
    });

  return { ...result, write };
}

/**
 * Simulate `SSORegistry.revokeSessionKey`
 */
export function useSimulateSSORegistryRevokeSessionKey(
  args: { signer: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'revokeSessionKey',
    args: [args.signer],
    ...config,
  });
}

/**
 * Write `SSORegistry.revokeSessionKeyFor`
 */
export function useWriteSSORegistryRevokeSessionKeyFor() {
  const result = useWriteContract();

  const write = (args: { wallet: `0x${string}`; signer: `0x${string}` }) =>
    result.writeContract({
      address: SSOREGISTRY_ADDRESS,
      abi: SSORegistryAbi,
      functionName: 'revokeSessionKeyFor',
      args: [args.wallet, args.signer],
    });

  return { ...result, write };
}

/**
 * Simulate `SSORegistry.revokeSessionKeyFor`
 */
export function useSimulateSSORegistryRevokeSessionKeyFor(
  args: { wallet: `0x${string}`; signer: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'revokeSessionKeyFor',
    args: [args.wallet, args.signer],
    ...config,
  });
}

/**
 * Write `SSORegistry.setAuthorizedCaller`
 */
export function useWriteSSORegistrySetAuthorizedCaller() {
  const result = useWriteContract();

  const write = (args: { caller: `0x${string}`; authorized: boolean }) =>
    result.writeContract({
      address: SSOREGISTRY_ADDRESS,
      abi: SSORegistryAbi,
      functionName: 'setAuthorizedCaller',
      args: [args.caller, args.authorized],
    });

  return { ...result, write };
}

/**
 * Simulate `SSORegistry.setAuthorizedCaller`
 */
export function useSimulateSSORegistrySetAuthorizedCaller(
  args: { caller: `0x${string}`; authorized: boolean },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'setAuthorizedCaller',
    args: [args.caller, args.authorized],
    ...config,
  });
}

/**
 * Write `SSORegistry.transferOwnership`
 */
export function useWriteSSORegistryTransferOwnership() {
  const result = useWriteContract();

  const write = (args: { newOwner: `0x${string}` }) =>
    result.writeContract({
      address: SSOREGISTRY_ADDRESS,
      abi: SSORegistryAbi,
      functionName: 'transferOwnership',
      args: [args.newOwner],
    });

  return { ...result, write };
}

/**
 * Simulate `SSORegistry.transferOwnership`
 */
export function useSimulateSSORegistryTransferOwnership(
  args: { newOwner: `0x${string}` },
  config?: { chainId?: number },
) {
  return useSimulateContract({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
    ...config,
  });
}

/**
 * Watch `SSORegistry.OwnershipTransferred` event
 */
export function useWatchSSORegistryOwnershipTransferred(config: {
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
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    eventName: 'OwnershipTransferred',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SSORegistry.SessionKeyRegistered` event
 */
export function useWatchSSORegistrySessionKeyRegistered(config: {
  onLogs: (
    logs: Array<{
      args: {
        wallet: `0x${string}`;
        signer: `0x${string}`;
        validAfter: bigint;
        validUntil: bigint;
        permissions: bigint;
      };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    eventName: 'SessionKeyRegistered',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SSORegistry.SessionKeyRevoked` event
 */
export function useWatchSSORegistrySessionKeyRevoked(config: {
  onLogs: (
    logs: Array<{
      args: { wallet: `0x${string}`; signer: `0x${string}` };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    eventName: 'SessionKeyRevoked',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}

/**
 * Watch `SSORegistry.SessionKeyUpdated` event
 */
export function useWatchSSORegistrySessionKeyUpdated(config: {
  onLogs: (
    logs: Array<{
      args: {
        wallet: `0x${string}`;
        signer: `0x${string}`;
        validUntil: bigint;
        permissions: bigint;
      };
      blockNumber: bigint;
      transactionHash: `0x${string}`;
    }>,
  ) => void;
  chainId?: number;
  enabled?: boolean;
}) {
  return useWatchContractEvent({
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    eventName: 'SessionKeyUpdated',
    onLogs: config.onLogs as any,
    chainId: config.chainId,
    enabled: config.enabled,
  });
}
