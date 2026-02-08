import { TransactionResponse } from '../types/TransactionResponse';

/**
 * Runtime model for TransactionResponse
 * Provides validation, serialization, and factory methods
 */
export class TransactionResponseModel {
  /**
   * Create a new TransactionResponse instance with defaults
   */
  static create(data: Partial<TransactionResponse> = {}): TransactionResponse {
    return {
      address: data.address ?? '',
      transactions: data.transactions ?? [],
      token_transfers: data.token_transfers ?? [],
      limit: data.limit ?? 0,
      offset: data.offset ?? 0,
    };
  }

  /**
   * Validate a TransactionResponse object
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
    if (obj['transactions'] === undefined || obj['transactions'] === null) {
      errors.push('Missing required field: transactions');
    }
    if (
      obj['transactions'] !== undefined &&
      obj['transactions'] !== null &&
      !Array.isArray(obj['transactions'])
    ) {
      errors.push('Invalid type for field: transactions');
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
    if (obj['limit'] === undefined || obj['limit'] === null) {
      errors.push('Missing required field: limit');
    }
    if (obj['limit'] !== undefined && obj['limit'] !== null && typeof obj['limit'] !== 'number') {
      errors.push('Invalid type for field: limit');
    }
    if (obj['offset'] === undefined || obj['offset'] === null) {
      errors.push('Missing required field: offset');
    }
    if (
      obj['offset'] !== undefined &&
      obj['offset'] !== null &&
      typeof obj['offset'] !== 'number'
    ) {
      errors.push('Invalid type for field: offset');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: TransactionResponse): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): TransactionResponse {
    return TransactionResponseModel.create(json as Partial<TransactionResponse>);
  }
}
