import { createWalletClient, http, type WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type {
  ExtensionRequest,
  ExtensionResponse,
  ExtensionState,
  StoredData,
  BalanceInfo,
  TxRecord,
  WalletAccount,
} from "@/shared/types";
import {
  createWallet,
  importFromMnemonic,
  importFromPrivateKey,
  deriveNextAccount,
  getAccounts,
  getActiveAddress,
  setActiveAccount as setActive,
  deleteAccount as delAccount,
  exportMnemonic,
  exportPrivateKey,
  decryptActivePrivateKey,
  hasWallet,
} from "@/shared/wallet";

/* ── In-memory state (cleared on lock / worker restart) ── */
let currentPin: string | null = null;
let activePrivateKey: `0x${string}` | null = null;
let lockTimer: ReturnType<typeof setTimeout> | null = null;

const DEFAULTS: StoredData = {
  walletMeta: null,
  sessionKeyMeta: null,
  encryptedSessionKey: null,
  salt: null,
  approvedOrigins: [],
  lockTimeoutMinutes: 15,
};

const PAXEER_RPC = "https://public-rpc.paxeer.app/rpc";
const PAXEER_CHAIN_ID = 125;
const BACKEND_URL = "http://localhost:4200";
const WALLET_STATS_API = "https://us-east-1.user-stats.sidiora.exchange";
const USDL_TOKEN = "0x7c69c84daAEe90B21eeCABDb8f0387897E9B7B37";

const paxeerChain = {
  id: PAXEER_CHAIN_ID,
  name: "Paxeer Network",
  nativeCurrency: { name: "PAX", symbol: "PAX", decimals: 18 },
  rpcUrls: { default: { http: [PAXEER_RPC] } },
} as const;

/* ── Storage helpers ── */
async function getStored(): Promise<StoredData> {
  const raw = await chrome.storage.local.get("paxeer");
  return { ...DEFAULTS, ...(raw.paxeer ?? {}) };
}

async function setStored(patch: Partial<StoredData>): Promise<void> {
  const current = await getStored();
  await chrome.storage.local.set({ paxeer: { ...current, ...patch } });
}

/* ── Lock / Unlock ── */
function resetLockTimer(minutes: number) {
  if (lockTimer) clearTimeout(lockTimer);
  lockTimer = setTimeout(() => {
    currentPin = null;
    activePrivateKey = null;
    console.log("[paxeer] auto-locked after timeout");
  }, minutes * 60_000);
}

function isUnlocked(): boolean {
  return currentPin !== null;
}

async function handleUnlock(pin: string): Promise<ExtensionResponse> {
  const walletExists = await hasWallet();
  if (!walletExists) {
    return { id: "", error: { code: 1, message: "No wallet configured. Create or import first." } };
  }
  try {
    const pk = await decryptActivePrivateKey(pin);
    if (!pk) return { id: "", error: { code: 2, message: "Invalid PIN or no active account." } };
    currentPin = pin;
    activePrivateKey = pk;
    const stored = await getStored();
    resetLockTimer(stored.lockTimeoutMinutes);
    return { id: "", result: true };
  } catch {
    return { id: "", error: { code: 2, message: "Invalid PIN." } };
  }
}

function handleLock(): ExtensionResponse {
  currentPin = null;
  activePrivateKey = null;
  if (lockTimer) clearTimeout(lockTimer);
  return { id: "", result: true };
}

/* ── Wallet creation / import ── */
async function handleCreateWallet(params: unknown[]): Promise<ExtensionResponse> {
  const [pin] = params as [string];
  if (!pin || pin.length < 4) {
    return { id: "", error: { code: 3, message: "PIN must be at least 4 digits." } };
  }
  try {
    const { mnemonic, account } = await createWallet(pin);
    currentPin = pin;
    activePrivateKey = await decryptActivePrivateKey(pin);
    const stored = await getStored();
    resetLockTimer(stored.lockTimeoutMinutes);
    await setStored({ walletMeta: { smartWalletAddress: "", ownerAddress: account.address, argusId: "" } });
    return { id: "", result: { mnemonic, account } };
  } catch (e) {
    return { id: "", error: { code: 3, message: (e as Error).message } };
  }
}

async function handleImportMnemonic(params: unknown[]): Promise<ExtensionResponse> {
  const [mnemonic, pin] = params as [string, string];
  try {
    const account = await importFromMnemonic(mnemonic, pin);
    currentPin = pin;
    activePrivateKey = await decryptActivePrivateKey(pin);
    const stored = await getStored();
    resetLockTimer(stored.lockTimeoutMinutes);
    await setStored({ walletMeta: { smartWalletAddress: "", ownerAddress: account.address, argusId: "" } });
    return { id: "", result: account };
  } catch (e) {
    return { id: "", error: { code: 3, message: (e as Error).message } };
  }
}

async function handleImportPrivateKey(params: unknown[]): Promise<ExtensionResponse> {
  const [privateKey, pin, name] = params as [string, string, string?];
  try {
    const account = await importFromPrivateKey(privateKey, pin, name);
    currentPin = pin;
    activePrivateKey = await decryptActivePrivateKey(pin);
    await setStored({ walletMeta: { smartWalletAddress: "", ownerAddress: account.address, argusId: "" } });
    return { id: "", result: account };
  } catch (e) {
    return { id: "", error: { code: 3, message: (e as Error).message } };
  }
}

async function handleDeriveAccount(params: unknown[]): Promise<ExtensionResponse> {
  if (!currentPin) return { id: "", error: { code: 4, message: "Wallet is locked." } };
  const [name] = params as [string?];
  try {
    const account = await deriveNextAccount(currentPin, name);
    return { id: "", result: account };
  } catch (e) {
    return { id: "", error: { code: 3, message: (e as Error).message } };
  }
}

async function handleGetAccounts(): Promise<ExtensionResponse> {
  const accounts = await getAccounts();
  const active = await getActiveAddress();
  return { id: "", result: { accounts, activeAddress: active } };
}

async function handleSetActiveAccount(params: unknown[]): Promise<ExtensionResponse> {
  const [address] = params as [string];
  await setActive(address);
  if (currentPin) {
    activePrivateKey = await decryptActivePrivateKey(currentPin);
    await setStored({ walletMeta: { smartWalletAddress: "", ownerAddress: address, argusId: "" } });
  }
  return { id: "", result: true };
}

async function handleDeleteAccount(params: unknown[]): Promise<ExtensionResponse> {
  const [address] = params as [string];
  await delAccount(address);
  if (currentPin) {
    activePrivateKey = await decryptActivePrivateKey(currentPin);
  }
  return { id: "", result: true };
}

async function handleExportMnemonic(params: unknown[]): Promise<ExtensionResponse> {
  const [pin] = params as [string];
  try {
    const mnemonic = await exportMnemonic(pin);
    if (!mnemonic) return { id: "", error: { code: 6, message: "No mnemonic found (imported via private key?)." } };
    return { id: "", result: mnemonic };
  } catch {
    return { id: "", error: { code: 2, message: "Invalid PIN." } };
  }
}

async function handleExportPrivateKey(params: unknown[]): Promise<ExtensionResponse> {
  const [address, pin] = params as [string, string];
  try {
    const pk = await exportPrivateKey(address, pin);
    if (!pk) return { id: "", error: { code: 6, message: "Account not found." } };
    return { id: "", result: pk };
  } catch {
    return { id: "", error: { code: 2, message: "Invalid PIN." } };
  }
}

async function handleLinkSmartWallet(params: unknown[]): Promise<ExtensionResponse> {
  const [smartWalletAddress, argusId] = params as [string, string?];
  const stored = await getStored();
  await setStored({
    walletMeta: {
      smartWalletAddress,
      ownerAddress: stored.walletMeta?.ownerAddress ?? "",
      argusId: argusId ?? stored.walletMeta?.argusId ?? "",
    },
  });
  return { id: "", result: true };
}

/* ── State ── */
async function handleGetState(): Promise<ExtensionResponse> {
  const stored = await getStored();
  const walletExists = await hasWallet();
  const accounts = await getAccounts();
  const activeAddr = await getActiveAddress();
  const state: ExtensionState & { accounts: WalletAccount[]; activeAddress: string | null } = {
    isSetup: walletExists,
    isUnlocked: isUnlocked(),
    walletMeta: stored.walletMeta,
    sessionKeyMeta: stored.sessionKeyMeta,
    approvedOrigins: stored.approvedOrigins,
    accounts,
    activeAddress: activeAddr,
  };
  return { id: "", result: state };
}

/* ── Balance polling (user-stats SDK REST API) ── */
async function fetchBalances(): Promise<BalanceInfo | null> {
  const stored = await getStored();
  const addr = stored.walletMeta?.smartWalletAddress || stored.walletMeta?.ownerAddress;
  if (!addr) return null;
  try {
    // Fetch balance + holdings in parallel from user-stats API
    const [balRes, holdRes] = await Promise.all([
      fetch(`${WALLET_STATS_API}/api/v1/portfolio/${addr.toLowerCase()}/balance`),
      fetch(`${WALLET_STATS_API}/api/v1/portfolio/${addr.toLowerCase()}/holdings`),
    ]);

    let totalUsd = "0.00";
    let nativeBalance = "0";
    let nativeUsd = "0.00";

    if (balRes.ok) {
      const bal = await balRes.json();
      totalUsd = bal.total_balance_usd ?? "0.00";
      nativeBalance = bal.native_balance ?? "0";
      nativeUsd = bal.native_balance_usd ?? "0.00";
    }

    const holdings: BalanceInfo["holdings"] = [];
    if (holdRes.ok) {
      const holdData = await holdRes.json();
      const items = Array.isArray(holdData) ? holdData : (holdData.holdings ?? []);
      for (const h of items) {
        holdings.push({
          symbol: h.symbol ?? "???",
          name: h.name ?? h.symbol ?? "Unknown",
          balance: h.balance ?? "0",
          valueUsd: h.value_usd ?? "0.00",
          iconUrl: h.icon_url ?? undefined,
        });
      }
    }

    const info: BalanceInfo = { totalUsd, nativeBalance, nativeUsd, holdings, lastUpdated: Date.now() };
    await chrome.storage.local.set({ paxeerBalances: info });
    return info;
  } catch (e) {
    console.error("[paxeer] fetchBalances error:", e);
    return null;
  }
}

async function handleGetBalances(): Promise<ExtensionResponse> {
  const cached = await chrome.storage.local.get("paxeerBalances");
  // Return cache if fresh (< 30s old)
  if (cached.paxeerBalances && Date.now() - cached.paxeerBalances.lastUpdated < 30_000) {
    return { id: "", result: cached.paxeerBalances };
  }
  const fresh = await fetchBalances();
  return { id: "", result: fresh ?? cached.paxeerBalances ?? null };
}

/* ── Activity (user-stats SDK REST API) ── */
async function handleGetActivity(): Promise<ExtensionResponse> {
  const stored = await getStored();
  const addr = stored.walletMeta?.smartWalletAddress || stored.walletMeta?.ownerAddress;
  if (!addr) return { id: "", result: [] };
  try {
    const res = await fetch(
      `${WALLET_STATS_API}/api/v1/portfolio/${addr.toLowerCase()}/transactions?limit=50`,
    );
    if (!res.ok) return { id: "", result: [] };
    const data = await res.json();
    const rawTxs = data.transactions ?? [];
    const txs: TxRecord[] = rawTxs.map((tx: Record<string, unknown>) => ({
      hash: (tx.tx_hash as string) ?? "",
      type: (tx.tx_type as string) ?? "transfer",
      direction: (tx.direction as string) ?? "out",
      value: (tx.value as string) ?? "0",
      from: (tx.from_address as string) ?? "",
      to: (tx.to_address as string) ?? "",
      status: !!tx.status,
      timestamp: (tx.timestamp as string) ?? "",
      gasFee: (tx.gas_fee as string) ?? "0",
    }));
    return { id: "", result: txs };
  } catch (e) {
    console.error("[paxeer] handleGetActivity error:", e);
    return { id: "", result: [] };
  }
}

/* ── Connected apps ── */
async function handleApproveOrigin(origin: string): Promise<ExtensionResponse> {
  const stored = await getStored();
  if (!stored.approvedOrigins.includes(origin)) {
    await setStored({ approvedOrigins: [...stored.approvedOrigins, origin] });
  }
  return { id: "", result: true };
}

async function handleRevokeOrigin(origin: string): Promise<ExtensionResponse> {
  const stored = await getStored();
  await setStored({ approvedOrigins: stored.approvedOrigins.filter((o) => o !== origin) });
  return { id: "", result: true };
}

async function handleGetConnectedApps(): Promise<ExtensionResponse> {
  const stored = await getStored();
  return { id: "", result: stored.approvedOrigins };
}

/* ── Provider RPC (from content script / dApps) ── */
async function handleProviderRpc(req: ExtensionRequest): Promise<ExtensionResponse> {
  const stored = await getStored();

  switch (req.method) {
    case "px_chainId":
    case "eth_chainId":
      return { id: req.id, result: `0x${PAXEER_CHAIN_ID.toString(16)}` };

    case "px_accounts":
    case "eth_accounts": {
      if (!isUnlocked()) return { id: req.id, result: [] };
      const active = await getActiveAddress();
      const sw = stored.walletMeta?.smartWalletAddress;
      const addrs = sw ? [sw, active].filter(Boolean) : [active].filter(Boolean);
      return { id: req.id, result: addrs };
    }

    case "eth_requestAccounts": {
      if (!isUnlocked()) {
        return { id: req.id, error: { code: 4, message: "Wallet is locked." } };
      }
      if (!stored.approvedOrigins.includes(req.origin)) {
        await handleApproveOrigin(req.origin);
      }
      const activeEra = await getActiveAddress();
      const swEra = stored.walletMeta?.smartWalletAddress;
      const addrsEra = swEra ? [swEra, activeEra].filter(Boolean) : [activeEra].filter(Boolean);
      return { id: req.id, result: addrsEra };
    }

    case "px_connect": {
      if (!isUnlocked()) {
        return { id: req.id, error: { code: 4, message: "Wallet is locked." } };
      }
      if (!stored.approvedOrigins.includes(req.origin)) {
        await handleApproveOrigin(req.origin);
      }
      const activePxc = await getActiveAddress();
      return {
        id: req.id,
        result: {
          address: activePxc,
          smartWallet: stored.walletMeta?.smartWalletAddress ?? null,
        },
      };
    }

    case "px_sendTransaction":
    case "eth_sendTransaction": {
      if (!activePrivateKey) {
        return { id: req.id, error: { code: 4, message: "Wallet is locked." } };
      }
      if (!stored.approvedOrigins.includes(req.origin)) {
        return { id: req.id, error: { code: 5, message: "Origin not approved." } };
      }
      try {
        const txParams = req.params[0] as { to: string; value?: string; data?: string; gas?: string };
        const account = privateKeyToAccount(activePrivateKey);
        const client: WalletClient = createWalletClient({
          account,
          chain: paxeerChain,
          transport: http(PAXEER_RPC),
        });
        const hash = await client.sendTransaction({
          to: txParams.to as `0x${string}`,
          value: txParams.value ? BigInt(txParams.value) : 0n,
          data: (txParams.data as `0x${string}`) ?? undefined,
          gas: txParams.gas ? BigInt(txParams.gas) : undefined,
        });
        return { id: req.id, result: hash };
      } catch (e) {
        return { id: req.id, error: { code: -32000, message: (e as Error).message } };
      }
    }

    case "px_signMessage":
    case "personal_sign": {
      if (!activePrivateKey) {
        return { id: req.id, error: { code: 4, message: "Wallet is locked." } };
      }
      if (!stored.approvedOrigins.includes(req.origin)) {
        return { id: req.id, error: { code: 5, message: "Origin not approved." } };
      }
      try {
        const message = req.params[0] as string;
        const account = privateKeyToAccount(activePrivateKey);
        const signature = await account.signMessage({ message });
        return { id: req.id, result: signature };
      } catch (e) {
        return { id: req.id, error: { code: -32000, message: (e as Error).message } };
      }
    }

    default:
      return { id: req.id, error: { code: -32601, message: `Method ${req.method} not found.` } };
  }
}

/* ── Settings ── */
async function handleChangePin(_params: unknown[]): Promise<ExtensionResponse> {
  // PIN change requires re-encrypting all wallet data — complex.
  // For now, delegate to clear + re-import flow.
  return { id: "", error: { code: 99, message: "PIN change requires re-import. Clear data and set up again." } };
}

async function handleClearData(): Promise<ExtensionResponse> {
  currentPin = null;
  activePrivateKey = null;
  if (lockTimer) clearTimeout(lockTimer);
  await chrome.storage.local.remove(["paxeer", "paxeerBalances", "paxeerWallet"]);
  return { id: "", result: true };
}

/* ── Message router ── */
chrome.runtime.onMessage.addListener(
  (req: ExtensionRequest, _sender, sendResponse) => {
    const handle = async (): Promise<ExtensionResponse> => {
      switch (req.method) {
        case "internal_unlock":
          return handleUnlock(req.params[0] as string);
        case "internal_lock":
          return handleLock();
        case "internal_getState":
          return handleGetState();
        case "internal_getBalances":
          return handleGetBalances();
        case "internal_getActivity":
          return handleGetActivity();
        case "internal_getConnectedApps":
          return handleGetConnectedApps();
        case "internal_approveOrigin":
          return handleApproveOrigin(req.params[0] as string);
        case "internal_revokeOrigin":
          return handleRevokeOrigin(req.params[0] as string);
        case "internal_setup":
          return handleCreateWallet(req.params);
        case "internal_changePin":
          return handleChangePin(req.params);
        case "internal_clearData":
          return handleClearData();
        case "internal_createWallet":
          return handleCreateWallet(req.params);
        case "internal_importMnemonic":
          return handleImportMnemonic(req.params);
        case "internal_importPrivateKey":
          return handleImportPrivateKey(req.params);
        case "internal_exportMnemonic":
          return handleExportMnemonic(req.params);
        case "internal_exportPrivateKey":
          return handleExportPrivateKey(req.params);
        case "internal_deriveAccount":
          return handleDeriveAccount(req.params);
        case "internal_getAccounts":
          return handleGetAccounts();
        case "internal_setActiveAccount":
          return handleSetActiveAccount(req.params);
        case "internal_deleteAccount":
          return handleDeleteAccount(req.params);
        case "internal_linkSmartWallet":
          return handleLinkSmartWallet(req.params);
        default:
          return handleProviderRpc(req);
      }
    };

    handle().then((res) => sendResponse({ ...res, id: req.id }));
    return true;
  },
);

/* ── Periodic balance refresh ── */
chrome.alarms.create("balanceRefresh", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "balanceRefresh" && isUnlocked()) {
    fetchBalances();
  }
});

console.log("[paxeer] background service worker started");
