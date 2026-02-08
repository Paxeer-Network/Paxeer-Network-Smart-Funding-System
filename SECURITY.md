# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Paxeer Smart Wallets, please report it responsibly.

**DO NOT** open a public GitHub issue for security vulnerabilities.

### Contact

- Email: **security@paxeer.app**
- Response time: within 48 hours

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Scope

| In Scope | Out of Scope |
|---|---|
| Smart contracts (Solidity) | Third-party dependencies (report upstream) |
| Backend API endpoints | Public test/dev environments |
| Chrome extension (provider, background) | Social engineering attacks |
| Authentication & session management | DoS attacks on public RPC |
| Key management & encryption | |

## Smart Contract Security

- All contracts use **zero external dependencies** — custom libs, interfaces, and security
- 336 tests passing with full coverage
- Contracts verified on Paxscan explorer
- PIN-derived encryption: PBKDF2-SHA256 → AES-256-GCM

## Responsible Disclosure

We follow a 90-day responsible disclosure policy. We will:
1. Acknowledge receipt within 48 hours
2. Provide an initial assessment within 7 days
3. Work with you to understand and resolve the issue
4. Credit you in our security acknowledgments (if desired)
