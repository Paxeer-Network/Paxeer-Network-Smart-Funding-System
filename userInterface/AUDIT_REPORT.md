# Paxeer User Interface — Codebase Audit Report

> Analyzed: Feb 8, 2026
> Scope: `/userInterface/` — Vue 3 + Vite + Tailwind + Pinia

---

## Executive Summary

The frontend is functional and well-structured for a prototype. The UI is clean (dark theme, Tailwind, Lucide icons) and the component architecture follows Vue 3 Composition API conventions. However, there are **critical security gaps**, **robustness issues**, and **missing production hardening** that must be addressed before any public-facing deployment.

**Priority breakdown:**
- 🔴 **Critical** (security/data integrity) — 6 issues
- 🟠 **High** (robustness/reliability) — 8 issues
- 🟡 **Medium** (quality/maintainability) — 7 issues
- 🟢 **Low** (polish/DX) — 5 issues

---

## 🔴 Critical Issues

### 1. JWT Token Stored in localStorage — XSS Vulnerable

**Files:** `src/api/client.ts:7`, `src/stores/auth.ts:6,21`, `src/main.ts:31`

The JWT `paxeer_token` is stored in `localStorage`, which is accessible to any JavaScript running on the page. A single XSS vulnerability (e.g., a compromised dependency, injected script) can steal the token silently.

**Fix:** Use `httpOnly` cookies set by the backend with `SameSite=Strict`. If localStorage must be used, implement token rotation with short-lived access tokens + a refresh flow.

---

### 2. No CSRF Protection on API Calls

**File:** `src/api/client.ts`

