// ── Permission Bitmask Utilities ─────────────────────────────────────────────

import type { PermissionFlag } from './types';

/** On-chain permission constants matching SSORegistry.sol */
export const PERMISSIONS = {
  EXECUTE: 1 << 0,         // 1
  EXECUTE_BATCH: 1 << 1,   // 2
  TRANSFER_ETH: 1 << 2,    // 4
  TRANSFER_ERC20: 1 << 3,  // 8
  CALL_CONTRACT: 1 << 4,   // 16
  ALL: (1 << 5) - 1,       // 31
} as const;

/** Max session duration: 30 days in seconds (matches SSORegistry) */
export const MAX_SESSION_DURATION = 30 * 24 * 60 * 60; // 2_592_000

/** Max session keys per wallet */
export const MAX_KEYS_PER_WALLET = 10;

/** Default session duration: 24 hours */
export const DEFAULT_SESSION_DURATION = 24 * 60 * 60; // 86_400

/**
 * Converts an array of human-readable permission flags to a bitmask.
 */
export function permissionsToBitmask(flags: PermissionFlag[]): number {
  let mask = 0;
  for (const flag of flags) {
    const bit = PERMISSIONS[flag];
    if (bit === undefined) {
      throw new Error(`Unknown permission flag: ${flag}`);
    }
    mask |= bit;
  }
  return mask;
}

/**
 * Converts a bitmask back to an array of permission flags.
 */
export function bitmaskToPermissions(mask: number): PermissionFlag[] {
  const flags: PermissionFlag[] = [];
  const entries: [PermissionFlag, number][] = [
    ['EXECUTE', PERMISSIONS.EXECUTE],
    ['EXECUTE_BATCH', PERMISSIONS.EXECUTE_BATCH],
    ['TRANSFER_ETH', PERMISSIONS.TRANSFER_ETH],
    ['TRANSFER_ERC20', PERMISSIONS.TRANSFER_ERC20],
    ['CALL_CONTRACT', PERMISSIONS.CALL_CONTRACT],
  ];
  for (const [flag, bit] of entries) {
    if ((mask & bit) === bit) {
      flags.push(flag);
    }
  }
  return flags;
}

/**
 * Checks whether a bitmask satisfies all required permissions.
 */
export function hasPermissions(actual: number, required: number): boolean {
  return (actual & required) === required;
}
