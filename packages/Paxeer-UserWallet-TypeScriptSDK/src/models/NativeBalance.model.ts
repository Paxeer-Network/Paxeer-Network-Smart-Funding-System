import { NativeBalance } from '../types/NativeBalance';

/**
 * Runtime model for NativeBalance
 * Provides validation, serialization, and factory methods
 */
export class NativeBalanceModel {
  /**
   * Create a new NativeBalance instance with defaults
   */
  static create(data: Partial<NativeBalance> = {}): NativeBalance {
    return {
      symbol: data.symbol ?? '',
      balance_raw: data.balance_raw ?? '',
      balance: data.balance ?? '',
      price_usd: data.price_usd ?? null,
      value_usd: data.value_usd ?? null,
    };
  }

  /**
   * Validate a NativeBalance object
   */
  static validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Expected an object'] };
    }
    const obj = data as Record<string, unknown>;

    if (obj['symbol'] === undefined || obj['symbol'] === null) {
      errors.push('Missing required field: symbol');
    }
    if (
      obj['symbol'] !== undefined &&
      obj['symbol'] !== null &&
      typeof obj['symbol'] !== 'string'
    ) {
      errors.push('Invalid type for field: symbol');
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
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: NativeBalance): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): NativeBalance {
    return NativeBalanceModel.create(json as Partial<NativeBalance>);
  }
}
