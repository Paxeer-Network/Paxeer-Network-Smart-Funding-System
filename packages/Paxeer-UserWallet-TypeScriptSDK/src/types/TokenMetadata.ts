export interface TokenMetadata {
  address?: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  icon_url?: string | null;
  price_usd?: string | null;
  token_type?: 'ERC-20' | 'ERC-721' | 'ERC-1155';
}
