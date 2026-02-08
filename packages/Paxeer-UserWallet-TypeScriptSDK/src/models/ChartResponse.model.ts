import { ChartResponse } from '../types/ChartResponse';

/**
 * Runtime model for ChartResponse
 * Provides validation, serialization, and factory methods
 */
export class ChartResponseModel {
  /**
   * Create a new ChartResponse instance with defaults
   */
  static create(data: Partial<ChartResponse> = {}): ChartResponse {
    return {
      address: data.address ?? '',
      chart_type: data.chart_type ?? (undefined as any),
      days: data.days ?? 0,
      data: data.data ?? [],
    };
  }

  /**
   * Validate a ChartResponse object
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
    if (obj['chart_type'] === undefined || obj['chart_type'] === null) {
      errors.push('Missing required field: chart_type');
    }
    if (obj['days'] === undefined || obj['days'] === null) {
      errors.push('Missing required field: days');
    }
    if (obj['days'] !== undefined && obj['days'] !== null && typeof obj['days'] !== 'number') {
      errors.push('Invalid type for field: days');
    }
    if (obj['data'] === undefined || obj['data'] === null) {
      errors.push('Missing required field: data');
    }
    if (obj['data'] !== undefined && obj['data'] !== null && !Array.isArray(obj['data'])) {
      errors.push('Invalid type for field: data');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: ChartResponse): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): ChartResponse {
    return ChartResponseModel.create(json as Partial<ChartResponse>);
  }
}
