// Global Jest setup — runs before all test suites

// Extend default timeout for network-dependent tests
jest.setTimeout(15_000);

// Suppress noisy console output in tests (keep errors)
if (process.env.JEST_SILENT !== "false") {
  global.console.log = jest.fn();
  global.console.info = jest.fn();
  global.console.debug = jest.fn();
}