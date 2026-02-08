import { PnlHistoryItem } from '../types/PnlHistoryItem';

/**
 * Runtime model for PnlHistoryItem
 * Provides validation, serialization, and factory methods
 */
export class PnlHistoryItemModel {
  /**
   * Create a new PnlHistoryItem instance with defaults
   */
  static create(data: Partial<PnlHistoryItem> = {}): PnlHistoryItem {
    return {
      date: data.date ?? '',
      total_value_usd: data.total_value_usd ?? '',
      native_value_usd: data.native_value_usd ?? '',
      token_value_usd: data.token_value_usd ?? '',
      pnl_usd: data.pnl_usd ?? '',
      pnl_percent: data.pnl_percent ?? '',
    };
  }

  /**
   * Validate a PnlHistoryItem object
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
    if (obj['total_value_usd'] === undefined || obj['total_value_usd'] === null) {
      errors.push('Missing required field: total_value_usd');
    }
    if (
      obj['total_value_usd'] !== undefined &&
      obj['total_value_usd'] !== null &&
      typeof obj['total_value_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: total_value_usd');
    }
    if (obj['native_value_usd'] === undefined || obj['native_value_usd'] === null) {
      errors.push('Missing required field: native_value_usd');
    }
    if (
      obj['native_value_usd'] !== undefined &&
      obj['native_value_usd'] !== null &&
      typeof obj['native_value_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: native_value_usd');
    }
    if (obj['token_value_usd'] === undefined || obj['token_value_usd'] === null) {
      errors.push('Missing required field: token_value_usd');
    }
    if (
      obj['token_value_usd'] !== undefined &&
      obj['token_value_usd'] !== null &&
      typeof obj['token_value_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: token_value_usd');
    }
    if (obj['pnl_usd'] === undefined || obj['pnl_usd'] === null) {
      errors.push('Missing required field: pnl_usd');
    }
    if (
      obj['pnl_usd'] !== undefined &&
      obj['pnl_usd'] !== null &&
      typeof obj['pnl_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: pnl_usd');
    }
    if (obj['pnl_percent'] === undefined || obj['pnl_percent'] === null) {
      errors.push('Missing required field: pnl_percent');
    }
    if (
      obj['pnl_percent'] !== undefined &&
      obj['pnl_percent'] !== null &&
      typeof obj['pnl_percent'] !== 'string'
    ) {
      errors.push('Invalid type for field: pnl_percent');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: PnlHistoryItem): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): PnlHistoryItem {
    return PnlHistoryItemModel.create(json as Partial<PnlHistoryItem>);
  }
}
