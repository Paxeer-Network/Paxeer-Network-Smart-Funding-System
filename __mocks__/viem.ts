/**
 * Mock for viem library used in backend, workers, and extension tests.
 */

export const createPublicClient = jest.fn(() => ({
  getBalance: jest.fn().mockResolvedValue(0n),
  readContract: jest.fn().mockResolvedValue(undefined),
  getTransactionCount: jest.fn().mockResolvedValue(0),
  waitForTransactionReceipt: jest.fn().mockResolvedValue({ status: "success" }),
}));

export const createWalletClient = jest.fn(() => ({
  sendTransaction: jest.fn().mockResolvedValue("0xmocktxhash"),
  signMessage: jest.fn().mockResolvedValue("0xmocksignature"),
  writeContract: jest.fn().mockResolvedValue("0xmocktxhash"),
}));

export const http = jest.fn(() => ({}));

export const defineChain = jest.fn((config: any) => config);

export const privateKeyToAccount = jest.fn((key: string) => ({
  address: "0x913ec3Dd4bb5512631Ffc95E5633ecB9BcEB0c36" as const,
  signMessage: jest.fn().mockResolvedValue("0xmocksignature"),
  signTransaction: jest.fn().mockResolvedValue("0xmocksignedtx"),
}));

export const parseEther = jest.fn((value: string) => BigInt(Math.floor(parseFloat(value) * 1e18)));
export const formatEther = jest.fn((value: bigint) => (Number(value) / 1e18).toString());
export const isAddress = jest.fn((addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr));
export const getAddress = jest.fn((addr: string) => addr);
