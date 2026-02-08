export interface TokenAuditResponse {
  total?: number;
  complete_basic?: number;
  with_icon?: number;
  with_price?: number;
  verified?: number;
  by_type?: { erc20?: number; erc721?: number; erc1155?: number };
  needing_enrichment_count?: number;
  needing_enrichment_sample?: {
    address?: string;
    symbol?: string;
    missing_icon?: boolean;
    missing_price?: boolean;
    missing_decimals?: boolean;
  }[];
}
