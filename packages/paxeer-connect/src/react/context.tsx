// ── React Context for PaxeerClient ───────────────────────────────────────────

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { PaxeerClient, type PaxeerClientConfig } from '../core';

const PaxeerContext = createContext<PaxeerClient | null>(null);

export interface PaxeerProviderProps {
  config: PaxeerClientConfig;
  children: ReactNode;
}

/**
 * React context provider that creates and provides a PaxeerClient instance.
 *
 * @example
 * ```tsx
 * import { PaxeerProvider } from '@paxeer/paxeer-connect/react'
 *
 * function App() {
 *   return (
 *     <PaxeerProvider config={{
 *       appName: 'Paxeer DEX',
 *       appId: 'paxeer-dex',
 *       permissions: ['EXECUTE', 'TRANSFER_ERC20'],
 *     }}>
 *       <MyApp />
 *     </PaxeerProvider>
 *   )
 * }
 * ```
 */
export function PaxeerProvider({ config, children }: PaxeerProviderProps) {
  const client = useMemo(() => new PaxeerClient(config), [
    config.appName,
    config.appId,
    config.rpcUrl,
    config.sessionDuration,
    // Intentionally shallow — config should be stable
  ]);

  return (
    <PaxeerContext.Provider value={client}>
      {children}
    </PaxeerContext.Provider>
  );
}

/**
 * Hook to access the PaxeerClient instance from context.
 * Must be used within a <PaxeerProvider>.
 */
export function usePaxeerContext(): PaxeerClient {
  const client = useContext(PaxeerContext);
  if (!client) {
    throw new Error(
      'usePaxeerContext must be used within a <PaxeerProvider>. ' +
      'Wrap your app with <PaxeerProvider config={...}>.',
    );
  }
  return client;
}
