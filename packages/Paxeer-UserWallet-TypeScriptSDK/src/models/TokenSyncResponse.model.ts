import { TokenSyncResponse } from '../types/TokenSyncResponse';

/**
 * Runtime model for TokenSyncResponse
 * Provides validation, serialization, and factory methods
 */
export class TokenSyncResponseModel {
  /**
   * Create a new TokenSyncResponse instance with defaults
   */
  static create(data: Partial<TokenSyncResponse> = {}): TokenSyncResponse {
    return {
      success: data.success ?? false,
      total: data.total ?? 0,
      complete: data.complete ?? 0,
      partial: data.partial ?? 0,
      missing: data.missing ?? 0,
      with_icon: data.with_icon ?? 0,
    };
  }

  /**
   * Validate a TokenSyncResponse object
   */
  static validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Expected an object'] };
    }
    const obj = data as Record<string, unknown>;

    if (
      obj['success'] !== undefined &&
      obj['success'] !== null &&
      typeof obj['success'] !== 'boolean'
    ) {
      errors.push('Invalid type for field: success');
    }
    if (obj['total'] !== undefined && obj['total'] !== null && typeof obj['total'] !== 'number') {
      errors.push('Invalid type for field: total');
    }
    if (
      obj['complete'] !== undefined &&
      obj['complete'] !== null &&
      typeof obj['complete'] !== 'number'
    ) {
      errors.push('Invalid type for field: complete');
    }
    if (
      obj['partial'] !== undefined &&
      obj['partial'] !== null &&
      typeof obj['partial'] !== 'number'
    ) {
      errors.push('Invalid type for field: partial');
    }
    if (
      obj['missing'] !== undefined &&
      obj['missing'] !== null &&
      typeof obj['missing'] !== 'number'
    ) {
      errors.push('Invalid type for field: missing');
    }
    if (
      obj['with_icon'] !== undefined &&
      obj['with_icon'] !== null &&
      typeof obj['with_icon'] !== 'number'
    ) {
      errors.push('Invalid type for field: with_icon');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: TokenSyncResponse): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): TokenSyncResponse {
    return TokenSyncResponseModel.create(json as Partial<TokenSyncResponse>);
  }
}
