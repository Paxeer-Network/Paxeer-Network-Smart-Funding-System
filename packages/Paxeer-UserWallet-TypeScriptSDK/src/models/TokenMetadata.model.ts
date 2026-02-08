import { TokenMetadata } from '../types/TokenMetadata';

/**
 * Runtime model for TokenMetadata
 * Provides validation, serialization, and factory methods
 */
export class TokenMetadataModel {
  /**
   * Create a new TokenMetadata instance with defaults
   */
  static create(data: Partial<TokenMetadata> = {}): TokenMetadata {
    return {
      address: data.address ?? '',
      symbol: data.symbol ?? '',
      name: data.name ?? '',
      decimals: data.decimals ?? 0,
      icon_url: data.icon_url ?? null,
      price_usd: data.price_usd ?? null,
      token_type: data.token_type ?? (undefined as any),
    };
  }

  /**
   * Validate a TokenMetadata object
   */
  static validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Expected an object'] };
    }
    const obj = data as Record<string, unknown>;

    if (
      obj['address'] !== undefined &&
      obj['address'] !== null &&
      typeof obj['address'] !== 'string'
    ) {
      errors.push('Invalid type for field: address');
    }
    if (
      obj['symbol'] !== undefined &&
      obj['symbol'] !== null &&
      typeof obj['symbol'] !== 'string'
    ) {
      errors.push('Invalid type for field: symbol');
    }
    if (obj['name'] !== undefined && obj['name'] !== null && typeof obj['name'] !== 'string') {
      errors.push('Invalid type for field: name');
    }
    if (
      obj['decimals'] !== undefined &&
      obj['decimals'] !== null &&
      typeof obj['decimals'] !== 'number'
    ) {
      errors.push('Invalid type for field: decimals');
    }
    if (
      obj['icon_url'] !== undefined &&
      obj['icon_url'] !== null &&
      typeof obj['icon_url'] !== 'string'
    ) {
      errors.push('Invalid type for field: icon_url');
    }
    if (
      obj['price_usd'] !== undefined &&
      obj['price_usd'] !== null &&
      typeof obj['price_usd'] !== 'string'
    ) {
      errors.push('Invalid type for field: price_usd');
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Serialize to JSON-safe object
   */
  static toJSON(data: TokenMetadata): Record<string, unknown> {
    return { ...data };
  }

  /**
   * Deserialize from raw JSON
   */
  static fromJSON(json: Record<string, unknown>): TokenMetadata {
    return TokenMetadataModel.create(json as Partial<TokenMetadata>);
  }
}
