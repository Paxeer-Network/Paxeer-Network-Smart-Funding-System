/* ── Paxeer Provider — runs in page context via world: "MAIN" ── */
// This content script is declared with world: "MAIN" in the manifest,
// so Chrome injects it directly into the page JS context (bypasses page CSP).

const PAXEER_MSG_SOURCE = "paxeer-provider";
const PAXEER_MSG_RESPONSE = "paxeer-response";

type Listener = (...args: unknown[]) => void;

let counter = 0;
const pending = new Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
const listeners: Record<string, Set<Listener>> = {};

/* ── Listen for responses from the relay content script (ISOLATED world) ── */
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  const msg = event.data;
  if (!msg || msg.source !== PAXEER_MSG_RESPONSE) return;

  const { id, result, error } = msg.payload;
  const entry = pending.get(id);
  if (!entry) return;
  pending.delete(id);

  if (error) {
    entry.reject(new Error(error.message));
  } else {
    entry.resolve(result);
  }
});

/* ── Provider object ── */
const paxeer = {
  isPaxeer: true,
  isMetaMask: false,
  chainId: "0x7d",

  request({ method, params }: { method: string; params?: unknown[] }): Promise<unknown> {
    params = params ?? [];
    return new Promise((resolve, reject) => {
      const id = `px_${Date.now()}_${++counter}`;
      pending.set(id, { resolve, reject });

      window.postMessage(
        {
          source: PAXEER_MSG_SOURCE,
          payload: { id, method, params, origin: window.location.origin },
        },
        "*",
      );

      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error("Request timed out."));
        }
      }, 30_000);
    });
  },

  on(event: string, handler: Listener) {
    if (!listeners[event]) listeners[event] = new Set();
    listeners[event].add(handler);
  },

  off(event: string, handler: Listener) {
    listeners[event]?.delete(handler);
  },

  removeListener(event: string, handler: Listener) {
    listeners[event]?.delete(handler);
  },
};

/* ── Expose on window ── */
Object.defineProperty(window, "paxeer", {
  value: paxeer,
  writable: false,
  configurable: false,
});

// Also expose as window.ethereum for standard EIP-1193 dApp compatibility
if (!(window as any).ethereum) {
  (window as any).ethereum = paxeer;
}

/* ── Announce readiness ── */
window.dispatchEvent(new CustomEvent("paxeer#initialized"));
window.dispatchEvent(new Event("ethereum#initialized"));
