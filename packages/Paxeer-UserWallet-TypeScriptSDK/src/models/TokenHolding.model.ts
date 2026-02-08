import { TokenHolding } from '../types/TokenHolding';

/**
 * Runtime model for TokenHolding
 * Provides validation, serialization, and factory methods
 */
export class TokenHoldingModel {
  /**
   * Create a new TokenHolding instance with defaults
   */
  static create(data: Partial<TokenHolding> = {}): TokenHolding {
    return {
      contract_address: data.contract_address ?? '',
      symbol: data.symbol ?? null,
      name: data.name ?? null,
      decimals: data.decimals ?? 0,
      balance_raw: data.balance_raw ?? '',
      balance: data.balance ?? '',
      price_usd: data.price_usd ?? null,
      value_usd: data.value_usd ?? null,
      icon_url: data.icon_url ?? null,
    };
  }

  /**
   * Validate a TokenHolding object
   */
  static validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Expected an object'] };
    }
    const obj = data as Record<string, unknown>;

    if (obj['contract_address'] === undefined || obj['contract_address'] === null) {
      errors.push('Missing required field: contract_address');
    }
    if (
      obj['contract_address'] !== undefined &&
      obj['contract_address'] !== null &&
      typeof obj['contract_address'] !== 'string'
    ) {
      errors.push('Invalid type for field: contract_address');
    }
    if (
      obj['symbol'] !== undefined &&
      obj['symbol'] !== null &&
      typeof obj['symbol'] !== 'string'
    ) {
      errors.push('Invalid type for field: symbol');
    }
    if (obj['name'] !== undefined && obj['name'] !== null && typeof obj['name'] !== 'string') {
      errors.push('Invalid type for field: name');
    }
    if (obj['decimals'] === undefined || obj['decimals'] === null) {
      errors.push('Missing required field: decimals');
    }
    if (
      obj['decimals'] !== undefined &&
      obj['decimals'] !== null &&
      typeof obj['decimals'] !== 'number'
    ) {
      errors.push('Invalid type for field: decimals');
    }
    if (obj['balance_raw'] === undefined || obj['balance_raw'] === null) {
      errors.push('Missing required field: balance_raw');
    }
    if (
      obj['balance_raw'] !== undefined &&
      obj['balance_raw'] !== null &&
      typeof obj['balance_raw'] !== 'string'
    ) {
      errors.push('Invalid type for field: balance_raw');
    }
    if (obj['balance'] === undefined || obj['balance'] === null) {
      errors.push('Missing required field: balance');
    }
    if (
      obj['balance'] !== undefined &&
      obj['balance'] !== null &&
      typeof obj['balance'] !== 'string'
    ) {
      errors.push('Invalid type for field: balance');
    }
    if (
      obj['price_usd'] !== undefined &&
      obj['price_usd'] !== null &&
      typeof obj['price_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: price_usd');
    }
    if (
      obj['value_usd'] !== undefined &&
      obj['value_usd'] !== null &&
      typeof obj['value_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: value_usd');
    }
    if (
      obj['icon_url'] !== undefined &&
      obj['icon_url'] !== null &&
      typeof obj['icon_url'] !== 'string'
    ) {
      errors.push('Invalid type for field: icon_url');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: TokenHolding): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): TokenHolding {
    return TokenHoldingModel.create(json as Partial<TokenHolding>);
  }
}
