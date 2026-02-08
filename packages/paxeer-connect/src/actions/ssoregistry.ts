import { readContract, writeContract, simulateContract, getPublicClient } from 'wagmi/actions';
import type { Config } from 'wagmi';
import { SSORegistryAbi } from '../abis/ssoregistry';
import { SSOREGISTRY_ADDRESS } from '../constants/addresses';

/**
 * Read `SSORegistry.MAX_KEYS_PER_WALLET`
 */
export async function readSSORegistryMAXKEYSPERWALLET(config: Config, chainId?: number) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'MAX_KEYS_PER_WALLET',
    chainId,
  });
}

/**
 * Read `SSORegistry.MAX_SESSION_DURATION`
 */
export async function readSSORegistryMAXSESSIONDURATION(config: Config, chainId?: number) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'MAX_SESSION_DURATION',
    chainId,
  });
}

/**
 * Read `SSORegistry.PERMISSION_ALL`
 */
export async function readSSORegistryPERMISSIONALL(config: Config, chainId?: number) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_ALL',
    chainId,
  });
}

/**
 * Read `SSORegistry.PERMISSION_CALL_CONTRACT`
 */
export async function readSSORegistryPERMISSIONCALLCONTRACT(config: Config, chainId?: number) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_CALL_CONTRACT',
    chainId,
  });
}

/**
 * Read `SSORegistry.PERMISSION_EXECUTE`
 */
export async function readSSORegistryPERMISSIONEXECUTE(config: Config, chainId?: number) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_EXECUTE',
    chainId,
  });
}

/**
 * Read `SSORegistry.PERMISSION_EXECUTE_BATCH`
 */
export async function readSSORegistryPERMISSIONEXECUTEBATCH(config: Config, chainId?: number) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_EXECUTE_BATCH',
    chainId,
  });
}

/**
 * Read `SSORegistry.PERMISSION_TRANSFER_ERC20`
 */
export async function readSSORegistryPERMISSIONTRANSFERERC20(config: Config, chainId?: number) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_TRANSFER_ERC20',
    chainId,
  });
}

/**
 * Read `SSORegistry.PERMISSION_TRANSFER_ETH`
 */
export async function readSSORegistryPERMISSIONTRANSFERETH(config: Config, chainId?: number) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'PERMISSION_TRANSFER_ETH',
    chainId,
  });
}

/**
 * Read `SSORegistry.authorizedCallers`
 */
export async function readSSORegistryAuthorizedCallers(
  config: Config,
  args: { arg0: `0x${string}` },
  chainId?: number,
) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'authorizedCallers',
    args: [args.arg0],
    chainId,
  });
}

/**
 * Read `SSORegistry.getActiveSigners`
 */
export async function readSSORegistryGetActiveSigners(
  config: Config,
  args: { wallet: `0x${string}` },
  chainId?: number,
) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'getActiveSigners',
    args: [args.wallet],
    chainId,
  });
}

/**
 * Read `SSORegistry.getSessionKey`
 */
export async function readSSORegistryGetSessionKey(
  config: Config,
  args: { wallet: `0x${string}`; signer: `0x${string}` },
  chainId?: number,
) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'getSessionKey',
    args: [args.wallet, args.signer],
    chainId,
  });
}

/**
 * Read `SSORegistry.owner`
 */
export async function readSSORegistryOwner(config: Config, chainId?: number) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'owner',
    chainId,
  });
}

/**
 * Read `SSORegistry.validateSessionKey`
 */
export async function readSSORegistryValidateSessionKey(
  config: Config,
  args: { wallet: `0x${string}`; signer: `0x${string}`; requiredPermissions: bigint },
  chainId?: number,
) {
  return readContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'validateSessionKey',
    args: [args.wallet, args.signer, args.requiredPermissions],
    chainId,
  });
}

/**
 * Write `SSORegistry.registerSessionKey`
 */
export async function writeSSORegistryRegisterSessionKey(
  config: Config,
  args: { signer: `0x${string}`; validAfter: number; validUntil: number; permissions: bigint },
) {
  return writeContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'registerSessionKey',
    args: [args.signer, args.validAfter, args.validUntil, args.permissions],
  });
}

/**
 * Simulate `SSORegistry.registerSessionKey`
 */
