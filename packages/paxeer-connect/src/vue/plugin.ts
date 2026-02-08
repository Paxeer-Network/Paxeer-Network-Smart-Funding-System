// ── Vue Plugin for PaxeerClient ──────────────────────────────────────────────

import { inject, type App, type InjectionKey } from 'vue';
import { PaxeerClient, type PaxeerClientConfig } from '../core';

export const PaxeerClientKey: InjectionKey<PaxeerClient> = Symbol('PaxeerClient');

/**
 * Vue 3 plugin that provides a PaxeerClient instance to all components.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { paxeerPlugin } from '@paxeer/paxeer-connect/vue'
 *
 * const app = createApp(App)
 * app.use(paxeerPlugin, {
 *   appName: 'Paxeer DEX',
 *   appId: 'paxeer-dex',
 *   permissions: ['EXECUTE', 'TRANSFER_ERC20'],
 * })
 * ```
 */
export const paxeerPlugin = {
  install(app: App, config: PaxeerClientConfig) {
    const client = new PaxeerClient(config);
    app.provide(PaxeerClientKey, client);
  },
};

/**
 * Injects the PaxeerClient from the Vue plugin.
 * Must be used in a component where paxeerPlugin has been installed.
 */
export function usePaxeerContext(): PaxeerClient {
  const client = inject(PaxeerClientKey);
  if (!client) {
    throw new Error(
      'usePaxeerContext requires the paxeerPlugin to be installed. ' +
      'Call app.use(paxeerPlugin, config) in your main.ts.',
    );
  }
  return client;
}
