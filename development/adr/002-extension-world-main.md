# ADR-002: Chrome Extension Provider via world: "MAIN" Content Script

## Status
**Accepted**

## Context
The Paxeer Chrome extension needs to inject an EIP-1193 provider (`window.paxeer`)
into every web page for dApp connectivity.

### Approaches Considered

1. **External script via web_accessible_resources**
   - `<script src="chrome.runtime.getURL(...)">` loaded from content script
   - Problem: @crxjs/vite-plugin does NOT compile web_accessible_resources files,
     so TypeScript is copied raw and browsers throw SyntaxError

2. **Inline script injection** (`script.textContent = ...`)
   - Content script injects provider code as inline script
   - Problem: Page CSP blocks `script-src` without `'unsafe-inline'`

3. **world: "MAIN" content script** (chosen)
   - Manifest declares provider as a content script with `"world": "MAIN"`
   - Chrome injects it directly into the page JS context
   - Bypasses page CSP entirely (Chrome handles injection, not the page)
   - @crxjs compiles it as a normal content script entry point

## Decision
Use `world: "MAIN"` content script (Manifest V3, Chrome 111+) for the provider.
A separate content script in the default ISOLATED world handles message relay
to the background service worker via `chrome.runtime.sendMessage()`.

## Consequences
- **Positive**: No CSP issues, TypeScript compiled by @crxjs, clean separation
- **Positive**: Provider has direct access to `window` (sets `window.paxeer`)
- **Negative**: MAIN world scripts cannot use `chrome.*` APIs (relay needed)
- **Negative**: Requires Chrome 111+ (acceptable for target audience)
