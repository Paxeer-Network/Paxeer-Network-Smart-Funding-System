/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: { node: true, browser: true, es2022: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "error",
  },
  ignorePatterns: [
    "dist/",
    "build/",
    "node_modules/",
    "smartContracts/artifacts/",
    "smartContracts/cache/",
    "graphIndexer/generated/",
    "graphIndexer/build/",
    "coverage/",
  ],
  overrides: [
    {
      files: ["*.vue"],
      parser: "vue-eslint-parser",
      parserOptions: { parser: "@typescript-eslint/parser" },
      extends: ["plugin:vue/vue3-recommended"],
    },
    {
      files: ["smartContracts/**/*.js"],
      env: { mocha: true },
      globals: { ethers: "readonly", artifacts: "readonly", contract: "readonly" },
    },
  ],
};