import { TokenTransferItem } from '../types/TokenTransferItem';

/**
 * Runtime model for TokenTransferItem
 * Provides validation, serialization, and factory methods
 */
export class TokenTransferItemModel {
  /**
   * Create a new TokenTransferItem instance with defaults
   */
  static create(data: Partial<TokenTransferItem> = {}): TokenTransferItem {
    return {
      tx_hash: data.tx_hash ?? '',
      block_number: data.block_number ?? 0,
      timestamp: data.timestamp ?? null,
      from_address: data.from_address ?? '',
      to_address: data.to_address ?? '',
      token_address: data.token_address ?? '',
      token_symbol: data.token_symbol ?? null,
      token_name: data.token_name ?? null,
      token_decimals: data.token_decimals ?? 0,
      amount: data.amount ?? '',
      amount_raw: data.amount_raw ?? '',
      token_type: data.token_type ?? (undefined as any),
      direction: data.direction ?? (undefined as any),
      log_index: data.log_index ?? 0,
    };
  }

  /**
   * Validate a TokenTransferItem object
   */
  static validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Expected an object'] };
    }
    const obj = data as Record<string, unknown>;

    if (obj['tx_hash'] === undefined || obj['tx_hash'] === null) {
      errors.push('Missing required field: tx_hash');
    }
    if (
      obj['tx_hash'] !== undefined &&
      obj['tx_hash'] !== null &&
      typeof obj['tx_hash'] !== 'string'
    ) {
      errors.push('Invalid type for field: tx_hash');
    }
    if (obj['block_number'] === undefined || obj['block_number'] === null) {
      errors.push('Missing required field: block_number');
    }
    if (
      obj['block_number'] !== undefined &&
      obj['block_number'] !== null &&
      typeof obj['block_number'] !== 'number'
    ) {
      errors.push('Invalid type for field: block_number');
    }
    if (
      obj['timestamp'] !== undefined &&
      obj['timestamp'] !== null &&
      typeof obj['timestamp'] !== 'string'
    ) {
      errors.push('Invalid type for field: timestamp');
    }
    if (obj['from_address'] === undefined || obj['from_address'] === null) {
      errors.push('Missing required field: from_address');
    }
    if (
      obj['from_address'] !== undefined &&
      obj['from_address'] !== null &&
      typeof obj['from_address'] !== 'string'
    ) {
      errors.push('Invalid type for field: from_address');
    }
    if (obj['to_address'] === undefined || obj['to_address'] === null) {
      errors.push('Missing required field: to_address');
    }
    if (
      obj['to_address'] !== undefined &&
      obj['to_address'] !== null &&
      typeof obj['to_address'] !== 'string'
    ) {
      errors.push('Invalid type for field: to_address');
    }
    if (obj['token_address'] === undefined || obj['token_address'] === null) {
      errors.push('Missing required field: token_address');
    }
    if (
      obj['token_address'] !== undefined &&
      obj['token_address'] !== null &&
      typeof obj['token_address'] !== 'string'
    ) {
      errors.push('Invalid type for field: token_address');
    }
    if (
      obj['token_symbol'] !== undefined &&
      obj['token_symbol'] !== null &&
      typeof obj['token_symbol'] !== 'string'
    ) {
      errors.push('Invalid type for field: token_symbol');
    }
    if (
      obj['token_name'] !== undefined &&
      obj['token_name'] !== null &&
      typeof obj['token_name'] !== 'string'
    ) {
      errors.push('Invalid type for field: token_name');
    }
    if (obj['token_decimals'] === undefined || obj['token_decimals'] === null) {
      errors.push('Missing required field: token_decimals');
    }
    if (
      obj['token_decimals'] !== undefined &&
      obj['token_decimals'] !== null &&
      typeof obj['token_decimals'] !== 'number'
    ) {
      errors.push('Invalid type for field: token_decimals');
    }
    if (obj['amount'] === undefined || obj['amount'] === null) {
      errors.push('Missing required field: amount');
    }
    if (
      obj['amount'] !== undefined &&
      obj['amount'] !== null &&
      typeof obj['amount'] !== 'string'
    ) {
      errors.push('Invalid type for field: amount');
    }
    if (obj['amount_raw'] === undefined || obj['amount_raw'] === null) {
      errors.push('Missing required field: amount_raw');
    }
    if (
      obj['amount_raw'] !== undefined &&
      obj['amount_raw'] !== null &&
      typeof obj['amount_raw'] !== 'string'
    ) {
      errors.push('Invalid type for field: amount_raw');
    }
    if (obj['token_type'] === undefined || obj['token_type'] === null) {
      errors.push('Missing required field: token_type');
    }
    if (obj['direction'] === undefined || obj['direction'] === null) {
      errors.push('Missing required field: direction');
    }
    if (obj['log_index'] === undefined || obj['log_index'] === null) {
      errors.push('Missing required field: log_index');
    }
    if (
      obj['log_index'] !== undefined &&
      obj['log_index'] !== null &&
      typeof obj['log_index'] !== 'number'
    ) {
      errors.push('Invalid type for field: log_index');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: TokenTransferItem): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): TokenTransferItem {
    return TokenTransferItemModel.create(json as Partial<TokenTransferItem>);
  }
}
