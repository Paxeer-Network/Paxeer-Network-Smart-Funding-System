# ADR-001: Zero External Dependencies for Smart Contracts

## Status
**Accepted**

## Context
Most Solidity projects use OpenZeppelin or similar libraries for common patterns
(Ownable, ReentrancyGuard, ERC-20, etc.). While convenient, this creates:
- Supply chain risk (compromised dependency = compromised contracts)
- Bloated bytecode from unused inherited functionality
- Difficulty auditing the full dependency tree
- Version lock-in and upgrade friction

## Decision
All smart contract libraries, interfaces, and security mechanisms in the Paxeer
Funding platform are custom-built with zero external dependencies.

## Consequences
- **Positive**: Full control over bytecode, easier auditing, no supply chain risk
- **Positive**: Minimal contract size, lower deployment gas costs
- **Negative**: More initial development effort
- **Negative**: Must maintain custom implementations of standard patterns
- **Mitigation**: Comprehensive test suite (336 tests) covers all custom code
