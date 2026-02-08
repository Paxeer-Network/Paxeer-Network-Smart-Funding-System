import { TokenAuditResponse } from '../types/TokenAuditResponse';

/**
 * Runtime model for TokenAuditResponse
 * Provides validation, serialization, and factory methods
 */
export class TokenAuditResponseModel {
  /**
   * Create a new TokenAuditResponse instance with defaults
   */
  static create(data: Partial<TokenAuditResponse> = {}): TokenAuditResponse {
    return {
      total: data.total ?? 0,
      complete_basic: data.complete_basic ?? 0,
      with_icon: data.with_icon ?? 0,
      with_price: data.with_price ?? 0,
      verified: data.verified ?? 0,
      by_type: data.by_type ?? ({} as any),
      needing_enrichment_count: data.needing_enrichment_count ?? 0,
      needing_enrichment_sample: data.needing_enrichment_sample ?? [],
    };
  }

  /**
   * Validate a TokenAuditResponse object
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
      obj['verified'] !== undefined &&
      obj['verified'] !== null &&
      typeof obj['verified'] !== 'number'
    ) {
      errors.push('Invalid type for field: verified');
    }
    if (
      obj['needing_enrichment_count'] !== undefined &&
      obj['needing_enrichment_count'] !== null &&
      typeof obj['needing_enrichment_count'] !== 'number'
    ) {
      errors.push('Invalid type for field: needing_enrichment_count');
    }
    if (
      obj['needing_enrichment_sample'] !== undefined &&
      obj['needing_enrichment_sample'] !== null &&
      !Array.isArray(obj['needing_enrichment_sample'])
    ) {
      errors.push('Invalid type for field: needing_enrichment_sample');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: TokenAuditResponse): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): TokenAuditResponse {
    return TokenAuditResponseModel.create(json as Partial<TokenAuditResponse>);
  }
}
