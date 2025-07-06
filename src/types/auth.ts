import type { ApiStatus, ApiResponse, ApiError, BaseEntity } from './common'

// Authentication Types
export interface LoginCredentials {
  username: string
  password: string
}

export interface Staff extends BaseEntity {
  ID?: number
  UserName: string
  username?: string // For compatibility
  name?: string     // For compatibility
  FullName: string
  full_name?: string // For compatibility
  email?: string
  Role: string
  role?: string      // For compatibility
  position?: string
  phone?: string
  PasswordHash?: string
  password_hash?: string // For compatibility
  CreatedAt?: number
  UpdatedAt?: number
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
