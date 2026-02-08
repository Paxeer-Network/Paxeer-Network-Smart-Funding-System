import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { HDKey } from "@scure/bip32";
import { privateKeyToAccount } from "viem/accounts";
import { encrypt, decrypt } from "./crypto";
import type { WalletAccount, SecureWalletStorage } from "./types";

const STORAGE_KEY = "paxeerWallet";
const BASE_PATH = "m/44'/60'/0'/0";

/* ── Storage helpers ── */
async function getSecure(): Promise<SecureWalletStorage | null> {
  const raw = await chrome.storage.local.get(STORAGE_KEY);
  return raw[STORAGE_KEY] ?? null;
}

async function setSecure(data: SecureWalletStorage): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: data });
}

/* ── Key derivation ── */
function deriveKeyFromSeed(seed: Uint8Array, index: number): `0x${string}` {
  const hdKey = HDKey.fromMasterSeed(seed);
  const derived = hdKey.derive(`${BASE_PATH}/${index}`);
  if (!derived.privateKey) throw new Error("Failed to derive private key");
  const hex = Array.from(derived.privateKey)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex}`;
}

function privateKeyToAddress(pk: `0x${string}`): string {
  return privateKeyToAccount(pk).address;
}

/* ── Public API (called from background worker) ── */

export async function createWallet(pin: string): Promise<{ mnemonic: string; account: WalletAccount }> {
  const mnemonic = generateMnemonic(wordlist);
  const seed = mnemonicToSeedSync(mnemonic);
  const pk = deriveKeyFromSeed(seed, 0);
  const address = privateKeyToAddress(pk);

  const { ciphertext: encryptedMnemonic, salt: _salt1 } = await encrypt(mnemonic, pin);
  const { ciphertext: encryptedPk, salt: _salt2 } = await encrypt(pk, pin);

  // Store salt alongside encrypted data for decryption
  const { ciphertext: emEnc, salt: emSalt } = await encrypt(mnemonic, pin);
  const { ciphertext: pkEnc, salt: pkSalt } = await encrypt(pk, pin);

  const account: WalletAccount = {
    address,
    name: "Account 1",
    derivationPath: `${BASE_PATH}/0`,
    accountIndex: 0,
  };

  const storage: SecureWalletStorage = {
    encryptedMnemonic: JSON.stringify({ c: emEnc, s: emSalt }),
    accounts: [{
      address,
      encryptedPrivateKey: JSON.stringify({ c: pkEnc, s: pkSalt }),
      name: account.name,
      derivationPath: account.derivationPath,
      accountIndex: 0,
    }],
    activeAddress: address,
    nextAccountIndex: 1,
  };

  await setSecure(storage);
  return { mnemonic, account };
}

export async function importFromMnemonic(
  mnemonic: string,
  pin: string,
): Promise<WalletAccount> {
  if (!validateMnemonic(mnemonic, wordlist)) {
    throw new Error("Invalid mnemonic phrase");
  }

  const seed = mnemonicToSeedSync(mnemonic);
  const pk = deriveKeyFromSeed(seed, 0);
  const address = privateKeyToAddress(pk);

  const { ciphertext: emEnc, salt: emSalt } = await encrypt(mnemonic, pin);
  const { ciphertext: pkEnc, salt: pkSalt } = await encrypt(pk, pin);

  const account: WalletAccount = {
    address,
    name: "Account 1",
    derivationPath: `${BASE_PATH}/0`,
    accountIndex: 0,
  };

  const storage: SecureWalletStorage = {
    encryptedMnemonic: JSON.stringify({ c: emEnc, s: emSalt }),
    accounts: [{
      address,
      encryptedPrivateKey: JSON.stringify({ c: pkEnc, s: pkSalt }),
      name: account.name,
      derivationPath: account.derivationPath,
      accountIndex: 0,
    }],
    activeAddress: address,
    nextAccountIndex: 1,
  };

  await setSecure(storage);
  return account;
}

export async function importFromPrivateKey(
  privateKey: string,
  pin: string,
  name = "Imported Account",
): Promise<WalletAccount> {
  const pk = (privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`) as `0x${string}`;
  const address = privateKeyToAddress(pk);

  const { ciphertext: pkEnc, salt: pkSalt } = await encrypt(pk, pin);

  let storage = await getSecure();
  if (!storage) {
    storage = {
      encryptedMnemonic: null,
      accounts: [],
      activeAddress: null,
      nextAccountIndex: 0,
    };
  }

  // Check for duplicates
  if (storage.accounts.some((a) => a.address.toLowerCase() === address.toLowerCase())) {
    throw new Error("Account already exists in wallet");
  }

  const account: WalletAccount = {
    address,
    name,
    derivationPath: "imported",
    accountIndex: -1,
  };

  storage.accounts.push({
    address,
    encryptedPrivateKey: JSON.stringify({ c: pkEnc, s: pkSalt }),
    name,
    derivationPath: "imported",
    accountIndex: -1,
  });

  if (!storage.activeAddress) storage.activeAddress = address;
  await setSecure(storage);
  return account;
}

