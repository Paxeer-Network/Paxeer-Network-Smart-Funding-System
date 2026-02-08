// ── EIP-712 Signing Helpers ──────────────────────────────────────────────────
//
// Builds EIP-712 typed data for SmartWallet.executeWithSignature().
// Matches the on-chain EXECUTE_TYPEHASH and DOMAIN_TYPEHASH exactly.

import {
  encodeAbiParameters,
  keccak256,
  concat,
  toBytes,
  toHex,
  type Hex,
} from 'viem';
import type { Address } from './types';

/** EIP-712 domain typehash — must match SmartWallet.DOMAIN_TYPEHASH */
const DOMAIN_TYPEHASH = keccak256(
  toBytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
);

/** Execute typehash — must match SmartWallet.EXECUTE_TYPEHASH */
const EXECUTE_TYPEHASH = keccak256(
  toBytes('Execute(address to,uint256 value,bytes data,uint256 nonce,uint256 deadline)'),
);

/**
 * Computes the EIP-712 domain separator for a SmartWallet.
 * This should match the on-chain _domainSeparator computed at initialization.
 */
export function computeDomainSeparator(
  smartWallet: Address,
  chainId: number,
): Hex {
  return keccak256(
    encodeAbiParameters(
      [
        { type: 'bytes32' },
        { type: 'bytes32' },
        { type: 'bytes32' },
        { type: 'uint256' },
        { type: 'address' },
      ],
      [
        DOMAIN_TYPEHASH,
        keccak256(toBytes('PaxeerSmartWallet')),
        keccak256(toBytes('1')),
        BigInt(chainId),
        smartWallet,
      ],
    ),
  );
}

/**
 * Builds the EIP-712 struct hash for an execute meta-transaction.
 */
export function buildExecuteStructHash(params: {
  to: Address;
  value: bigint;
  data: Hex;
  nonce: bigint;
  deadline: bigint;
}): Hex {
  return keccak256(
    encodeAbiParameters(
      [
        { type: 'bytes32' },
        { type: 'address' },
        { type: 'uint256' },
        { type: 'bytes32' },
        { type: 'uint256' },
        { type: 'uint256' },
      ],
      [
        EXECUTE_TYPEHASH,
        params.to,
        params.value,
        keccak256(params.data),
        params.nonce,
        params.deadline,
      ],
    ),
  );
}

/**
 * Builds the full EIP-712 digest that the session key must sign.
 * digest = keccak256("\x19\x01" || domainSeparator || structHash)
 */
export function buildExecuteDigest(
  domainSeparator: Hex,
  structHash: Hex,
): Hex {
  return keccak256(
    concat([toHex(new Uint8Array([0x19, 0x01])), domainSeparator, structHash]),
  );
}
