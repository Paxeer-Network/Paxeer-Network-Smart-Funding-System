import { Portfolio } from '../types/Portfolio';

/**
 * Runtime model for Portfolio
 * Provides validation, serialization, and factory methods
 */
export class PortfolioModel {
  /**
   * Create a new Portfolio instance with defaults
   */
  static create(data: Partial<Portfolio> = {}): Portfolio {
    return {
      address: data.address ?? '',
      native_balance: data.native_balance ?? ({} as any),
      token_holdings: data.token_holdings ?? [],
      total_value_usd: data.total_value_usd ?? null,
      token_count: data.token_count ?? 0,
      transaction_count: data.transaction_count ?? 0,
      transfer_count: data.transfer_count ?? 0,
      computed_at: data.computed_at ?? '',
    };
  }

  /**
   * Validate a Portfolio object
   */
  static validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Expected an object'] };
    }
    const obj = data as Record<string, unknown>;

    if (obj['address'] === undefined || obj['address'] === null) {
      errors.push('Missing required field: address');
    }
    if (
      obj['address'] !== undefined &&
      obj['address'] !== null &&
      typeof obj['address'] !== 'string'
    ) {
      errors.push('Invalid type for field: address');
    }
    if (obj['native_balance'] === undefined || obj['native_balance'] === null) {
      errors.push('Missing required field: native_balance');
    }
    if (obj['token_holdings'] === undefined || obj['token_holdings'] === null) {
      errors.push('Missing required field: token_holdings');
    }
    if (
      obj['token_holdings'] !== undefined &&
      obj['token_holdings'] !== null &&
      !Array.isArray(obj['token_holdings'])
    ) {
      errors.push('Invalid type for field: token_holdings');
    }
    if (
      obj['total_value_usd'] !== undefined &&
      obj['total_value_usd'] !== null &&
      typeof obj['total_value_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: total_value_usd');
    }
    if (obj['token_count'] === undefined || obj['token_count'] === null) {
      errors.push('Missing required field: token_count');
    }
    if (
      obj['token_count'] !== undefined &&
      obj['token_count'] !== null &&
      typeof obj['token_count'] !== 'number'
    ) {
      errors.push('Invalid type for field: token_count');
    }
    if (obj['transaction_count'] === undefined || obj['transaction_count'] === null) {
      errors.push('Missing required field: transaction_count');
    }
    if (
      obj['transaction_count'] !== undefined &&
      obj['transaction_count'] !== null &&
      typeof obj['transaction_count'] !== 'number'
    ) {
      errors.push('Invalid type for field: transaction_count');
    }
    if (obj['transfer_count'] === undefined || obj['transfer_count'] === null) {
      errors.push('Missing required field: transfer_count');
    }
    if (
      obj['transfer_count'] !== undefined &&
      obj['transfer_count'] !== null &&
      typeof obj['transfer_count'] !== 'number'
    ) {
      errors.push('Invalid type for field: transfer_count');
    }
    if (obj['computed_at'] === undefined || obj['computed_at'] === null) {
      errors.push('Missing required field: computed_at');
    }
    if (
      obj['computed_at'] !== undefined &&
      obj['computed_at'] !== null &&
      typeof obj['computed_at'] !== 'string'
    ) {
      errors.push('Invalid type for field: computed_at');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: Portfolio): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): Portfolio {
    return PortfolioModel.create(json as Partial<Portfolio>);
  }
}
