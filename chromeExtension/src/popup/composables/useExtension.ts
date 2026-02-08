import { ref, readonly } from "vue";
import { sendToBackground } from "@/shared/messages";
import type { ExtensionState, BalanceInfo, TxRecord, WalletAccount } from "@/shared/types";

interface FullState extends ExtensionState {
  accounts: WalletAccount[];
  activeAddress: string | null;
}

const state = ref<FullState>({
  isSetup: false,
  isUnlocked: false,
  walletMeta: null,
  sessionKeyMeta: null,
  approvedOrigins: [],
  accounts: [],
  activeAddress: null,
});

const balances = ref<BalanceInfo | null>(null);
const activity = ref<TxRecord[]>([]);
const loading = ref(false);
const error = ref("");

async function refreshState() {
  const res = await sendToBackground("internal_getState");
  if (res.result) state.value = res.result as FullState;
}

/* ── Auth ── */
async function unlock(pin: string): Promise<boolean> {
  error.value = "";
  loading.value = true;
  const res = await sendToBackground("internal_unlock", [pin]);
  loading.value = false;
  if (res.error) { error.value = res.error.message; return false; }
  await refreshState();
  return true;
}

async function lock() {
  await sendToBackground("internal_lock");
  await refreshState();
}

/* ── Wallet creation / import ── */
async function createWallet(pin: string): Promise<{ mnemonic: string; account: WalletAccount } | null> {
  error.value = "";
  loading.value = true;
  const res = await sendToBackground("internal_createWallet", [pin]);
  loading.value = false;
  if (res.error) { error.value = res.error.message; return null; }
  await refreshState();
  return res.result as { mnemonic: string; account: WalletAccount };
}

async function importMnemonic(mnemonic: string, pin: string): Promise<WalletAccount | null> {
  error.value = "";
  loading.value = true;
  const res = await sendToBackground("internal_importMnemonic", [mnemonic, pin]);
  loading.value = false;
  if (res.error) { error.value = res.error.message; return null; }
  await refreshState();
  return res.result as WalletAccount;
}

async function importPrivateKey(privateKey: string, pin: string, name?: string): Promise<WalletAccount | null> {
  error.value = "";
  loading.value = true;
  const res = await sendToBackground("internal_importPrivateKey", [privateKey, pin, name]);
  loading.value = false;
  if (res.error) { error.value = res.error.message; return null; }
  await refreshState();
  return res.result as WalletAccount;
}

/* ── Account management ── */
async function deriveAccount(name?: string): Promise<WalletAccount | null> {
  error.value = "";
  const res = await sendToBackground("internal_deriveAccount", [name]);
  if (res.error) { error.value = res.error.message; return null; }
  await refreshState();
  return res.result as WalletAccount;
}

async function setActiveAccount(address: string) {
  await sendToBackground("internal_setActiveAccount", [address]);
  await refreshState();
}

async function deleteAccount(address: string) {
  await sendToBackground("internal_deleteAccount", [address]);
  await refreshState();
}

/* ── Export ── */
async function exportMnemonicFn(pin: string): Promise<string | null> {
  error.value = "";
  const res = await sendToBackground("internal_exportMnemonic", [pin]);
  if (res.error) { error.value = res.error.message; return null; }
  return res.result as string;
}

async function exportPrivateKeyFn(address: string, pin: string): Promise<string | null> {
  error.value = "";
  const res = await sendToBackground("internal_exportPrivateKey", [address, pin]);
  if (res.error) { error.value = res.error.message; return null; }
  return res.result as string;
}

/* ── Smart Wallet link ── */
async function linkSmartWallet(smartWalletAddress: string, argusId?: string) {
  await sendToBackground("internal_linkSmartWallet", [smartWalletAddress, argusId]);
  await refreshState();
}

/* ── Data ── */
async function fetchBalances() {
  const res = await sendToBackground("internal_getBalances");
  if (res.result) balances.value = res.result as BalanceInfo;
}

async function fetchActivity() {
  const res = await sendToBackground("internal_getActivity");
  if (res.result) activity.value = res.result as TxRecord[];
}

async function revokeOrigin(origin: string) {
  await sendToBackground("internal_revokeOrigin", [origin]);
  await refreshState();
}

async function clearData() {
  await sendToBackground("internal_clearData");
  await refreshState();
}

export function useExtension() {
  return {
    state: readonly(state),
    balances: readonly(balances),
    activity: readonly(activity),
    loading: readonly(loading),
    error,
    refreshState,
    unlock,
    lock,
    createWallet,
    importMnemonic,
    importPrivateKey,
    deriveAccount,
    setActiveAccount,
    deleteAccount,
    exportMnemonic: exportMnemonicFn,
    exportPrivateKey: exportPrivateKeyFn,
    linkSmartWallet,
    fetchBalances,
    fetchActivity,
    revokeOrigin,
    clearData,
  };
}
