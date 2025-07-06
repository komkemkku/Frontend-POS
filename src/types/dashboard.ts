import type { OrderStatus } from './orders'

// Chart period types
export type ChartPeriod = '7d' | '30d' | '90d'

// Dashboard และ Analytics Types
export interface SalesData {
  date: string
  total_sales: number
  total_orders: number
  average_order_value: number
}

export interface DashboardStats {
  total_revenue: number
  total_orders: number
  total_customers: number
  popular_items: PopularItem[]
  recent_orders: RecentOrder[]
}

// API Response wrapper
export interface DashboardData {
  data: DashboardStats & {
    today_revenue: number
    today_orders: number
    today_customers: number
    yesterday_revenue?: number
    yesterday_orders?: number
    yesterday_customers?: number
    avg_order_time_minutes: number
    last_week_avg_time_minutes?: number
    sales_chart: {
      seven_days: { labels: string[]; data: number[] }
      thirty_days: { labels: string[]; data: number[] }
      ninety_days: { labels: string[]; data: number[] }
    }
  }
}

export interface PopularItem {
  id: number
  name: string
  category?: string
  quantity_sold: number
  sold: number
  revenue: number
}

export interface RecentOrder {
  id: number
  table_number?: string
  customer_name?: string
  total_amount: number
  status: OrderStatus
  created_at: string | number
}

export interface SalesChart {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

// Date Range Types
export interface DateRange {
  start_date: string
  end_date: string
}

export interface DashboardFilters extends DateRange {
  period?: 'today' | 'week' | 'month' | 'year'
}
