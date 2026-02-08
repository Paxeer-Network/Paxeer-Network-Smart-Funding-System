export interface TokenStats {
  /** Total number of tokens */
  total?: number;
  /** Tokens with complete basic metadata */
  complete_basic?: number;
  /** Tokens with icon URLs */
  with_icon?: number;
  /** Tokens with price data */
  with_price?: number;
  /** Number of ERC-20 tokens */
  erc20_count?: number;
  /** Number of ERC-721 tokens */
  erc721_count?: number;
}
