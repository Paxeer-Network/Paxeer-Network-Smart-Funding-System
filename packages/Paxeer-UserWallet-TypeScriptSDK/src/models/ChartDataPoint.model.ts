import { ChartDataPoint } from '../types/ChartDataPoint';

/**
 * Runtime model for ChartDataPoint
 * Provides validation, serialization, and factory methods
 */
export class ChartDataPointModel {
  /**
   * Create a new ChartDataPoint instance with defaults
   */
  static create(data: Partial<ChartDataPoint> = {}): ChartDataPoint {
    return {
      date: data.date ?? '',
      value: data.value ?? '',
    };
  }

  /**
   * Validate a ChartDataPoint object
   */
  static validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Expected an object'] };
    }
    const obj = data as Record<string, unknown>;

    if (obj['date'] === undefined || obj['date'] === null) {
      errors.push('Missing required field: date');
    }
    if (obj['date'] !== undefined && obj['date'] !== null && typeof obj['date'] !== 'string') {
      errors.push('Invalid type for field: date');
    }
    if (obj['value'] === undefined || obj['value'] === null) {
      errors.push('Missing required field: value');
    }
    if (obj['value'] !== undefined && obj['value'] !== null && typeof obj['value'] !== 'string') {
      errors.push('Invalid type for field: value');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: ChartDataPoint): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): ChartDataPoint {
    return ChartDataPointModel.create(json as Partial<ChartDataPoint>);
  }
}
