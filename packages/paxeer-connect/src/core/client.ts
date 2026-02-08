// ── Paxeer Client ────────────────────────────────────────────────────────────
//
// The main entry point for the Paxeer Connect SDK.
// Protocol developers instantiate one PaxeerClient per app.
// It orchestrates wallet resolution, session key management,
// transaction routing, and gas abstraction.

import { WalletAdapter } from './wallet-adapter';
import { SessionManager } from './session-manager';
import { TransactionRouter } from './transaction-router';
import { GasAbstractor, type GasStatus } from './gas-abstractor';
import {
  WalletNotConnectedError,
  ChainMismatchError,
  ProviderError,
} from './errors';
import { PAXEER_NETWORK_CHAIN } from '../constants/chains';
import type {
  Address,
  Hex,
  PaxeerClientConfig,
  PaxeerWallet,
  TxRequest,
  TxResult,
  SessionInfo,
  EIP1193Provider,
  PaxeerEvent,
  PaxeerEventMap,
} from './types';

export class PaxeerClient {
  private _config: PaxeerClientConfig;
  private _walletAdapter: WalletAdapter;
  private _sessionManager: SessionManager;
  private _txRouter: TransactionRouter;
  private _gasAbstractor: GasAbstractor;

  private _provider: EIP1193Provider | null = null;
  private _wallet: PaxeerWallet | null = null;
  private _listeners: Map<PaxeerEvent, Set<(data: any) => void>> = new Map();

