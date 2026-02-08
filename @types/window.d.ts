/**
 * Window augmentation for the Paxeer extension provider.
 * Used by the userInterface and any dApp that integrates with the extension.
 */

interface PaxeerProvider {
  isPaxeer: true;
  isMetaMask: false;
  chainId: string;
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on(event: string, handler: (...args: unknown[]) => void): void;
  off(event: string, handler: (...args: unknown[]) => void): void;
  removeListener(event: string, handler: (...args: unknown[]) => void): void;
}

interface Window {
  paxeer?: PaxeerProvider;
  ethereum?: PaxeerProvider | {
    isMetaMask?: boolean;
    request(args: { method: string; params?: unknown[] }): Promise<unknown>;
    on?(event: string, handler: (...args: unknown[]) => void): void;
    off?(event: string, handler: (...args: unknown[]) => void): void;
  };
  phantom?: {
    solana?: {
      isPhantom: boolean;
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
      signMessage(message: Uint8Array, encoding: string): Promise<{ signature: Uint8Array }>;
      on(event: string, handler: (...args: unknown[]) => void): void;
    };
  };
  solana?: {
    isPhantom: boolean;
    connect(): Promise<{ publicKey: { toString(): string } }>;
    disconnect(): Promise<void>;
    signMessage(message: Uint8Array, encoding: string): Promise<{ signature: Uint8Array }>;
    on(event: string, handler: (...args: unknown[]) => void): void;
  };
}
