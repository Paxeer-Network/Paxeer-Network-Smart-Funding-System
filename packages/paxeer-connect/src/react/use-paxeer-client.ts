// ── usePaxeerClient Hook ─────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { usePaxeerContext } from './context';
import type { PaxeerWallet, EIP1193Provider, SessionInfo } from '../core';

export interface UsePaxeerClientReturn {
  /** The current connected wallet, or null */
  wallet: PaxeerWallet | null;
  /** Whether a wallet is currently connected */
  isConnected: boolean;
  /** Whether the session key is active (popup-free transactions) */
  isSessionActive: boolean;
  /** Current session info */
  session: SessionInfo | null;
  /** Whether a connection is in progress */
  connecting: boolean;
  /** Last connection error, if any */
  error: string | null;
  /** Connect to the user's wallet via an EIP-1193 provider (e.g. window.ethereum) */
  connect: (provider?: EIP1193Provider) => Promise<PaxeerWallet>;
  /** Disconnect and clear session */
  disconnect: () => void;
  /** Refresh wallet state (balance, nonce) */
  refresh: () => Promise<void>;
  /** The underlying PaxeerClient instance for advanced use */
  client: ReturnType<typeof usePaxeerContext>;
}

/**
 * Primary React hook for connecting and managing a Paxeer SmartWallet.
 *
 * @example
 * ```tsx
 * function ConnectButton() {
 *   const { wallet, isConnected, connect, disconnect, connecting } = usePaxeerClient()
 *
 *   if (isConnected) {
 *     return (
 *       <div>
 *         <p>{wallet.metadata.userAlias}</p>
 *         <button onClick={disconnect}>Disconnect</button>
 *       </div>
 *     )
 *   }
 *
 *   return (
 *     <button onClick={() => connect()} disabled={connecting}>
 *       {connecting ? 'Connecting...' : 'Connect Wallet'}
 *     </button>
 *   )
 * }
 * ```
 */
export function usePaxeerClient(): UsePaxeerClientReturn {
  const client = usePaxeerContext();
  const [wallet, setWallet] = useState<PaxeerWallet | null>(client.getWallet());
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(
    async (provider?: EIP1193Provider): Promise<PaxeerWallet> => {
      setConnecting(true);
      setError(null);
      try {
        // Default to window.ethereum if available
        const p = provider ?? (globalThis as any).ethereum;
        if (!p) {
          throw new Error('No Ethereum provider found. Install MetaMask or another wallet.');
        }
        const w = await client.connect(p);
        setWallet(w);
        return w;
      } catch (err: any) {
        const msg = err?.message ?? 'Connection failed';
        setError(msg);
        throw err;
      } finally {
        setConnecting(false);
      }
    },
    [client],
  );

  const disconnect = useCallback(() => {
    client.disconnect();
    setWallet(null);
    setError(null);
  }, [client]);

  const refresh = useCallback(async () => {
    try {
      const w = await client.refresh();
      setWallet(w);
    } catch (err: any) {
      setError(err?.message ?? 'Refresh failed');
    }
  }, [client]);

  return {
    wallet,
    isConnected: wallet !== null && wallet.isConnected,
    isSessionActive: client.isSessionActive(),
    session: client.getSession(),
    connecting,
    error,
    connect,
    disconnect,
    refresh,
    client,
  };
}