export async function simulateSSORegistryRegisterSessionKey(
  config: Config,
  args: { signer: `0x${string}`; validAfter: number; validUntil: number; permissions: bigint },
) {
  return simulateContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'registerSessionKey',
    args: [args.signer, args.validAfter, args.validUntil, args.permissions],
  });
}

/**
 * Write `SSORegistry.registerSessionKeyFor`
 */
export async function writeSSORegistryRegisterSessionKeyFor(
  config: Config,
  args: {
    wallet: `0x${string}`;
    signer: `0x${string}`;
    validAfter: number;
    validUntil: number;
    permissions: bigint;
  },
) {
  return writeContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'registerSessionKeyFor',
    args: [args.wallet, args.signer, args.validAfter, args.validUntil, args.permissions],
  });
}

/**
 * Simulate `SSORegistry.registerSessionKeyFor`
 */
export async function simulateSSORegistryRegisterSessionKeyFor(
  config: Config,
  args: {
    wallet: `0x${string}`;
    signer: `0x${string}`;
    validAfter: number;
    validUntil: number;
    permissions: bigint;
  },
) {
  return simulateContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'registerSessionKeyFor',
    args: [args.wallet, args.signer, args.validAfter, args.validUntil, args.permissions],
  });
}

/**
 * Write `SSORegistry.renounceOwnership`
 */
export async function writeSSORegistryRenounceOwnership(config: Config) {
  return writeContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'renounceOwnership',
  });
}

/**
 * Simulate `SSORegistry.renounceOwnership`
 */
export async function simulateSSORegistryRenounceOwnership(config: Config) {
  return simulateContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'renounceOwnership',
  });
}

/**
 * Write `SSORegistry.revokeSessionKey`
 */
export async function writeSSORegistryRevokeSessionKey(
  config: Config,
  args: { signer: `0x${string}` },
) {
  return writeContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'revokeSessionKey',
    args: [args.signer],
  });
}

/**
 * Simulate `SSORegistry.revokeSessionKey`
 */
export async function simulateSSORegistryRevokeSessionKey(
  config: Config,
  args: { signer: `0x${string}` },
) {
  return simulateContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'revokeSessionKey',
    args: [args.signer],
  });
}

/**
 * Write `SSORegistry.revokeSessionKeyFor`
 */
export async function writeSSORegistryRevokeSessionKeyFor(
  config: Config,
  args: { wallet: `0x${string}`; signer: `0x${string}` },
) {
  return writeContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'revokeSessionKeyFor',
    args: [args.wallet, args.signer],
  });
}

/**
 * Simulate `SSORegistry.revokeSessionKeyFor`
 */
export async function simulateSSORegistryRevokeSessionKeyFor(
  config: Config,
  args: { wallet: `0x${string}`; signer: `0x${string}` },
) {
  return simulateContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'revokeSessionKeyFor',
    args: [args.wallet, args.signer],
  });
}

/**
 * Write `SSORegistry.setAuthorizedCaller`
 */
export async function writeSSORegistrySetAuthorizedCaller(
  config: Config,
  args: { caller: `0x${string}`; authorized: boolean },
) {
  return writeContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'setAuthorizedCaller',
    args: [args.caller, args.authorized],
  });
}

/**
 * Simulate `SSORegistry.setAuthorizedCaller`
 */
export async function simulateSSORegistrySetAuthorizedCaller(
  config: Config,
  args: { caller: `0x${string}`; authorized: boolean },
) {
  return simulateContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'setAuthorizedCaller',
    args: [args.caller, args.authorized],
  });
}

/**
 * Write `SSORegistry.transferOwnership`
 */
export async function writeSSORegistryTransferOwnership(
  config: Config,
  args: { newOwner: `0x${string}` },
) {
  return writeContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
  });
}

/**
 * Simulate `SSORegistry.transferOwnership`
 */
export async function simulateSSORegistryTransferOwnership(
  config: Config,
  args: { newOwner: `0x${string}` },
) {
  return simulateContract(config, {
    address: SSOREGISTRY_ADDRESS,
    abi: SSORegistryAbi,
    functionName: 'transferOwnership',
    args: [args.newOwner],
  });
}
