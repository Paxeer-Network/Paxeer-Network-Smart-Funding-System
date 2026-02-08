export interface ChartResponse {
  address: string;
  chart_type: 'portfolio_value' | 'daily_pnl' | 'holdings_count' | 'tx_volume';
  days: number;
  data: { date: string; value: string }[];
}
