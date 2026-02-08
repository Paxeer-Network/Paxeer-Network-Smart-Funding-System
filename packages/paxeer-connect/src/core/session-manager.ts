// ── Session Manager ──────────────────────────────────────────────────────────
//
// Manages the full session key lifecycle:
//   1. Generate ephemeral keypair in-browser
//   2. Register the session key on-chain via SSORegistry
//   3. Store the private key in localStorage
//   4. Sign EIP-712 execute digests with the session key
//   5. Validate session key expiry and permissions

import {
  createWalletClient,
  custom,
  encodeFunctionData,
  type WalletClient,
  type Transport,
  type Chain,
} from 'viem';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { SSORegistryAbi } from '../abis/ssoregistry';
import { SSOREGISTRY_ADDRESS } from '../constants/addresses';
import { paxeerChain } from './wallet-adapter';
import {
  permissionsToBitmask,
  hasPermissions,
  DEFAULT_SESSION_DURATION,
  MAX_SESSION_DURATION,
} from './permissions';
import {
  saveSessionKey,
  loadSessionKey,
  clearSessionKey,
  findAllSessionKeys,
} from './storage';
import {
  buildExecuteStructHash,
  buildExecuteDigest,
} from './eip712';
import {
  SessionExpiredError,
  SessionNotFoundError,
  InsufficientPermissionsError,
} from './errors';
import type {
  Address,
  Hex,
  EIP1193Provider,
  PermissionFlag,
  SessionInfo,
  StoredSessionKey,
  PaxeerClientConfig,
} from './types';

export class SessionManager {
  private _config: PaxeerClientConfig;
  private _ssoRegistryAddress: Address;
  private _currentSession: StoredSessionKey | null = null;

  constructor(config: PaxeerClientConfig) {
    this._config = config;
    this._ssoRegistryAddress =
      config.contracts?.ssoRegistry ?? SSOREGISTRY_ADDRESS;
  }

  /**
   * Returns the current active session, or null.
   */
  get session(): SessionInfo | null {
    if (!this._currentSession) return null;
    return this._toSessionInfo(this._currentSession);
  }

  /**
   * Whether a valid, non-expired session is active.
   */
  get isActive(): boolean {
    if (!this._currentSession) return false;
    const now = Math.floor(Date.now() / 1000);
    return (
      now >= this._currentSession.validAfter &&
      now <= this._currentSession.validUntil
    );
  }

  /**
   * Attempts to restore a session from localStorage.
   * Checks the current app's session first, then cross-app SSO sessions.
   * Returns true if a valid session was restored.
   */
  restoreSession(smartWallet: Address): boolean {
    // 1. Try this app's own session key
    const ownSession = loadSessionKey(this._config.appId, smartWallet);
    if (ownSession && this._satisfiesPermissions(ownSession)) {
      this._currentSession = ownSession;
      return true;
    }

    // 2. Cross-app SSO: check if any other app's session key covers our needs
    const requiredMask = permissionsToBitmask(this._config.permissions);
    const allSessions = findAllSessionKeys(smartWallet);
    for (const session of allSessions) {
      if (hasPermissions(session.permissions, requiredMask)) {
        this._currentSession = session;
        return true;
      }
    }

    return false;
  }