  constructor(config: PaxeerClientConfig) {
    this._config = config;
    this._walletAdapter = new WalletAdapter(
      config.rpcUrl,
      config.contracts?.walletFactory,
    );
    this._sessionManager = new SessionManager(config);
    this._txRouter = new TransactionRouter(
      this._walletAdapter,
      this._sessionManager,
    );
    this._gasAbstractor = new GasAbstractor(this._walletAdapter);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Connection
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Connects to the user's wallet.
   *
   * Full flow:
   * 1. Requests accounts from the injected provider (MetaMask popup)
   * 2. Validates chain ID (must be Paxeer Network, chainId 125)
   * 3. Resolves EOA → SmartWallet via WalletFactory
   * 4. Attempts to restore an existing session key from localStorage
   * 5. If no valid session exists, registers a new session key on-chain
   *    (ONE MetaMask tx — the only popup the user sees after connecting)
   * 6. Returns the connected PaxeerWallet
   */
  async connect(provider: EIP1193Provider): Promise<PaxeerWallet> {
    this._provider = provider;

    // 1. Get accounts
    const accounts = (await provider.request({
      method: 'eth_requestAccounts',
    })) as Address[];

    if (!accounts.length) {
      throw new ProviderError('No accounts returned by provider');
    }
    const owner = accounts[0];

    // 2. Validate chain
    const chainIdHex = (await provider.request({
      method: 'eth_chainId',
    })) as string;
    const chainId = parseInt(chainIdHex, 16);
    if (chainId !== PAXEER_NETWORK_CHAIN.id) {
      throw new ChainMismatchError(PAXEER_NETWORK_CHAIN.id, chainId);
    }

    // 3. Resolve SmartWallet
    const smartWallet = await this._walletAdapter.resolveSmartWallet(owner);

    // 4. Fetch wallet state
    this._wallet = await this._walletAdapter.getWalletState(owner, smartWallet);

    // 5. Try restoring session from localStorage
    const restored = this._sessionManager.restoreSession(smartWallet);

    if (!restored) {
      // 6. No valid session — create new one (one MetaMask tx)
      const session = await this._sessionManager.createSession(
        provider,
        owner,
        smartWallet,
      );
      this._emit('sessionCreated', session);
    }

    // Listen for account/chain changes
    this._setupProviderListeners(provider);

    this._emit('connected', this._wallet);
    return this._wallet;
  }

  /**
   * Disconnects the current wallet and clears the session.
   */
  disconnect(): void {
    if (this._wallet) {
      this._sessionManager.clearSession(this._wallet.smartWallet);
    }
    this._wallet = null;
    this._provider = null;
    this._emit('disconnected', undefined);
  }

  /**
   * Whether a wallet is currently connected.
   */
  isConnected(): boolean {
    return this._wallet !== null && this._wallet.isConnected;
  }

  /**
   * Returns the current wallet state, or null if not connected.
   */
  getWallet(): PaxeerWallet | null {
    return this._wallet;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Transactions
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Executes a single transaction through the SmartWallet.
   * If a session key is active → popup-free (meta-tx via executeWithSignature).
   * Otherwise → direct execute via MetaMask.
   */
  async execute(tx: TxRequest): Promise<TxResult> {
    this._assertConnected();
    const result = await this._txRouter.execute(
      this._provider!,
      this._wallet!.owner,
      this._wallet!.smartWallet,
      tx,
    );
    this._emit('txSubmitted', result);
    return result;
  }

  /**
   * Executes a batch of transactions atomically through SmartWallet.executeBatch().
   * All transactions succeed or all revert.
   */
  async executeBatch(txs: TxRequest[]): Promise<TxResult[]> {
    this._assertConnected();
    const results = await this._txRouter.executeBatch(
      this._provider!,
      this._wallet!.owner,
      this._wallet!.smartWallet,
      txs,
    );
    for (const result of results) {
      this._emit('txSubmitted', result);
    }
    return results;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Read Operations
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Fetches native token balance of the SmartWallet.
   */
  async getBalance(): Promise<bigint> {
    this._assertConnected();
    return this._walletAdapter.getNativeBalance(this._wallet!.smartWallet);
  }

  /**
   * Fetches ERC-20 token balance of the SmartWallet.
   */
  async getTokenBalance(token: Address): Promise<bigint> {
    this._assertConnected();
    return this._walletAdapter.getTokenBalance(this._wallet!.smartWallet, token);
  }

  /**
   * Fetches the current transaction nonce.
   */
  async getNonce(): Promise<bigint> {
    this._assertConnected();
    return this._walletAdapter.getNonce(this._wallet!.smartWallet);
  }

  /**
   * Checks gas funding status.
   */
  async checkGas(): Promise<GasStatus> {
    this._assertConnected();
    return this._gasAbstractor.checkFunding(this._wallet!.smartWallet);
  }

  /**
   * Refreshes the wallet state (balance, nonce).
   */
  async refresh(): Promise<PaxeerWallet> {
    this._assertConnected();
    this._wallet = await this._walletAdapter.getWalletState(
      this._wallet!.owner,
      this._wallet!.smartWallet,
    );
    return this._wallet;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Session
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Returns the current session info, or null if no active session.
   */
  getSession(): SessionInfo | null {
    return this._sessionManager.session;
  }

  /**
   * Whether the current session key is active and valid.
   */
  isSessionActive(): boolean {
    return this._sessionManager.isActive;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Events
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Subscribe to SDK events.
   */
  on<E extends PaxeerEvent>(event: E, handler: (data: PaxeerEventMap[E]) => void): void {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event)!.add(handler);
  }

  /**
   * Unsubscribe from SDK events.
   */
  off<E extends PaxeerEvent>(event: E, handler: (data: PaxeerEventMap[E]) => void): void {
    this._listeners.get(event)?.delete(handler);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Accessors (for advanced use / framework bindings)
  // ═══════════════════════════════════════════════════════════════════════════

  /** The underlying WalletAdapter for direct contract reads */
  get walletAdapter(): WalletAdapter {
    return this._walletAdapter;
  }

  /** The underlying SessionManager */
  get sessionManager(): SessionManager {
    return this._sessionManager;
  }

  /** The underlying GasAbstractor */
  get gasAbstractor(): GasAbstractor {
    return this._gasAbstractor;
  }

  /** The SDK config */
  get config(): PaxeerClientConfig {
    return this._config;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Private
  // ═══════════════════════════════════════════════════════════════════════════

  private _assertConnected(): void {
    if (!this._wallet || !this._provider) {
      throw new WalletNotConnectedError();
    }
  }

  private _emit<E extends PaxeerEvent>(event: E, data: PaxeerEventMap[E]): void {
    const handlers = this._listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch (err) {
          console.error(`[PaxeerConnect] Error in ${event} handler:`, err);
        }
      }
    }
  }

  private _setupProviderListeners(provider: EIP1193Provider): void {
    if (!provider.on) return;

    provider.on('accountsChanged', (accounts: unknown) => {
      const accts = accounts as Address[];
      if (!accts.length) {
        this.disconnect();
      }
    });

    provider.on('chainChanged', (chainId: unknown) => {
      const id = parseInt(chainId as string, 16);
      if (id !== PAXEER_NETWORK_CHAIN.id) {
        this.disconnect();
        this._emit('error', new ChainMismatchError(PAXEER_NETWORK_CHAIN.id, id));
      }
    });
  }
}

// ── Factory Function ─────────────────────────────────────────────────────────

/**
 * Creates a new PaxeerClient instance.
 *
 * @example
 * ```ts
 * import { createPaxeerClient } from '@paxeer/paxeer-connect'
 *
 * const paxeer = createPaxeerClient({
 *   appName: 'Paxeer DEX',
 *   appId: 'paxeer-dex',
 *   permissions: ['EXECUTE', 'TRANSFER_ERC20'],
 * })
 *
 * const wallet = await paxeer.connect(window.ethereum)
 * await paxeer.execute({ to: '0x...', data: '0x...' })
 * ```
 */
export function createPaxeerClient(config: PaxeerClientConfig): PaxeerClient {
  return new PaxeerClient(config);
}