All API requests use `fetch()` with a `Bearer` token but no CSRF token. If cookies are added (per fix #1), CSRF becomes critical. Even with Bearer tokens, a compromised tab can make requests.

**Fix:** Add a CSRF token header to all mutating requests (POST/PUT/DELETE). The backend should issue and validate it.

---

### 3. Auth Guard Relies on localStorage Token Existence Only

**File:** `src/main.ts:30-34`

```ts
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem("paxeer_token")) {
    return { name: "home" };
  }
});
```

This only checks if a token *exists* in localStorage — it does NOT validate it. An expired, malformed, or revoked token passes the guard. The user sees a broken dashboard until an API call fails.

**Fix:**
1. On app boot, validate the token by calling `getUserStatus()`.
2. In the router guard, check `auth.isAuthenticated` (which should reflect validated state).
3. Add an `axios`/`fetch` interceptor that catches 401s globally and redirects to `/`.

---

### 4. PIN Transmitted and Validated Client-Side

**File:** `src/views/SignupView.vue:47-53`

PIN validation (length, match) happens entirely in the client. A bypassed frontend can submit any PIN. More critically, the PIN is sent as **plaintext** over the wire (just JSON body).

**Fix:**
- Always validate PIN constraints server-side (the backend likely does, but verify).
- Consider hashing the PIN client-side before sending (using `crypto.subtle.digest` or `bcrypt` wasm) to prevent plaintext transit, even over HTTPS.

---

### 5. Subgraph Global Stats Fetch Has No Pagination Guard

**File:** `src/api/subgraph.ts:149`

```ts
eventEmitterTransactionExecuteds(first: 1000) { id }
```

Fetching up to 1,000 transaction IDs just to count them is wasteful and will break at scale. The Graph has query size limits, and this will silently return incomplete data once the network grows past 1,000 transactions.

**Fix:** Use a subgraph-level aggregate entity (counter) or The Graph's `_meta` endpoint. Alternatively, add server-side aggregation.

---

### 6. No Input Sanitization on User Profile Fields

**File:** `src/views/SignupView.vue:58-68`

Social fields (telegram, twitter, github, discord, website) are sent raw to the backend. If the backend stores and re-renders them (e.g., in the dashboard), this is a stored XSS vector.

**Fix:** Sanitize inputs client-side (strip HTML/scripts) AND server-side before storage. Use a library like `DOMPurify` if rendering any user-generated content.

---

## 🟠 High Priority Issues

### 7. `useWallet` Composable Uses Module-Level Singleton State

**File:** `src/composables/useWallet.ts:4-9`

```ts
const address = ref<string | null>(null);
const connected = ref(false);
// ...defined at module scope, shared across all components
```

All refs are declared at the module level, making this a de-facto singleton. While this works for a single-user app, it creates issues:
- State leaks between tests.
- Hot module reload (HMR) can produce stale state.
- No clean way to reset state without calling `disconnect()`.

**Fix:** Move wallet state into a Pinia store (like `auth.ts`) or use `createSharedComposable` from VueUse. This also lets you persist/hydrate wallet state properly.

---

### 8. `useWalletStats` Also Uses Module-Level Singletons

**File:** `src/composables/useWalletStats.ts:39-53`

Same issue as #7 — all refs and the timer are module-scoped globals. The auto-refresh timer (`_refreshTimer`) can leak if the composable is used in multiple components that mount/unmount independently.

**Fix:** Either use a Pinia store or scope the state to the composable instance. If singleton behavior is intentional, at minimum guard the timer to prevent double-starts.

---

### 9. No Global Error Boundary or API Error Interceptor

**Files:** `src/api/client.ts`, `src/stores/auth.ts:80-82`

Error handling is ad-hoc per-component. The only 401 handling is a string match:
```ts
if (err.message?.includes("401") || err.message?.includes("expired")) {
  clearAuth();
}
```

This is fragile — if the backend changes its error message format, the 401 detection breaks.

**Fix:**
1. Check `res.status === 401` in the `request()` function and throw a typed `AuthenticationError`.
2. Create a global API interceptor that catches `AuthenticationError` and calls `clearAuth()` + redirects.
3. Add a Vue `app.config.errorHandler` for unhandled errors.

---

### 10. `ethers` Dependency Should Be Replaced with `viem`

**File:** `src/composables/useWallet.ts`, `package.json:17`

The app uses `ethers` v6 for wallet connection, but you now have `viem` in the monorepo via `@paxeer/paxeer-connect`. Having both `ethers` and `viem` doubles the EVM library footprint (~400KB+ combined).

**Fix:** Replace `ethers.BrowserProvider` usage with `viem`'s `createWalletClient` + `custom(window.ethereum)`. Or better yet, integrate `@paxeer/paxeer-connect/vue` which handles all of this.

---

### 11. `chainChanged` Handler Reloads the Entire Page

**File:** `src/composables/useWallet.ts:42-44`

```ts
w.ethereum.on("chainChanged", () => {
  window.location.reload();
});
```

A full page reload is poor UX and loses all in-memory state. Users switching chains in MetaMask will lose their dashboard context.

**Fix:** Handle chain changes gracefully — update `chainId` ref, show a warning banner if on the wrong chain, and re-fetch data. No reload needed.

---

### 12. No Loading/Skeleton States for Dashboard Sections

**File:** `src/views/DashboardView.vue:141-143`

The loading state shows a single centered spinner for the entire page. Individual sections (charts, holdings, transactions, session keys) should show independent loading skeletons so the user sees progressive content.

**Fix:** Add skeleton/placeholder components per section. Use `v-if="stats.balance.value"` independently per section rather than gating everything behind a single loading check.

---

### 13. Vite Dev Server Port Mismatch with PM2

**File:** `vite.config.ts:17`

```ts
server: { port: 5173 }
```

But PM2 runs the frontend on port 4000. This means `vite dev` runs on 5173, while production/PM2 uses 4000. There's no build-time check for this. If someone runs `pnpm dev` expecting port 4000, they'll be confused.

**Fix:** Set `server.port` to 4000 to match the PM2 config, or use an env variable.

---

### 14. No Request Debouncing/Throttling on Dashboard Refresh

**File:** `src/views/DashboardView.vue:58-63`

The refresh button and period selector trigger full data refetches without debouncing. A user clicking the refresh button rapidly will fire multiple concurrent API calls.

**Fix:** Add a simple debounce/throttle to `refreshAll()` and `selectPeriod()`. A `loading` guard already partially helps but doesn't prevent queue buildup.

---

## 🟡 Medium Priority Issues

### 15. Paxeer Network chainId Mismatch

**File:** `src/views/HomeView.vue:24`

```ts
{ id: "paxeer", name: "Paxeer Network", chainId: 2025, ... }
```

But the actual Paxeer Network chainId is **125** (per all contracts, `@paxeer/paxeer-connect`, and deploy configs). This is wrong and will cause verification failures when a user selects "Paxeer Network".

**Fix:** Change `chainId: 2025` to `chainId: 125`.

---

### 16. No Route for 404 / Catch-All

**File:** `src/main.ts:9-27`

Only 3 routes are defined. Navigating to any other path (e.g., `/settings`, `/about`, a typo) shows a blank page.

**Fix:** Add a catch-all route:
```ts
{ path: "/:pathMatch(.*)*", name: "not-found", component: () => import("./views/NotFoundView.vue") }
```

---

### 17. `Promise.allSettled` Results Not Surfaced to User

**File:** `src/composables/useWalletStats.ts:63-84`

When individual API calls fail in `fetchAll()`, they're silently ignored (the ref just doesn't update). The user sees stale or missing data with no indication which calls failed.

