/** @type {import("jest").Config} */
module.exports = {
  projects: [
    {
      displayName: "backend",
      testMatch: ["<rootDir>/backendServers/src/**/*.test.ts"],
      transform: { "^.+\\.tsx?$": "ts-jest" },
      testEnvironment: "node",
    },
    {
      displayName: "workers",
      testMatch: ["<rootDir>/serviceWorkers/src/**/*.test.ts"],
      transform: { "^.+\\.tsx?$": "ts-jest" },
      testEnvironment: "node",
    },
    {
      displayName: "packages",
      testMatch: ["<rootDir>/packages/*/src/**/*.test.ts"],
      transform: { "^.+\\.tsx?$": "ts-jest" },
      testEnvironment: "node",
    },
  ],
  setupFiles: ["<rootDir>/jest-setup.js"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/coverage/**",
  ],
  coverageDirectory: "<rootDir>/coverage",
};