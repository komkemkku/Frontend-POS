import type { Staff } from './auth'

// Staff related types - reusing Staff interface from auth.ts
export type { Staff }

export interface StaffCreateRequest {
  username: string
  password_hash: string
  full_name: string
  role: string
}

export interface StaffUpdateRequest {
  id?: number
  username: string
  password_hash?: string
  full_name: string
  role: string
}

export interface StaffQueryParams {
  page?: number
  size?: number
  search?: string
}

export interface StaffResponse {
  data: Staff[]
  pagination?: {
    page: number
    size: number
    total: number
  }
}

// Staff roles enum
export enum StaffRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CASHIER = 'cashier',
  WAITER = 'waiter',
  KITCHEN = 'kitchen'
}

export const STAFF_ROLES = [
  { value: StaffRole.ADMIN, label: 'ผู้ดูแลระบบ', color: 'text-red-600 bg-red-50' },
  { value: StaffRole.MANAGER, label: 'ผู้จัดการ', color: 'text-purple-600 bg-purple-50' },
  { value: StaffRole.CASHIER, label: 'แคชเชียร์', color: 'text-blue-600 bg-blue-50' },
  { value: StaffRole.WAITER, label: 'พนักงานเสิร์ฟ', color: 'text-green-600 bg-green-50' },
  { value: StaffRole.KITCHEN, label: 'พนักงานครัว', color: 'text-orange-600 bg-orange-50' }
]
