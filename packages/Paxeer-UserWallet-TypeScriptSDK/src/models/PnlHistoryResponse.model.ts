import { PnlHistoryResponse } from '../types/PnlHistoryResponse';

/**
 * Runtime model for PnlHistoryResponse
 * Provides validation, serialization, and factory methods
 */
export class PnlHistoryResponseModel {
  /**
   * Create a new PnlHistoryResponse instance with defaults
   */
  static create(data: Partial<PnlHistoryResponse> = {}): PnlHistoryResponse {
    return {
      address: data.address ?? '',
      days_requested: data.days_requested ?? 0,
      history: data.history ?? [],
    };
  }

  /**
   * Validate a PnlHistoryResponse object
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
    if (obj['days_requested'] === undefined || obj['days_requested'] === null) {
      errors.push('Missing required field: days_requested');
    }
    if (
      obj['days_requested'] !== undefined &&
      obj['days_requested'] !== null &&
      typeof obj['days_requested'] !== 'number'
    ) {
      errors.push('Invalid type for field: days_requested');
    }
    if (obj['history'] === undefined || obj['history'] === null) {
      errors.push('Missing required field: history');
    }
    if (obj['history'] !== undefined && obj['history'] !== null && !Array.isArray(obj['history'])) {
      errors.push('Invalid type for field: history');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: PnlHistoryResponse): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): PnlHistoryResponse {
    return PnlHistoryResponseModel.create(json as Partial<PnlHistoryResponse>);
  }
}
