// Common API Types
export interface ApiStatus {
  code: number
  message: string
}

export interface ApiResponse<T = any> {
  status: ApiStatus
  data: T
}

export interface PaginationParams {
  page?: string | number
  size?: string | number
  search?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  totalPages: number
}

// Error Types
export interface ApiError {
  response?: {
    data?: {
      status?: ApiStatus
    }
    status?: number
  }
  message?: string
}

// Generic Service Response
export interface ServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// Upload Types
export interface FileUploadResponse {
  url: string
  filename: string
  size: number
}

// Common Form Types
export interface BaseEntity {
  id: number
  created_at: string
  updated_at: string
}
