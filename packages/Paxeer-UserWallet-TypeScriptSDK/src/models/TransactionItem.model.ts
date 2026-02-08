import { TransactionItem } from '../types/TransactionItem';

/**
 * Runtime model for TransactionItem
 * Provides validation, serialization, and factory methods
 */
export class TransactionItemModel {
  /**
   * Create a new TransactionItem instance with defaults
   */
  static create(data: Partial<TransactionItem> = {}): TransactionItem {
    return {
      tx_hash: data.tx_hash ?? '',
      block_number: data.block_number ?? 0,
      timestamp: data.timestamp ?? null,
      from_address: data.from_address ?? '',
      to_address: data.to_address ?? null,
      value: data.value ?? '',
      value_raw: data.value_raw ?? '',
      gas_used: data.gas_used ?? '',
      gas_price: data.gas_price ?? '',
      gas_fee: data.gas_fee ?? '',
      status: data.status ?? false,
      direction: data.direction ?? (undefined as any),
      tx_type: data.tx_type ?? '',
      token_transfers: data.token_transfers ?? [],
    };
  }

  /**
   * Validate a TransactionItem object
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
    if (
      obj['to_address'] !== undefined &&
      obj['to_address'] !== null &&
      typeof obj['to_address'] !== 'string'
    ) {
      errors.push('Invalid type for field: to_address');
    }
    if (obj['value'] === undefined || obj['value'] === null) {
      errors.push('Missing required field: value');
    }
    if (obj['value'] !== undefined && obj['value'] !== null && typeof obj['value'] !== 'string') {
      errors.push('Invalid type for field: value');
    }
    if (obj['value_raw'] === undefined || obj['value_raw'] === null) {
      errors.push('Missing required field: value_raw');
    }
    if (
      obj['value_raw'] !== undefined &&
      obj['value_raw'] !== null &&
      typeof obj['value_raw'] !== 'string'
    ) {
      errors.push('Invalid type for field: value_raw');
    }
    if (obj['gas_used'] === undefined || obj['gas_used'] === null) {
      errors.push('Missing required field: gas_used');
    }
    if (
      obj['gas_used'] !== undefined &&
      obj['gas_used'] !== null &&
      typeof obj['gas_used'] !== 'string'
    ) {
      errors.push('Invalid type for field: gas_used');
    }
    if (obj['gas_price'] === undefined || obj['gas_price'] === null) {
      errors.push('Missing required field: gas_price');
    }
    if (
      obj['gas_price'] !== undefined &&
      obj['gas_price'] !== null &&
      typeof obj['gas_price'] !== 'string'
    ) {
      errors.push('Invalid type for field: gas_price');
    }
    if (obj['gas_fee'] === undefined || obj['gas_fee'] === null) {
      errors.push('Missing required field: gas_fee');
    }
    if (
      obj['gas_fee'] !== undefined &&
      obj['gas_fee'] !== null &&
      typeof obj['gas_fee'] !== 'string'
    ) {
      errors.push('Invalid type for field: gas_fee');
    }
    if (obj['status'] === undefined || obj['status'] === null) {
      errors.push('Missing required field: status');
    }
    if (
      obj['status'] !== undefined &&
      obj['status'] !== null &&
      typeof obj['status'] !== 'boolean'
    ) {
      errors.push('Invalid type for field: status');
    }
    if (obj['direction'] === undefined || obj['direction'] === null) {
      errors.push('Missing required field: direction');
    }
    if (obj['tx_type'] === undefined || obj['tx_type'] === null) {
      errors.push('Missing required field: tx_type');
    }
    if (
      obj['tx_type'] !== undefined &&
      obj['tx_type'] !== null &&
      typeof obj['tx_type'] !== 'string'
    ) {
      errors.push('Invalid type for field: tx_type');
    }
    if (obj['token_transfers'] === undefined || obj['token_transfers'] === null) {
      errors.push('Missing required field: token_transfers');
    }
    if (
      obj['token_transfers'] !== undefined &&
      obj['token_transfers'] !== null &&
      !Array.isArray(obj['token_transfers'])
    ) {
      errors.push('Invalid type for field: token_transfers');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: TransactionItem): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): TransactionItem {
    return TransactionItemModel.create(json as Partial<TransactionItem>);
  }
}
