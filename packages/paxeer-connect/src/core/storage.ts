// ── Session Key Storage ──────────────────────────────────────────────────────
//
// Stores ephemeral session keys in localStorage, scoped by appId + smartWallet.
// Keys are stored as JSON. In a production deployment, consider encrypting
// the private key at rest with a user-derived key.

import type { StoredSessionKey, Address } from './types';

const STORAGE_PREFIX = 'paxeer:session:';

function storageKey(appId: string, smartWallet: Address): string {
  return `${STORAGE_PREFIX}${appId}:${smartWallet.toLowerCase()}`;
}

/**
 * Persists a session key to localStorage.
 */
export function saveSessionKey(session: StoredSessionKey): void {
  if (typeof globalThis.localStorage === 'undefined') return;
  const key = storageKey(session.appId, session.smartWallet);
  globalThis.localStorage.setItem(key, JSON.stringify(session));
}

/**
 * Retrieves a stored session key, or null if not found / expired.
 */
export function loadSessionKey(
  appId: string,
  smartWallet: Address,
): StoredSessionKey | null {
  if (typeof globalThis.localStorage === 'undefined') return null;
  const key = storageKey(appId, smartWallet);
  const raw = globalThis.localStorage.getItem(key);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as StoredSessionKey;
    const now = Math.floor(Date.now() / 1000);
    if (now > session.validUntil) {
      // Expired — clean up
      globalThis.localStorage.removeItem(key);
      return null;
    }
    return session;
  } catch {
    globalThis.localStorage.removeItem(key);
    return null;
  }
}

/**
 * Removes a stored session key.
 */
export function clearSessionKey(appId: string, smartWallet: Address): void {
  if (typeof globalThis.localStorage === 'undefined') return;
  const key = storageKey(appId, smartWallet);
  globalThis.localStorage.removeItem(key);
}

/**
 * Scans localStorage for ALL session keys across all apps for a given wallet.
 * Used to check if an existing session key from another app satisfies
 * the current app's permission requirements (true SSO).
 */
export function findAllSessionKeys(smartWallet: Address): StoredSessionKey[] {
  if (typeof globalThis.localStorage === 'undefined') return [];
  const results: StoredSessionKey[] = [];
  const now = Math.floor(Date.now() / 1000);
  const walletLower = smartWallet.toLowerCase();

  for (let i = 0; i < globalThis.localStorage.length; i++) {
    const key = globalThis.localStorage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
    if (!key.endsWith(`:${walletLower}`)) continue;

    try {
      const raw = globalThis.localStorage.getItem(key);
      if (!raw) continue;
      const session = JSON.parse(raw) as StoredSessionKey;
      if (now <= session.validUntil && now >= session.validAfter) {
        results.push(session);
      }
    } catch {
      // Skip invalid entries
    }
  }

  return results;
}
