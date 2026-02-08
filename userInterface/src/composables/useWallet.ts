import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { clearAuthToken } from "@/api/client";

export const useWalletStore = defineStore("wallet", () => {
  const address = ref<string | null>(null);
  const chainId = ref<number | null>(null);
  const walletType = ref<"evm" | "solana" | null>(null);
  const connected = ref(false);
  const connecting = ref(false);
  const error = ref<string | null>(null);
  const wrongChain = ref(false);

  const shortAddress = computed(() => {
    if (!address.value) return "";
    return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`;
  });

  // ── EVM (Paxeer Extension / MetaMask / injected) ────────────────────────

  function getEvmProvider(): any {
    const w = window as any;
    // Prefer Paxeer extension if available, fall back to MetaMask/other
    if (w.paxeer?.isPaxeer) return w.paxeer;
    if (w.ethereum) return w.ethereum;
    throw new Error("No EVM wallet detected. Please install MetaMask or the Paxeer extension.");
  }

  async function connectEvm() {
    const provider = getEvmProvider();

    const accounts: string[] = await provider.request({ method: "eth_requestAccounts" });
    if (!accounts.length) throw new Error("No accounts returned");

    const chainHex: string = await provider.request({ method: "eth_chainId" });
    address.value = accounts[0];
    chainId.value = parseInt(chainHex, 16);
    walletType.value = "evm";
    connected.value = true;
    wrongChain.value = false;

    if (provider.on) {
      provider.on("accountsChanged", (accs: string[]) => {
        if (accs.length === 0) {
          disconnect();
        } else {
          address.value = accs[0];
        }
      });

      provider.on("chainChanged", (newChainHex: string) => {
        const newId = parseInt(newChainHex, 16);
        chainId.value = newId;
        // Signal wrong chain instead of full page reload
        wrongChain.value = true;
      });
    }
  }

  async function signMessageEvm(message: string): Promise<string> {
    const provider = getEvmProvider();
    const signature: string = await provider.request({
      method: "personal_sign",
      params: [message, address.value],
    });
    return signature;
  }

  // ── Solana (Phantom / injected) ────────────────────────────────────────

  function getSolanaProvider(): any {
    const w = window as any;
    const provider = w.phantom?.solana || w.solana;
    if (!provider?.isPhantom) {
      throw new Error("No Solana wallet detected. Please install Phantom or a compatible wallet.");
    }
    return provider;
  }

  async function connectSolana() {
    const provider = getSolanaProvider();
    const resp = await provider.connect();
    const pubkey: string = resp.publicKey.toString();

    address.value = pubkey;
    chainId.value = 0;
    walletType.value = "solana";
    connected.value = true;

    provider.on("disconnect", () => {
      disconnect();
    });

    provider.on("accountChanged", (pk: any) => {
      if (pk) {
        address.value = pk.toString();
      } else {
        disconnect();
      }
    });
  }

  async function signMessageSolana(message: string): Promise<string> {
    const provider = getSolanaProvider();
    const encoded = new TextEncoder().encode(message);
    const { signature } = await provider.signMessage(encoded, "utf8");
    return btoa(String.fromCharCode(...signature));
  }

  // ── Unified interface ──────────────────────────────────────────────────

  async function connect(type: "evm" | "solana" = "evm") {
    error.value = null;
    connecting.value = true;

    try {
      if (type === "solana") {
        await connectSolana();
      } else {
        await connectEvm();
      }
    } catch (err: any) {
      error.value = err.message || "Failed to connect wallet";
      connected.value = false;
    } finally {
      connecting.value = false;
    }
  }

  async function signMessage(message: string): Promise<string> {
    if (walletType.value === "solana") {
      return signMessageSolana(message);
    }
    return signMessageEvm(message);
  }

  function disconnect() {
    if (walletType.value === "solana") {
      try {
        const w = window as any;
        const provider = w.phantom?.solana || w.solana;
        provider?.disconnect?.();
      } catch {
        // ignore
      }
    }

    address.value = null;
    chainId.value = null;
    walletType.value = null;
    connected.value = false;
    wrongChain.value = false;
    clearAuthToken();
  }

  return {
    address,
    chainId,
    walletType,
    connected,
    connecting,
    error,
    wrongChain,
    shortAddress,
    connect,
    signMessage,
    disconnect,
  };
});

/** Backward-compatible composable wrapper */
export function useWallet() {
  return useWalletStore();
}
