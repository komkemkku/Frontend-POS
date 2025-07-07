// Export all services from a single entry point
export { MenuService, menuService } from './menu.service'
export { DashboardService, dashboardService } from './dashboard.service' 
export { CategoryService, categoryService } from './category.service'
export { StaffService, staffService } from './staff.service'
export { TableService, tableService } from './table.service'

// Default exports for convenience
export { default as MenuServiceClass } from './menu.service'
export { default as DashboardServiceClass } from './dashboard.service'
export { default as CategoryServiceClass } from './category.service'
export { default as StaffServiceClass } from './staff.service'
export { default as TableServiceClass } from './table.service'
