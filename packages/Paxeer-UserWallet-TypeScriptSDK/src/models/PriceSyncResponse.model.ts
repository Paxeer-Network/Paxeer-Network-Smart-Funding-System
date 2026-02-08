import { PriceSyncResponse } from '../types/PriceSyncResponse';

/**
 * Runtime model for PriceSyncResponse
 * Provides validation, serialization, and factory methods
 */
export class PriceSyncResponseModel {
  /**
   * Create a new PriceSyncResponse instance with defaults
   */
  static create(data: Partial<PriceSyncResponse> = {}): PriceSyncResponse {
    return {
      success: data.success ?? false,
      total_tokens: data.total_tokens ?? 0,
      updated: data.updated ?? 0,
      by_source: data.by_source ?? ({} as any),
      native_pax_price: data.native_pax_price ?? '',
    };
  }

  /**
   * Validate a PriceSyncResponse object
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
    if (
      obj['total_tokens'] !== undefined &&
      obj['total_tokens'] !== null &&
      typeof obj['total_tokens'] !== 'number'
    ) {
      errors.push('Invalid type for field: total_tokens');
    }
    if (
      obj['updated'] !== undefined &&
      obj['updated'] !== null &&
      typeof obj['updated'] !== 'number'
    ) {
      errors.push('Invalid type for field: updated');
    }
    if (
      obj['native_pax_price'] !== undefined &&
      obj['native_pax_price'] !== null &&
      typeof obj['native_pax_price'] !== 'string'
    ) {
      errors.push('Invalid type for field: native_pax_price');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: PriceSyncResponse): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): PriceSyncResponse {
    return PriceSyncResponseModel.create(json as Partial<PriceSyncResponse>);
  }
}
