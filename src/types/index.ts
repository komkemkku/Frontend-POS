// Export all types from a single entry point
export * from './auth'
export * from './common'
export * from './dashboard'
export * from './menu'
export * from './orders'
export * from './staff'

// Table types with explicit naming to avoid conflicts
export type {
  Table as TableEntity,
  TableCreateRequest as TableCreateReq,
  TableUpdateRequest as TableUpdateReq,
  TableQueryParams,
  QRCodeData,
  TABLE_STATUSES
} from './table'
