import {
  PAXEER_MSG_SOURCE,
  PAXEER_MSG_RESPONSE,
  type ProviderMessage,
  type ProviderResponse,
  type ExtensionResponse,
} from "@/shared/types";

/* ── Relay: page (MAIN world) → content-script (ISOLATED) → background ── */
// The provider script runs in a separate content script with world: "MAIN".
// This relay script runs in the default ISOLATED world and forwards messages.
window.addEventListener("message", async (event) => {
  if (event.source !== window) return;
  const msg = event.data as ProviderMessage;
  if (!msg || msg.source !== PAXEER_MSG_SOURCE) return;

  const request = {
    ...msg.payload,
    origin: window.location.origin,
  };

  try {
    const response: ExtensionResponse = await chrome.runtime.sendMessage(request);
    const reply: ProviderResponse = {
      source: PAXEER_MSG_RESPONSE,
      payload: { ...response, id: msg.payload.id },
    };
    window.postMessage(reply, "*");
  } catch (err) {
    const reply: ProviderResponse = {
      source: PAXEER_MSG_RESPONSE,
      payload: {
        id: msg.payload.id,
        error: { code: -32603, message: "Extension unavailable." },
      },
    };
    window.postMessage(reply, "*");
  }
});
