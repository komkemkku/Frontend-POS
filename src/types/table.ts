// Table Management Types
export interface Table {
  id: number
  table_number: string
  capacity: number
  status: TableStatus
  location?: string
  is_active: boolean
  current_order_id?: number
  current_reservation_id?: number
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

export interface TableQueryParams {
  page?: number
  limit?: number
  status?: TableStatus
  capacity?: number
  location?: string
  is_active?: boolean
}

export interface QRCodeData {
  table_id: number
  table_number: string
  restaurant_url: string
}

export const TABLE_STATUSES: Record<TableStatus, string> = {
  available: 'ว่าง',
  occupied: 'มีลูกค้า',
  reserved: 'จอง',
  maintenance: 'ปิดปรับปรุง'
}