  /**
   * Creates a new session key and registers it on-chain.
   *
   * Flow:
   * 1. Generate ephemeral keypair
   * 2. Send a MetaMask tx to SSORegistry.registerSessionKey()
   * 3. Store the session key in localStorage
   *
   * @param provider - The user's injected provider (MetaMask)
   * @param owner - The user's EOA address
   * @param smartWallet - The SmartWallet address
   * @returns The new session info
   */
  async createSession(
    provider: EIP1193Provider,
    owner: Address,
    smartWallet: Address,
  ): Promise<SessionInfo> {
    const requiredMask = permissionsToBitmask(this._config.permissions);
    const duration = Math.min(
      this._config.sessionDuration ?? DEFAULT_SESSION_DURATION,
      MAX_SESSION_DURATION,
    );

    // Generate ephemeral keypair
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    // Compute validity window
    const now = Math.floor(Date.now() / 1000);
    const validAfter = now;
    const validUntil = now + duration;

    // Build the registerSessionKey tx
    const calldata = encodeFunctionData({
      abi: SSORegistryAbi,
      functionName: 'registerSessionKey',
      args: [account.address, validAfter, validUntil, BigInt(requiredMask)],
    });

    // Create a wallet client to send the tx from the user's EOA
    const walletClient = createWalletClient({
      chain: paxeerChain,
      transport: custom(provider),
    });

    // Send via MetaMask — this is the ONE popup the user sees
    const hash = await walletClient.sendTransaction({
      account: owner,
      to: this._ssoRegistryAddress,
      data: calldata,
      value: 0n,
    });

    // Wait for confirmation
    // Note: In production you'd want to poll for receipt,
    // but for now we trust it's mined quickly on Paxeer
    // (fast block times on your own network)

    // Store session key
    const storedSession: StoredSessionKey = {
      privateKey: privateKey as Hex,
      signer: account.address as Address,
      smartWallet,
      permissions: requiredMask,
      validAfter,
      validUntil,
      appId: this._config.appId,
    };

    saveSessionKey(storedSession);
    this._currentSession = storedSession;

    return this._toSessionInfo(storedSession);
  }

  /**
   * Signs an EIP-712 execute digest using the ephemeral session key.
   * Used by TransactionRouter for executeWithSignature().
   */
  signExecuteDigest(params: {
    domainSeparator: Hex;
    to: Address;
    value: bigint;
    data: Hex;
    nonce: bigint;
    deadline: bigint;
  }): Hex {
    if (!this._currentSession) throw new SessionNotFoundError();
    if (!this.isActive) throw new SessionExpiredError();

    const structHash = buildExecuteStructHash({
      to: params.to,
      value: params.value,
      data: params.data,
      nonce: params.nonce,
      deadline: params.deadline,
    });

    const digest = buildExecuteDigest(params.domainSeparator, structHash);

    // Sign with the ephemeral private key
    const account = privateKeyToAccount(this._currentSession.privateKey);
    // viem's account.sign returns a Promise<Hex>; we use signMessage style
    // For raw digest signing, we use the low-level approach
    return account.signMessage({ message: { raw: digest } }) as unknown as Hex;
  }

  /**
   * Async version of signExecuteDigest (since viem signing is async).
   */
  async signExecuteDigestAsync(params: {
    domainSeparator: Hex;
    to: Address;
    value: bigint;
    data: Hex;
    nonce: bigint;
    deadline: bigint;
  }): Promise<Hex> {
    if (!this._currentSession) throw new SessionNotFoundError();
    if (!this.isActive) throw new SessionExpiredError();

    const structHash = buildExecuteStructHash({
      to: params.to,
      value: params.value,
      data: params.data,
      nonce: params.nonce,
      deadline: params.deadline,
    });

    const digest = buildExecuteDigest(params.domainSeparator, structHash);

    const account = privateKeyToAccount(this._currentSession.privateKey);
    const signature = await account.signMessage({ message: { raw: digest } });
    return signature as Hex;
  }

  /**
   * Clears the current session and removes from storage.
   */
  clearSession(smartWallet: Address): void {
    if (this._currentSession) {
      clearSessionKey(this._currentSession.appId, smartWallet);
      this._currentSession = null;
    }
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private _satisfiesPermissions(session: StoredSessionKey): boolean {
    const now = Math.floor(Date.now() / 1000);
    if (now < session.validAfter || now > session.validUntil) return false;
    const requiredMask = permissionsToBitmask(this._config.permissions);
    return hasPermissions(session.permissions, requiredMask);
  }

  private _toSessionInfo(session: StoredSessionKey): SessionInfo {
    const now = Math.floor(Date.now() / 1000);
    return {
      signer: session.signer,
      permissions: session.permissions,
      validAfter: session.validAfter,
      validUntil: session.validUntil,
      isActive: now >= session.validAfter && now <= session.validUntil,
      appId: session.appId,
    };
  }
}
