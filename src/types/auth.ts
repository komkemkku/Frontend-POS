import type { ApiStatus, ApiResponse, ApiError, BaseEntity } from './common'

// Authentication Types
export interface LoginCredentials {
  username: string
  password: string
}

export interface Staff extends BaseEntity {
  username: string
  name: string
  full_name?: string
  email?: string
  role: string
  position?: string
  phone?: string
}

export interface LoginResponse {
  token: string
  staff: Staff
}

export interface LoginApiResponse {
  status: ApiStatus
  data: LoginResponse
}

export interface LoginResult {
  success: boolean
  error?: string
}

// Re-export common types for convenience
export type { ApiStatus, ApiResponse, ApiError }
