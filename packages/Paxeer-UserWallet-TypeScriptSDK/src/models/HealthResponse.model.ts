import { HealthResponse } from '../types/HealthResponse';

/**
 * Runtime model for HealthResponse
 * Provides validation, serialization, and factory methods
 */
export class HealthResponseModel {
  /**
   * Create a new HealthResponse instance with defaults
   */
  static create(data: Partial<HealthResponse> = {}): HealthResponse {
    return {
      status: data.status ?? (undefined as any),
      version: data.version ?? '',
    };
  }

  /**
   * Validate a HealthResponse object
   */
  static validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Expected an object'] };
    }
    const obj = data as Record<string, unknown>;

    if (obj['status'] === undefined || obj['status'] === null) {
      errors.push('Missing required field: status');
    }
    if (obj['version'] === undefined || obj['version'] === null) {
      errors.push('Missing required field: version');
    }
    if (
      obj['version'] !== undefined &&
      obj['version'] !== null &&
      typeof obj['version'] !== 'string'
    ) {
      errors.push('Invalid type for field: version');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: HealthResponse): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): HealthResponse {
    return HealthResponseModel.create(json as Partial<HealthResponse>);
  }
}
