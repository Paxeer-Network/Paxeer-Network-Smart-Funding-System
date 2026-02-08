import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  getNonce,
  verifyWallet,
  getUserStatus,
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  onAuthFailure,
  type VerifyResponse,
  type UserStatus,
} from "@/api/client";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(getAuthToken());
  const user = ref<UserStatus["user"] | null>(null);
  const assignmentStatus = ref<UserStatus["assignmentStatus"]>(null);
  const fundingStatus = ref<UserStatus["fundingStatus"]>(null);
  const eligible = ref<boolean | null>(null);
  const qualityTxCount = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const validated = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const signupComplete = computed(() => user.value?.signupComplete ?? false);
  const smartWallet = computed(() => user.value?.smartWallet ?? null);

  // Register global 401 interceptor
  onAuthFailure(() => {
    clearAuth();
  });

  function setToken(t: string) {
    token.value = t;
    setAuthToken(t);
  }

  function clearAuth() {
    token.value = null;
    user.value = null;
    eligible.value = null;
    assignmentStatus.value = null;
    fundingStatus.value = null;
    validated.value = false;
    clearAuthToken();
  }

  /** Validates the stored token by calling the backend. Returns true if valid. */
  async function validateToken(): Promise<boolean> {
    if (!token.value) return false;
    try {
      await fetchStatus();
      validated.value = true;
      return true;
    } catch {
      clearAuth();
      return false;
    }
  }

  async function verifyAndLogin(
    walletAddress: string,
    signFn: (msg: string) => Promise<string>,
    network: string,
    chainId: number,
    chainType: "evm" | "solana" = "evm",
  ): Promise<VerifyResponse> {
    loading.value = true;
    error.value = null;
    try {
      const { message } = await getNonce(walletAddress);
      const signature = await signFn(message);
      const res = await verifyWallet({
        walletAddress,
        signature,
        network,
        chainId,
        chainType,
      });

      setToken(res.token);
      eligible.value = res.eligible ?? res.user?.eligible ?? null;
      qualityTxCount.value = res.qualityTransactions ?? 0;

      if (res.user) {
        user.value = res.user as any;
      }

      return res;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchStatus() {
    if (!token.value) return;
    loading.value = true;
    try {
      const data = await getUserStatus();
      user.value = data.user;
      assignmentStatus.value = data.assignmentStatus;
      fundingStatus.value = data.fundingStatus;
      eligible.value = data.user.eligible;
    } catch (err: any) {
      // 401s are now handled globally by the onAuthFailure interceptor
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    token,
    user,
    assignmentStatus,
    fundingStatus,
    eligible,
    qualityTxCount,
    loading,
    error,
    validated,
    isAuthenticated,
    signupComplete,
    smartWallet,
    setToken,
    clearAuth,
    validateToken,
    verifyAndLogin,
    fetchStatus,
  };
});
