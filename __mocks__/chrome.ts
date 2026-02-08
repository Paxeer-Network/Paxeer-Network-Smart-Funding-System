/**
 * Mock for chrome.* APIs used by the Chrome extension in tests.
 */

const storageMock: Record<string, unknown> = {};

export const chrome = {
  runtime: {
    sendMessage: jest.fn().mockResolvedValue({}),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    getURL: jest.fn((path: string) => `chrome-extension://mock-id/${path}`),
    id: "mock-extension-id",
  },
  storage: {
    local: {
      get: jest.fn((keys: string | string[]) => {
        if (typeof keys === "string") {
          return Promise.resolve({ [keys]: storageMock[keys] });
        }
        const result: Record<string, unknown> = {};
        for (const k of keys) result[k] = storageMock[k];
        return Promise.resolve(result);
      }),
      set: jest.fn((items: Record<string, unknown>) => {
        Object.assign(storageMock, items);
        return Promise.resolve();
      }),
      remove: jest.fn((keys: string | string[]) => {
        const arr = typeof keys === "string" ? [keys] : keys;
        for (const k of arr) delete storageMock[k];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        for (const k of Object.keys(storageMock)) delete storageMock[k];
        return Promise.resolve();
      }),
    },
  },
  alarms: {
    create: jest.fn(),
    clear: jest.fn(),
    onAlarm: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
};

// Make it available globally for extension tests
(globalThis as any).chrome = chrome;
