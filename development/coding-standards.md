# Coding Standards

## General

- **Language**: TypeScript strict mode, ES2022 target
- **Module system**: ESM (`"type": "module"`)
- **Comments**: English only
- **Formatting**: Prettier (see `.prettierrc.js`)
- **Linting**: ESLint + oxlint (see `.eslintrc.js`, `.oxlintrc.json`)
- **Git**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`)

## TypeScript

- Use `strict: true` in all tsconfigs
- Prefer `const` over `let`; never use `var`
- Explicit return types on exported functions
- Use `unknown` over `any` where possible (warn level)
- Use discriminated unions over type assertions

## Vue 3 (userInterface, chromeExtension)

- Always use `<script setup lang="ts">`
- Composition API only — no Options API
- Composables in `composables/` directory, prefixed with `use`
- Pinia stores in `stores/` directory
- Tailwind CSS for styling — no inline styles or CSS modules

## Solidity (smartContracts)

- Solidity 0.8.24, 4-space indent
- **Zero external dependencies** — all custom
- NatSpec comments on all public functions
- Custom errors over `require()` strings
- Events for all state changes

## Express (backendServers)

- Zod for request validation
- Async error handler middleware
- JWT authentication via middleware
- Structured JSON responses: `{ data, error, message }`

## Testing

- Smart contracts: Hardhat test framework (Mocha + Chai + ethers)
- Backend/packages: Jest + ts-jest
- Vue: Vitest (when added)
- Minimum coverage target: 80% for critical paths
