// ── Paxeer SDK Error Classes ─────────────────────────────────────────────────

export class PaxeerError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'PaxeerError';
  }
}

export class WalletNotFoundError extends PaxeerError {
  constructor(owner: string) {
    super(
      `No SmartWallet found for EOA ${owner}. User may not have been assigned a wallet yet.`,
      'WALLET_NOT_FOUND',
    );
    this.name = 'WalletNotFoundError';
  }
}

export class WalletNotConnectedError extends PaxeerError {
  constructor() {
    super('No wallet connected. Call connect() first.', 'WALLET_NOT_CONNECTED');
    this.name = 'WalletNotConnectedError';
  }
}

export class SessionExpiredError extends PaxeerError {
  constructor() {
    super(
      'Session key has expired. Reconnect to create a new session.',
      'SESSION_EXPIRED',
    );
    this.name = 'SessionExpiredError';
  }
}

export class SessionNotFoundError extends PaxeerError {
  constructor() {
    super(
      'No active session key found. Connect first to register a session.',
      'SESSION_NOT_FOUND',
    );
    this.name = 'SessionNotFoundError';
  }
}

export class InsufficientPermissionsError extends PaxeerError {
  constructor(required: number, actual: number) {
    super(
      `Session key has insufficient permissions. Required: ${required}, actual: ${actual}`,
      'INSUFFICIENT_PERMISSIONS',
    );
    this.name = 'InsufficientPermissionsError';
  }
}

export class InsufficientBalanceError extends PaxeerError {
  constructor(required: bigint, available: bigint) {
    super(
      `SmartWallet has insufficient balance. Required: ${required}, available: ${available}`,
      'INSUFFICIENT_BALANCE',
    );
    this.name = 'InsufficientBalanceError';
  }
}

export class TransactionFailedError extends PaxeerError {
  constructor(
    public to: string,
    public value: bigint,
    public reason?: string,
  ) {
    super(
      `Transaction to ${to} failed${reason ? `: ${reason}` : ''}`,
      'TRANSACTION_FAILED',
    );
    this.name = 'TransactionFailedError';
  }
}

export class ProviderError extends PaxeerError {
  constructor(message: string) {
    super(message, 'PROVIDER_ERROR');
    this.name = 'ProviderError';
  }
}

export class ChainMismatchError extends PaxeerError {
  constructor(expected: number, actual: number) {
    super(
      `Connected to chain ${actual} but expected chain ${expected} (Paxeer Network)`,
      'CHAIN_MISMATCH',
    );
    this.name = 'ChainMismatchError';
  }
}
