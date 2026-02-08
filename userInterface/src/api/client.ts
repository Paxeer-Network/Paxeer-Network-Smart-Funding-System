const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4200";

// ── Secure Token Management ──────────────────────────────────────────────
// Token lives in memory. localStorage is only used as a persistence fallback
// on page reload. The in-memory copy is authoritative.
let _token: string | null = null;
let _csrfToken: string | null = null;
let _onAuthFailure: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  _token = token;
  if (token) {
    try { localStorage.setItem("paxeer_token", token); } catch {}
  } else {
    try { localStorage.removeItem("paxeer_token"); } catch {}
  }
}

export function getAuthToken(): string | null {
  if (!_token) {
    try { _token = localStorage.getItem("paxeer_token"); } catch {}
  }
  return _token;
}

export function clearAuthToken(): void {
  _token = null;
  _csrfToken = null;
  try { localStorage.removeItem("paxeer_token"); } catch {}
}

export function onAuthFailure(cb: () => void): void {
  _onAuthFailure = cb;
}

export function setCsrfToken(token: string): void {
  _csrfToken = token;
}

// ── Typed API Errors ─────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = "Authentication failed") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "AuthenticationError";
  }
}

// ── Core Request Function ────────────────────────────────────────────────
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const method = (options.method ?? "GET").toUpperCase();
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(_csrfToken && isMutating ? { "X-CSRF-Token": _csrfToken } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  let lastError: Error | null = null;
  const retries = isMutating ? 0 : MAX_RETRIES;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
      const data = (await res.json()) as Record<string, any>;

      if (res.status === 401) {
        clearAuthToken();
        _onAuthFailure?.();
        throw new AuthenticationError(data.error || "Session expired");
      }

      if (!res.ok) {
        throw new ApiError(
          data.error || `Request failed: ${res.status}`,
          res.status,
          data.code,
        );
      }

      // Capture CSRF token from response headers if backend provides one
      const csrf = res.headers.get("X-CSRF-Token");
      if (csrf) _csrfToken = csrf;

      return data as T;
    } catch (err: any) {
      lastError = err;
      // Don't retry auth errors or client errors
      if (err instanceof AuthenticationError) throw err;
      if (err instanceof ApiError && err.status < 500) throw err;
      // Retry on network/server errors
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
        continue;
      }
    }
  }

  throw lastError ?? new Error("Request failed");
}

// ── Auth ─────────────────────────────────────────────────────────────────

export interface NonceResponse {
  nonce: string;
  message: string;
}

export interface VerifyResponse {
  token: string;
  eligible?: boolean;
  qualityTransactions?: number;
  required?: number;
  message?: string;
  user?: {
    argusId: string;
    eligible: boolean;
    signupComplete: boolean;
    smartWallet: string | null;
  };
}

export function getNonce(walletAddress: string): Promise<NonceResponse> {
  return request("/auth/nonce", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });
}

export function verifyWallet(payload: {
  walletAddress: string;
  signature: string;
  network: string;
  chainId: number;
  chainType: "evm" | "solana";
}): Promise<VerifyResponse> {
  return request("/auth/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Users ────────────────────────────────────────────────────────────────

export interface SignupPayload {
  email: string;
  pin: string;
  userAlias: string;
  evmAddress?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
  github?: string;
  discord?: string;
}

export interface SignupResponse {
  message: string;
  argusId: string;
}

export function completeSignup(data: SignupPayload): Promise<SignupResponse> {
  return request("/users/complete-signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface UserStatus {
  user: {
    argusId: string;
    walletAddress: string;
    network: string;
    chainType: string;
    email: string | null;
    userAlias: string | null;
    smartWallet: string | null;
    eligible: boolean;
    signupComplete: boolean;
    telegram: string | null;
    twitter: string | null;
    website: string | null;
    github: string | null;
    discord: string | null;
    createdAt: string;
  };
  assignmentStatus: { status: string; smart_wallet: string; tx_hash: string } | null;
  fundingStatus: { status: string; tx_hash: string; amount: string } | null;
}

export function getUserStatus(): Promise<UserStatus> {
  return request("/users/status");
}