**Fix:** Track per-section error state so the UI can show "Failed to load portfolio" vs "Failed to load charts" independently.

---

### 18. No Retry Logic for Network Failures

**File:** `src/api/client.ts:14`

A single `fetch()` call with no retry. Network blips, temporary API outages, or cold-start latency will show permanent errors until the user manually refreshes.

**Fix:** Add exponential backoff retry (2-3 attempts) for GET requests. Don't retry POST/mutations automatically.

---

### 19. `env.d.ts` Missing Vite Env Variable Types

**File:** `env.d.ts`

No `ImportMetaEnv` interface declared, so `import.meta.env.VITE_API_URL` etc. are untyped.

**Fix:** Add:
```ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUBGRAPH_URL: string;
  readonly VITE_WALLET_STATS_API_URL: string;
}
```

---

### 20. No SEO/Meta Tags or Favicon

**File:** `index.html:5`

```html
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
```

Using the default Vite favicon. No `<meta description>`, no Open Graph tags, no proper page titles per route.

**Fix:** Add proper meta tags, a Paxeer favicon, and use `useHead` (from `@unhead/vue`) or `document.title` per route.

---

### 21. Dashboard Polls Even When Tab Is Hidden

**File:** `src/composables/useWalletStats.ts:132-136`

The auto-refresh `setInterval` keeps running when the user switches tabs, wasting API calls and bandwidth.

**Fix:** Use `document.visibilityState` to pause polling when the tab is hidden. Resume on `visibilitychange`.

---

## 🟢 Low Priority Issues

### 22. No Dark/Light Mode Toggle

**File:** `tailwind.config.js:3`

`darkMode: "class"` is configured, but there's no toggle in the UI and the app hardcodes dark styles everywhere. The `class` mode goes unused.

**Fix:** Either implement a theme toggle or switch to `darkMode: "media"` for system-preference detection.

---

### 23. `StatCard.vue` Component Is Unused

**File:** `src/components/StatCard.vue`

This component is defined but never imported or used anywhere in the app. Dead code.

**Fix:** Remove it, or integrate it into the dashboard.

---

### 24. Vite Alias for SDK Points to `.vue.ts` File

**File:** `vite.config.ts:10-13`

```ts
"@paxeer-network/user-stats-typescript-sdk": resolve(
  __dirname,
  "../packages/Paxeer-UserWallet-TypeScriptSDK/src/index.vue.ts",
),
```

This is a fragile workaround pointing to a specific `.vue.ts` file. If the SDK restructures its exports, this breaks silently.

