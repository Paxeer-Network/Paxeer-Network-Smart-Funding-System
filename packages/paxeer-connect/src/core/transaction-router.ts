// ── Transaction Router ───────────────────────────────────────────────────────
//
// Routes transactions through the SmartWallet contract.
// - If a session key is active → uses executeWithSignature (no MetaMask popup)
// - If no session key → falls back to direct execute via the EOA provider
// - Supports single execute and batch executeBatch

import {
  createWalletClient,
  custom,
  encodeFunctionData,
  type WalletClient,
} from 'viem';
import { SmartWalletAbi } from '../abis/smart-wallet';
import { paxeerChain, WalletAdapter } from './wallet-adapter';
import { SessionManager } from './session-manager';
import {
  WalletNotConnectedError,
  TransactionFailedError,
} from './errors';
import type {
  Address,
  Hex,
  EIP1193Provider,
  TxRequest,
  TxResult,
} from './types';

export class TransactionRouter {
  private _walletAdapter: WalletAdapter;
  private _sessionManager: SessionManager;

  constructor(walletAdapter: WalletAdapter, sessionManager: SessionManager) {
    this._walletAdapter = walletAdapter;
    this._sessionManager = sessionManager;
  }

  /**
   * Executes a single transaction through the SmartWallet.
   *
   * If a session key is active, uses executeWithSignature (popup-free).
   * Otherwise, sends execute() directly from the EOA via MetaMask.
   */
  async execute(
    provider: EIP1193Provider,
    owner: Address,
    smartWallet: Address,
    tx: TxRequest,
  ): Promise<TxResult> {
    const to = tx.to;
    const value = tx.value ?? 0n;
    const data = (tx.data ?? '0x') as Hex;

    if (this._sessionManager.isActive) {
      return this._executeWithSession(provider, owner, smartWallet, to, value, data);
    }

    return this._executeDirect(provider, owner, smartWallet, to, value, data);
  }

  /**
   * Executes a batch of transactions atomically through SmartWallet.executeBatch().
   *
   * Batch execution always goes through the EOA directly (executeBatch doesn't
   * have a signature variant). If a session key is active with EXECUTE_BATCH
   * permission, it can call executeBatch directly.
   */
  async executeBatch(
    provider: EIP1193Provider,
    owner: Address,
    smartWallet: Address,
    txs: TxRequest[],
  ): Promise<TxResult[]> {
    const targets = txs.map((tx) => tx.to);
    const values = txs.map((tx) => tx.value ?? 0n);
    const datas = txs.map((tx) => (tx.data ?? '0x') as Hex);

    const calldata = encodeFunctionData({
      abi: SmartWalletAbi,
      functionName: 'executeBatch',
      args: [targets, values, datas],
    });

    const totalValue = values.reduce((sum, v) => sum + v, 0n);

    const walletClient = createWalletClient({
      chain: paxeerChain,
      transport: custom(provider),
    });

    const hash = await walletClient.sendTransaction({
      account: owner,
      to: smartWallet,
      data: calldata,
      value: totalValue,
    });

    // Fetch updated nonce
    const nonce = await this._walletAdapter.getNonce(smartWallet);

    // Return one result per tx in the batch
    return txs.map((tx, i) => ({
      hash: hash as Hex,
      nonce: nonce - BigInt(txs.length) + BigInt(i),
      success: true,
      returnData: '0x' as Hex,
    }));
  }

  // ── Private ────────────────────────────────────────────────────────────────

  /**
   * Sends executeWithSignature using the ephemeral session key.
   * NO MetaMask popup — the session key signs the EIP-712 digest.
   */
  private async _executeWithSession(
    provider: EIP1193Provider,
    owner: Address,
    smartWallet: Address,
    to: Address,
    value: bigint,
    data: Hex,
  ): Promise<TxResult> {
    // 1. Get current nonce and domain separator
    const [nonce, domainSeparator] = await Promise.all([
      this._walletAdapter.getNonce(smartWallet),
      this._walletAdapter.getDomainSeparator(smartWallet),
    ]);

    // 2. Set deadline to 5 minutes from now
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 300);

    // 3. Sign the EIP-712 digest with the session key
    const signature = await this._sessionManager.signExecuteDigestAsync({
      domainSeparator,
      to,
      value,
      data,
      nonce,
      deadline,
    });

    // 4. Build the executeWithSignature calldata
    const calldata = encodeFunctionData({
      abi: SmartWalletAbi,
      functionName: 'executeWithSignature',
      args: [to, value, data, deadline, signature],
    });

    // 5. Send via the EOA provider (the session key signer is embedded in the sig,
    //    but the actual tx sender can be anyone — this is a meta-tx pattern)
    const walletClient = createWalletClient({
      chain: paxeerChain,
      transport: custom(provider),
    });

    const hash = await walletClient.sendTransaction({
      account: owner,
      to: smartWallet,
      data: calldata,
      value,
    });

    return {
      hash: hash as Hex,
      nonce,
      success: true,
      returnData: '0x' as Hex,
    };
  }

  /**
   * Falls back to direct SmartWallet.execute() — requires MetaMask approval.
   * Used when no session key is available.
   */
  private async _executeDirect(
    provider: EIP1193Provider,
    owner: Address,
    smartWallet: Address,
    to: Address,
    value: bigint,
    data: Hex,
  ): Promise<TxResult> {
    const calldata = encodeFunctionData({
      abi: SmartWalletAbi,
      functionName: 'execute',
      args: [to, value, data],
    });

    const walletClient = createWalletClient({
      chain: paxeerChain,
      transport: custom(provider),
    });

    const hash = await walletClient.sendTransaction({
      account: owner,
      to: smartWallet,
      data: calldata,
      value,
    });

    const nonce = await this._walletAdapter.getNonce(smartWallet);

    return {
      hash: hash as Hex,
      nonce: nonce - 1n,
      success: true,
      returnData: '0x' as Hex,
    };
  }
}
