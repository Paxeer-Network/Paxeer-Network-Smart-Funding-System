import { BalanceResponse } from '../types/BalanceResponse';

/**
 * Runtime model for BalanceResponse
 * Provides validation, serialization, and factory methods
 */
export class BalanceResponseModel {
  /**
   * Create a new BalanceResponse instance with defaults
   */
  static create(data: Partial<BalanceResponse> = {}): BalanceResponse {
    return {
      address: data.address ?? '',
      native_balance_usd: data.native_balance_usd ?? '',
      token_balance_usd: data.token_balance_usd ?? '',
      total_balance_usd: data.total_balance_usd ?? '',
      native_balance: data.native_balance ?? '',
      token_count: data.token_count ?? 0,
      daily_pnl_usd: data.daily_pnl_usd ?? null,
      daily_pnl_percent: data.daily_pnl_percent ?? null,
      computed_at: data.computed_at ?? '',
    };
  }

  /**
   * Validate a BalanceResponse object
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
    if (obj['native_balance_usd'] === undefined || obj['native_balance_usd'] === null) {
      errors.push('Missing required field: native_balance_usd');
    }
    if (
      obj['native_balance_usd'] !== undefined &&
      obj['native_balance_usd'] !== null &&
      typeof obj['native_balance_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: native_balance_usd');
    }
    if (obj['token_balance_usd'] === undefined || obj['token_balance_usd'] === null) {
      errors.push('Missing required field: token_balance_usd');
    }
    if (
      obj['token_balance_usd'] !== undefined &&
      obj['token_balance_usd'] !== null &&
      typeof obj['token_balance_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: token_balance_usd');
    }
    if (obj['total_balance_usd'] === undefined || obj['total_balance_usd'] === null) {
      errors.push('Missing required field: total_balance_usd');
    }
    if (
      obj['total_balance_usd'] !== undefined &&
      obj['total_balance_usd'] !== null &&
      typeof obj['total_balance_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: total_balance_usd');
    }
    if (obj['native_balance'] === undefined || obj['native_balance'] === null) {
      errors.push('Missing required field: native_balance');
    }
    if (
      obj['native_balance'] !== undefined &&
      obj['native_balance'] !== null &&
      typeof obj['native_balance'] !== 'string'
    ) {
      errors.push('Invalid type for field: native_balance');
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
    if (
      obj['daily_pnl_usd'] !== undefined &&
      obj['daily_pnl_usd'] !== null &&
      typeof obj['daily_pnl_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: daily_pnl_usd');
    }
    if (
      obj['daily_pnl_percent'] !== undefined &&
      obj['daily_pnl_percent'] !== null &&
      typeof obj['daily_pnl_percent'] !== 'string'
    ) {
      errors.push('Invalid type for field: daily_pnl_percent');
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
  static toJSON(data: BalanceResponse): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): BalanceResponse {
    return BalanceResponseModel.create(json as Partial<BalanceResponse>);
  }
}
