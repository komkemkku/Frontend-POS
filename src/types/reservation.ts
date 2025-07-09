export interface Reservation {
  id: number
  table_id: number
  table?: {
    id: number
    table_number: string
    capacity: number
    status: string
  }
  customer_name: string
  customer_phone: string
  customer_email?: string
  reservation_time: string
  number_of_guests: number
  status: ReservationStatus
  notes?: string
  special_requests?: string
  deposit_amount?: number
  deposit_paid?: boolean
  deposit_method?: PaymentMethod
  deposit_reference?: string
  total_estimated_cost?: number
  created_at: string
  updated_at: string
}

export type ReservationStatus = 
  | 'pending'           // รอยืนยัน
  | 'confirmed'         // ยืนยันแล้ว
  | 'deposit_pending'   // รอชำระมัดจำ
  | 'deposit_paid'      // ชำระมัดจำแล้ว
  | 'checked_in'        // เช็คอินแล้ว
  | 'seated'           // นั่งโต๊ะแล้ว
  | 'completed'        // เสร็จสิ้น
  | 'cancelled'        // ยกเลิก
  | 'no_show'          // ไม่มาตามนัด

export type PaymentMethod = 
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'promptpay'
  | 'mobile_banking'

export interface ReservationCreateRequest {
  table_id: number
  customer_name: string
  customer_phone: string
  customer_email?: string
  reservation_time: string
  number_of_guests: number
  notes?: string
  special_requests?: string
  deposit_amount?: number
}

export interface ReservationUpdateRequest {
  id: number
  table_id?: number
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  reservation_time?: string
  number_of_guests?: number
  status?: ReservationStatus
  notes?: string
  special_requests?: string
  deposit_amount?: number
  deposit_paid?: boolean
  deposit_method?: PaymentMethod
  deposit_reference?: string
}

export interface ReservationQueryParams {
  page?: number
  limit?: number
  status?: ReservationStatus
  table_id?: number
  customer_name?: string
  customer_phone?: string
  start_date?: string
  end_date?: string
  date?: string
  has_deposit?: boolean
}

export interface ReservationStats {
  total_reservations: number
  today_reservations: number
  pending_confirmations: number
  deposit_pending: number
  checked_in: number
  completed_today: number
  cancelled_today: number
  no_shows_today: number
  total_deposit_amount: number
  average_party_size: number
}

export interface TimeSlot {
  time: string
  available: boolean
  reserved_count: number
  capacity: number
}

export interface ReservationCalendar {
  date: string
  total_slots: number
  booked_slots: number
  available_slots: number
  reservations: Reservation[]
}

// Constants
export const RESERVATION_STATUSES: Record<ReservationStatus, string> = {
  pending: 'รอยืนยัน',
  confirmed: 'ยืนยันแล้ว',
  deposit_pending: 'รอชำระมัดจำ',
  deposit_paid: 'ชำระมัดจำแล้ว',
  checked_in: 'เช็คอินแล้ว',
  seated: 'นั่งโต๊ะแล้ว',
  completed: 'เสร็จสิ้น',
  cancelled: 'ยกเลิก',
  no_show: 'ไม่มาตามนัด'
}

export const PAYMENT_METHODS: Record<PaymentMethod, string> = {
  cash: 'เงินสด',
  credit_card: 'บัตรเครดิต',
  debit_card: 'บัตรเดบิต',
  bank_transfer: 'โอนเงิน',
  promptpay: 'พร้อมเพย์',
  mobile_banking: 'Mobile Banking'
}
