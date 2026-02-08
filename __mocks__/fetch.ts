/**
 * Mock for global fetch used in tests.
 * Import and configure in individual test files as needed.
 */

interface MockResponse {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
}

const defaultResponse: MockResponse = {
  ok: true,
  status: 200,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(""),
};

export function createMockFetch(responses?: Record<string, unknown>): jest.Mock {
  return jest.fn((url: string) => {
    const body = responses?.[url] ?? {};
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    });
  });
}

export function createFailingFetch(status = 500, message = "Internal Server Error"): jest.Mock {
  return jest.fn(() =>
    Promise.resolve({
      ok: false,
      status,
      json: () => Promise.resolve({ error: message }),
      text: () => Promise.resolve(message),
    }),
  );
}

// Default mock — override in individual test files
export const mockFetch = createMockFetch();