**Fix:** The SDK should have proper ESM exports in its `package.json`. Then the alias isn't needed.

---

### 25. No Accessibility (a11y) Attributes

**Files:** All components

- Buttons lack `aria-label` where icon-only (e.g., copy button, disconnect button).
- Tables lack `scope` attributes on `<th>`.
- No focus management after route transitions.
- The network selection grid lacks `role="radiogroup"` semantics.

**Fix:** Audit with `@vue-a11y/eslint-plugin` and add proper ARIA attributes.

---

### 26. No Transition Animations Between Routes

**File:** `src/App.vue:8`

```html
<router-view />
```

No `<Transition>` or `<RouterView v-slot>` for route transitions. Views appear/disappear abruptly.

**Fix:** Wrap with Vue transition:
```html
<RouterView v-slot="{ Component }">
  <Transition name="fade" mode="out-in">
    <component :is="Component" />
  </Transition>
</RouterView>
```

---

## Architecture Recommendations

### Consolidate State Management

Currently, wallet state lives in 3 separate places:
1. `useWallet` composable (module-scoped refs)
2. `useAuthStore` (Pinia)
3. `useWalletStats` composable (module-scoped refs)

**Recommendation:** Merge wallet connection state into a single `useWalletStore` Pinia store. Keep `useWalletStats` as a separate store but backed by Pinia for devtools support and proper lifecycle management.

### Integrate `@paxeer/paxeer-connect/vue`

The new SDK's Vue composables (`usePaxeerClient`, `usePaxeerTransaction`, `usePaxeerBalance`) should replace most of the manual wallet connection and SmartWallet interaction code. This would:
- Eliminate the `ethers` dependency
- Add session key management
- Provide popup-free transaction execution
- Unify the wallet connection flow

### Add a Proper Error Boundary Layer

Create an `ErrorBoundary.vue` component and a global `useErrorHandler` composable that:
- Catches unhandled promise rejections
- Catches Vue component errors via `onErrorCaptured`
- Shows toast notifications for recoverable errors
- Redirects to login on auth failures

### Add E2E Tests

No tests exist for the frontend. At minimum, add:
- Playwright tests for the connect → verify → signup → dashboard flow
- Component tests for `BalanceHero`, `HoldingsTable`, `TransactionsTable`
- API mock tests for error states

---

## File-by-File Severity Matrix

| File | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| `api/client.ts` | 2 | 1 | 1 | - |
| `stores/auth.ts` | 1 | 1 | - | - |
| `main.ts` | 1 | - | 1 | - |
| `composables/useWallet.ts` | - | 3 | - | - |
| `composables/useWalletStats.ts` | - | 1 | 2 | - |
| `views/HomeView.vue` | - | - | 1 | - |
| `views/SignupView.vue` | 2 | - | - | - |
| `views/DashboardView.vue` | - | 2 | - | - |
| `api/subgraph.ts` | 1 | - | - | - |
| `vite.config.ts` | - | 1 | - | 1 |
| `App.vue` | - | - | - | 1 |
| `env.d.ts` | - | - | 1 | - |
| `index.html` | - | - | 1 | - |
| Components (all) | - | - | - | 1 |
| `StatCard.vue` | - | - | - | 1 |

---

## Recommended Fix Order

1. **Fix chainId mismatch** (15) — 1 line, prevents user-facing bug
2. **Fix auth guard** (3) — prevents broken dashboard state
3. **Add global 401 interceptor** (9) — prevents silent auth failures
4. **Move localStorage token to httpOnly cookie** (1) — security critical
5. **Replace ethers with viem** (10) — reduces bundle, aligns with SDK
6. **Integrate @paxeer/paxeer-connect/vue** — replaces manual wallet logic
7. **Add 404 route** (16) — quick win
8. **Fix subgraph pagination** (5) — prevents data loss at scale
9. **Add per-section loading states** (12) — UX improvement
10. **Add input sanitization** (6) — security hardening
