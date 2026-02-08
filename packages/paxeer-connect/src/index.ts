/**
 * @paxeer/paxeer-connect
 *
 * Paxeer Connect SDK — Unified SmartWallet integration for protocol developers.
 *
 * Core:       import { createPaxeerClient } from '@paxeer/paxeer-connect'
 * React:      import { usePaxeerClient } from '@paxeer/paxeer-connect/react'
 * Vue:        import { usePaxeerClient } from '@paxeer/paxeer-connect/vue'
 * ABIs:       import { SmartWalletAbi } from '@paxeer/paxeer-connect'
 * Wagmi:      import { useSmartWalletExecute } from '@paxeer/paxeer-connect/hooks'
 * Actions:    import { readSmartWalletGetBalance } from '@paxeer/paxeer-connect/actions'
 */

// ── Core SDK (the main high-level API) ───────────────────────────────────────
export * from './core';

// ── Auto-generated: ABIs, constants, types ───────────────────────────────────
export * from './abis';
export * from './constants';
export * from './types';
