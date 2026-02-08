import { TokenStats } from '../types/TokenStats';

/**
 * Runtime model for TokenStats
 * Provides validation, serialization, and factory methods
 */
export class TokenStatsModel {
  /**
   * Create a new TokenStats instance with defaults
   */
  static create(data: Partial<TokenStats> = {}): TokenStats {
    return {
      total: data.total ?? 0,
      complete_basic: data.complete_basic ?? 0,
      with_icon: data.with_icon ?? 0,
      with_price: data.with_price ?? 0,
      erc20_count: data.erc20_count ?? 0,
      erc721_count: data.erc721_count ?? 0,
    };
  }

  /**
   * Validate a TokenStats object
   */
  static validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Expected an object'] };
    }
    const obj = data as Record<string, unknown>;

    if (obj['total'] !== undefined && obj['total'] !== null && typeof obj['total'] !== 'number') {
      errors.push('Invalid type for field: total');
    }
    if (
      obj['complete_basic'] !== undefined &&
      obj['complete_basic'] !== null &&
      typeof obj['complete_basic'] !== 'number'
    ) {
      errors.push('Invalid type for field: complete_basic');
    }
    if (
      obj['with_icon'] !== undefined &&
      obj['with_icon'] !== null &&
      typeof obj['with_icon'] !== 'number'
    ) {
      errors.push('Invalid type for field: with_icon');
    }
    if (
      obj['with_price'] !== undefined &&
      obj['with_price'] !== null &&
      typeof obj['with_price'] !== 'number'
    ) {
      errors.push('Invalid type for field: with_price');
    }
    if (
      obj['erc20_count'] !== undefined &&
      obj['erc20_count'] !== null &&
      typeof obj['erc20_count'] !== 'number'
    ) {
      errors.push('Invalid type for field: erc20_count');
    }
    if (
      obj['erc721_count'] !== undefined &&
      obj['erc721_count'] !== null &&
      typeof obj['erc721_count'] !== 'number'
    ) {
      errors.push('Invalid type for field: erc721_count');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: TokenStats): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): TokenStats {
    return TokenStatsModel.create(json as Partial<TokenStats>);
  }
}
