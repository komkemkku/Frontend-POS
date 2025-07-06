import type { BaseEntity, PaginationParams, PaginatedResponse } from './common'

// Menu Item Types
export interface MenuItemOptions {
  cold?: boolean
  hot?: boolean
  blended?: boolean
}

export interface MenuItem extends BaseEntity {
  name: string
  description?: string
  price: number
  cost?: number
  category_id: number
  category?: Category
  image_url?: string
  is_available: boolean
  preparation_time?: number
  options?: MenuItemOptions
}

export interface MenuItemCreateRequest {
  name: string
  description?: string
  price: number
  cost?: number
  category_id: number
  image_url?: string
  is_available?: boolean
  preparation_time?: number
}

export interface MenuItemUpdateRequest extends Partial<MenuItemCreateRequest> {}

// Category Types
export interface Category extends BaseEntity {
  name: string
  description?: string
  image_url?: string
  is_active: boolean
  sort_order?: number
  display_order?: number
}

export interface CategoryCreateRequest {
  name: string
  description?: string
  image_url?: string
  is_active?: boolean
  sort_order?: number
  display_order?: string
}

export interface CategoryUpdateRequest extends Partial<CategoryCreateRequest> {}

// API Query Parameters
export interface MenuQueryParams extends PaginationParams {
  category_id?: string | number
}

export interface CategoryQueryParams extends PaginationParams {}

// API Response Types
export interface MenuItemsResponse extends PaginatedResponse<MenuItem> {}
export interface CategoriesResponse extends PaginatedResponse<Category> {}