export async function deriveNextAccount(pin: string, name?: string): Promise<WalletAccount> {
  const storage = await getSecure();
  if (!storage?.encryptedMnemonic) {
    throw new Error("No mnemonic — cannot derive. Import a seed phrase first.");
  }

  const { c, s } = JSON.parse(storage.encryptedMnemonic);
  const mnemonic = await decrypt(c, pin, s);
  const seed = mnemonicToSeedSync(mnemonic);
  const idx = storage.nextAccountIndex;
  const pk = deriveKeyFromSeed(seed, idx);
  const address = privateKeyToAddress(pk);

  const { ciphertext: pkEnc, salt: pkSalt } = await encrypt(pk, pin);

  const account: WalletAccount = {
    address,
    name: name ?? `Account ${idx + 1}`,
    derivationPath: `${BASE_PATH}/${idx}`,
    accountIndex: idx,
  };

  storage.accounts.push({
    address,
    encryptedPrivateKey: JSON.stringify({ c: pkEnc, s: pkSalt }),
    name: account.name,
    derivationPath: account.derivationPath,
    accountIndex: idx,
  });
  storage.nextAccountIndex = idx + 1;
  await setSecure(storage);
  return account;
}

export async function getAccounts(): Promise<WalletAccount[]> {
  const storage = await getSecure();
  if (!storage) return [];
  return storage.accounts.map((a) => ({
    address: a.address,
    name: a.name,
    derivationPath: a.derivationPath,
    accountIndex: a.accountIndex,
  }));
}

export async function getActiveAddress(): Promise<string | null> {
  const storage = await getSecure();
  return storage?.activeAddress ?? null;
}

export async function setActiveAccount(address: string): Promise<void> {
  const storage = await getSecure();
  if (!storage) throw new Error("No wallet");
  storage.activeAddress = address;
  await setSecure(storage);
}

export async function deleteAccount(address: string): Promise<void> {
  const storage = await getSecure();
  if (!storage) return;
  storage.accounts = storage.accounts.filter(
    (a) => a.address.toLowerCase() !== address.toLowerCase(),
  );
  if (storage.activeAddress?.toLowerCase() === address.toLowerCase()) {
    storage.activeAddress = storage.accounts[0]?.address ?? null;
  }
  await setSecure(storage);
}

export async function exportMnemonic(pin: string): Promise<string | null> {
  const storage = await getSecure();
  if (!storage?.encryptedMnemonic) return null;
  const { c, s } = JSON.parse(storage.encryptedMnemonic);
  return decrypt(c, pin, s);
}

export async function exportPrivateKey(address: string, pin: string): Promise<string | null> {
  const storage = await getSecure();
  if (!storage) return null;
  const entry = storage.accounts.find(
    (a) => a.address.toLowerCase() === address.toLowerCase(),
  );
  if (!entry) return null;
  const { c, s } = JSON.parse(entry.encryptedPrivateKey);
  return decrypt(c, pin, s);
}

export async function decryptActivePrivateKey(pin: string): Promise<`0x${string}` | null> {
  const storage = await getSecure();
  if (!storage?.activeAddress) return null;
  const pk = await exportPrivateKey(storage.activeAddress, pin);
  return pk as `0x${string}` | null;
}

export async function hasWallet(): Promise<boolean> {
  const storage = await getSecure();
  return !!(storage && storage.accounts.length > 0);
}

export function isValidMnemonic(mnemonic: string): boolean {
  return validateMnemonic(mnemonic, wordlist);
}
