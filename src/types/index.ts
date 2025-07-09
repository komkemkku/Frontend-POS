// Export all types from a single entry point
export * from './auth'
export * from './common'
export * from './dashboard'
export * from './menu'
export * from './orders'
export * from './reservation'
export * from './staff'

// Table types - export as is to match component expectations
export type {
  Table,
  TableStatus,
  TableCreateRequest,
  TableUpdateRequest,
  TableQueryParams,
  QRCodeData
} from './table'

export { TABLE_STATUSES } from './table'
