import api from '@/utils/apiClient'
import type { 
  MenuItem, 
  MenuItemCreateRequest, 
  MenuItemUpdateRequest,
  MenuQueryParams,
  MenuItemsResponse,
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryQueryParams,
  CategoriesResponse
} from '@/types'

export class MenuService {
  // Menu Items API
  static async getMenuItems(params: MenuQueryParams = {}): Promise<MenuItemsResponse> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.size) queryParams.append('size', params.size.toString())
      if (params.search) queryParams.append('search', params.search)
      if (params.category_id) queryParams.append('category_id', params.category_id.toString())
      
      const url = queryParams.toString() ? `/menu-items?${queryParams}` : '/menu-items'
      const response = await api.get(url)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลเมนูได้')
    }
  }

  static async getMenuItemById(id: number): Promise<MenuItem> {
    try {
      const response = await api.get(`/menu-items/${id}`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลเมนูได้')
    }
  }

  static async createMenuItem(data: MenuItemCreateRequest): Promise<MenuItem> {
    try {
      const response = await api.post('/menu-items/create', data)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถสร้างเมนูได้')
    }
  }

  static async updateMenuItem(id: number, data: MenuItemUpdateRequest): Promise<MenuItem> {
    try {
      const response = await api.patch(`/menu-items/${id}`, data)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถแก้ไขเมนูได้')
    }
  }

  static async deleteMenuItem(id: number): Promise<void> {
    try {
      await api.delete(`/menu-items/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถลบเมนูได้')
    }
  }

  // Categories API
  static async getCategories(params: CategoryQueryParams = {}): Promise<CategoriesResponse> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.size) queryParams.append('size', params.size.toString())
      if (params.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/categories?${queryParams}` : '/categories'
      const response = await api.get(url)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
    }
  }

  static async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await api.get(`/categories/${id}`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
    }
  }

  static async createCategory(data: CategoryCreateRequest): Promise<Category> {
    try {
      const response = await api.post('/categories', data)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถสร้างหมวดหมู่ได้')
    }
  }

  static async updateCategory(id: number, data: CategoryUpdateRequest): Promise<Category> {
    try {
      const response = await api.put(`/categories/${id}`, data)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถแก้ไขหมวดหมู่ได้')
    }
  }

  static async deleteCategory(id: number): Promise<void> {
    try {
      await api.delete(`/categories/${id}`)
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถลบหมวดหมู่ได้')
    }
  }
}

// Create instance for object-style usage (backward compatibility)
export const menuService = {
  getMenuItems: MenuService.getMenuItems,
  getMenuItemById: MenuService.getMenuItemById,
  createMenuItem: MenuService.createMenuItem,
  updateMenuItem: MenuService.updateMenuItem,
  deleteMenuItem: MenuService.deleteMenuItem,
  getCategories: MenuService.getCategories,
  getCategoryById: MenuService.getCategoryById,
  createCategory: MenuService.createCategory,
  updateCategory: MenuService.updateCategory,
  deleteCategory: MenuService.deleteCategory
}

// Export as default for backward compatibility
export default MenuService
