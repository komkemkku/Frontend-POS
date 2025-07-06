// Table Management Types
export interface Table {
  id: number
  table_number: string
  capacity: number
  status: TableStatus
  location?: string
  is_active: boolean
  current_order_id?: number
  created_at: string
  updated_at: string
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'maintenance'

export interface TableCreateRequest {
  table_number: string
  capacity: number
  location?: string
  is_active?: boolean
}

export interface TableUpdateRequest extends Partial<TableCreateRequest> {
  status?: TableStatus
}

// Reservation Types
export interface Reservation {
  id: number
  table_id: number
  table?: Table
  customer_name: string
  customer_phone: string
  customer_email?: string
  guest_count: number
  reservation_date: string
  reservation_time: string
  status: ReservationStatus
  notes?: string
  created_at: string
  updated_at: string
}

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show'

export interface ReservationCreateRequest {
  table_id: number
  customer_name: string
  customer_phone: string
  customer_email?: string
  guest_count: number
  reservation_date: string
  reservation_time: string
  notes?: string
}

export interface ReservationUpdateRequest extends Partial<ReservationCreateRequest> {
  status?: ReservationStatus
}

// Order Types
export interface Order {
  id: number
  table_id?: number
  table?: Table
  customer_name?: string
  order_number: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  total_amount: number
  payment_status: PaymentStatus
  payment_method?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  menu_item_id: number
  menu_item?: {
    id: number
    name: string
    price: number
  }
  quantity: number
  unit_price: number
  total_price: number
  notes?: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded'

export interface OrderCreateRequest {
  table_id?: number
  customer_name?: string
  items: OrderItemRequest[]
  notes?: string
}

export interface OrderItemRequest {
  menu_item_id: number
  quantity: number
  notes?: string
}

export interface OrderUpdateRequest extends Partial<OrderCreateRequest> {
  status?: OrderStatus
  payment_status?: PaymentStatus
  payment_method?: string
}
