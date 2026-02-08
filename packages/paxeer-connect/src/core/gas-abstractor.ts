// ── Gas Abstractor ───────────────────────────────────────────────────────────
//
// Handles gas-related concerns for Paxeer's funded-user model.
// SmartWallets are pre-funded with native tokens by the service workers.
// This module checks funding status and provides helpers for gas estimation.

import { WalletAdapter } from './wallet-adapter';
import { InsufficientBalanceError } from './errors';
import type { Address } from './types';

/** Minimum balance threshold (0.01 native token) below which a top-up warning fires */
const LOW_BALANCE_THRESHOLD = 10_000_000_000_000_000n; // 0.01 ether

export interface GasStatus {
  /** Current native balance in the SmartWallet */
  balance: bigint;
  /** Whether balance is sufficient for typical operations */
  sufficient: boolean;
  /** Whether balance is critically low */
  low: boolean;
}

export class GasAbstractor {
  private _walletAdapter: WalletAdapter;

  constructor(walletAdapter: WalletAdapter) {
    this._walletAdapter = walletAdapter;
  }

  /**
   * Checks the gas funding status of a SmartWallet.
   */
  async checkFunding(smartWallet: Address): Promise<GasStatus> {
    const balance = await this._walletAdapter.getNativeBalance(smartWallet);
    return {
      balance,
      sufficient: balance > LOW_BALANCE_THRESHOLD,
      low: balance <= LOW_BALANCE_THRESHOLD && balance > 0n,
    };
  }

  /**
   * Asserts that the SmartWallet has sufficient balance for a given value transfer.
   * Throws InsufficientBalanceError if not.
   */
  async assertSufficientBalance(
    smartWallet: Address,
    requiredValue: bigint,
  ): Promise<void> {
    const balance = await this._walletAdapter.getNativeBalance(smartWallet);
    // Account for gas overhead (~100k gas * typical gas price)
    const gasBuffer = 100_000n * 1_000_000_000n; // 0.0001 ether buffer
    const totalRequired = requiredValue + gasBuffer;

    if (balance < totalRequired) {
      throw new InsufficientBalanceError(totalRequired, balance);
    }
  }

  /**
   * Estimates the gas cost for an execute call.
   * Uses the public client to estimate gas.
   */
  async estimateGas(
    smartWallet: Address,
    to: Address,
    data: `0x${string}`,
    value: bigint = 0n,
  ): Promise<bigint> {
    try {
      const gasEstimate = await this._walletAdapter.publicClient.estimateGas({
        account: smartWallet,
        to,
        data,
        value,
      });
      return gasEstimate;
    } catch {
      // Fallback: return a generous default estimate
      return 200_000n;
    }
  }
}
