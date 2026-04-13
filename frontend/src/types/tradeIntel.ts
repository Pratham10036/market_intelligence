export interface TradeMeta {
  generated_at: string;
  files_processed: number;
  row_count: number;
  date_range: {
    min: string | null;
    max: string | null;
  };
  is_sample?: boolean;
}

export interface TradeKpi {
  total_value_usd: number;
  total_quantity: number;
  row_count: number;
  unique_countries: number;
  unique_products: number;
  top_country: string;
  top_product: string;
}

export interface TradeMonthlyPoint {
  month: string;
  value: number;
  quantity: number;
  count: number;
}

export interface TradeBucket {
  name: string;
  value: number;
  quantity: number;
  count: number;
}

export interface TradeTableRow {
  date: string | null;
  product: string;
  category: string;
  country: string;
  value: number;
  quantity: number;
  description?: string | null;
}

export interface TradeData {
  meta: TradeMeta;
  kpi: TradeKpi;
  monthly: TradeMonthlyPoint[];
  country: TradeBucket[];
  category: TradeBucket[];
  product: TradeBucket[];
  table: TradeTableRow[];
}
