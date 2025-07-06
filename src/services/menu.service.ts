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
  static async getMenuItems(params: MenuQueryParams = {}): Promise<MenuItem[]> {
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
      console.log('MenuService: Deleting menu item with ID:', id)
      
      // Try different possible endpoints for delete
      const endpoints = [
        `/menu-items/${id}`,       // RESTful DELETE
        `/menu-items/delete/${id}`, // With delete path
        `/menu-item/${id}`,        // Singular form
        `/menu-item/delete/${id}`, // Singular with delete
        `/api/menu-items/${id}`,   // With /api prefix
        `/api/menu-items/delete/${id}` // With /api prefix and delete
      ]
      
      let lastError: any = null
      let deleteSuccess = false
      
      for (const endpoint of endpoints) {
        try {
          console.log(`MenuService: Trying DELETE ${endpoint}`)
          const response = await api.delete(endpoint)
          console.log(`MenuService: Delete success with ${endpoint}:`, response)
          deleteSuccess = true
          return // Success, exit function
        } catch (error: any) {
          console.log(`MenuService: ${endpoint} failed:`, error.response?.status, error.response?.data)
          lastError = error
          
          // If it's not a 404, don't try other endpoints
          if (error.response?.status !== 404) {
            // Some APIs return 204 No Content or other success codes that might be interpreted as errors
            if (error.response?.status >= 200 && error.response?.status < 300) {
              deleteSuccess = true
              return
            }
            // Also check for 204 No Content which is a common delete response
            if (error.response?.status === 204) {
              deleteSuccess = true
              return
            }
            throw error
          }
        }
      }
      
      // If we get here, all endpoints returned 404
      if (!deleteSuccess) {
        throw lastError
      }
    } catch (error: any) {
      console.error('MenuService: All menu item delete attempts failed:', error)
      console.error('MenuService: Final error response:', error.response)
      
      if (error.response?.status === 404) {
        throw new Error('ไม่พบเมนูที่ต้องการลบ หรือถูกลบไปแล้ว')
      } else if (error.response?.status === 401) {
        throw new Error('กรุณาเข้าสู่ระบบใหม่')
      } else if (error.response?.status === 403) {
        throw new Error('ไม่มีสิทธิ์ในการลบเมนู')
      } else {
        throw new Error(error.response?.data?.status?.message || error.response?.data?.message || 'ไม่สามารถลบเมนูได้')
      }
    }
  }

  // Categories API
  static async getCategories(params: CategoryQueryParams = {}): Promise<Category[]> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.size) queryParams.append('size', params.size.toString())
      if (params.search) queryParams.append('search', params.search)
      
      const queryString = queryParams.toString()
      const baseUrl = '/categories'
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl
      
      console.log('MenuService: Getting categories from:', url)
      const response = await api.get(url)
      console.log('MenuService: Categories response:', response)
      
      // Handle different response structures
      if (response.data.data) {
        return response.data.data
      } else if (Array.isArray(response.data)) {
        return response.data
      } else {
        console.warn('Unexpected response structure:', response.data)
        return []
      }
    } catch (error: any) {
      console.error('MenuService: Get categories error:', error)
      throw new Error(error.response?.data?.status?.message || error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
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
      console.log('MenuService: Creating category with data:', data)
      console.log('MenuService: Using endpoint /categories/create (confirmed from backend)')
      
      // Ensure display_order is sent as string to match backend expectation
      const requestData = {
        name: data.name,
        description: data.description || '',
        display_order: data.display_order || data.sort_order?.toString() || '1'
      }
      
      console.log('MenuService: Sending request data:', requestData)
      const response = await api.post('/categories/create', requestData)
      console.log('MenuService: Create response:', response)
      
      // Handle different response structures
      if (response.data?.data) {
        return response.data.data
      } else if (response.data?.category) {
        return response.data.category
      } else if (response.data && typeof response.data === 'object' && response.data.id) {
        return response.data
      } else {
        console.warn('Unexpected response structure:', response.data)
        return response.data
      }
    } catch (error: any) {
      console.error('MenuService: Create category error:', error)
      console.error('MenuService: Error response:', error.response)
      
      if (error.response?.status === 404) {
        throw new Error('ยังไม่รองรับการสร้างหมวดหมู่ใหม่ (API endpoint ไม่พบ)')
      } else if (error.response?.status === 401) {
        throw new Error('กรุณาเข้าสู่ระบบใหม่')
      } else if (error.response?.status === 403) {
        throw new Error('ไม่มีสิทธิ์ในการสร้างหมวดหมู่')
      } else {
        throw new Error(error.response?.data?.status?.message || error.response?.data?.message || 'ไม่สามารถสร้างหมวดหมู่ได้')
      }
    }
  }

  static async updateCategory(id: number, data: CategoryUpdateRequest): Promise<Category> {
    try {
      console.log('MenuService: Updating category with ID:', id, 'Data:', data)
      console.log('MenuService: Using PATCH /categories/:id (confirmed from backend)')
      
      // Ensure display_order is sent as string to match backend expectation
      const requestData = {
        name: data.name,
        description: data.description || '',
        display_order: data.display_order || data.sort_order?.toString() || '1'
      }
      
      console.log('MenuService: Sending request data:', requestData)
      const response = await api.patch(`/categories/${id}`, requestData)
      console.log('MenuService: Update response:', response)
      
      // Backend returns "Updated successfully" message, not the updated object
      // So we need to fetch the updated category separately
      if (response.data && (response.data === "Updated successfully" || response.data.data === "Updated successfully" || response.status === 200)) {
        console.log('MenuService: Update successful, fetching updated category')
        try {
          const updatedCategory = await this.getCategoryById(id)
          return updatedCategory
        } catch (fetchError) {
          console.warn('MenuService: Could not fetch updated category, returning mock object:', fetchError)
          // Return a mock object with the data we sent
          return {
            id,
            name: data.name || '',
            description: data.description || '',
            display_order: parseInt(data.display_order || '1'),
            is_active: data.is_active ?? true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as Category
        }
      }
      
      // Fallback for other response structures
      if (response.data?.data) {
        return response.data.data
      } else if (response.data?.category) {
        return response.data.category
      } else if (response.data && typeof response.data === 'object' && response.data.id) {
        return response.data
      } else {
        console.warn('Unexpected response structure:', response.data)
        return response.data
      }
    } catch (error: any) {
      console.error('MenuService: Update category error:', error)
      console.error('MenuService: Error response:', error.response)
      
      if (error.response?.status === 404) {
        throw new Error('ไม่พบหมวดหมู่ที่ต้องการแก้ไข')
      } else if (error.response?.status === 401) {
        throw new Error('กรุณาเข้าสู่ระบบใหม่')
      } else if (error.response?.status === 403) {
        throw new Error('ไม่มีสิทธิ์ในการแก้ไขหมวดหมู่')
      } else {
        throw new Error(error.response?.data?.status?.message || error.response?.data?.message || 'ไม่สามารถแก้ไขหมวดหมู่ได้')
      }
    }
  }

  static async deleteCategory(id: number): Promise<void> {
    try {
      console.log('MenuService: Deleting category with ID:', id)
      
      // Try different possible endpoints for delete
      const endpoints = [
        `/categories/${id}`,       // RESTful DELETE
        `/categories/delete/${id}`, // With delete path
        `/category/${id}`,         // Singular form
        `/category/delete/${id}`,  // Singular with delete
        `/api/categories/${id}`,   // With /api prefix
        `/api/categories/delete/${id}` // With /api prefix and delete
      ]
      
      let lastError: any = null
      let deleteSuccess = false
      
      for (const endpoint of endpoints) {
        try {
          console.log(`MenuService: Trying DELETE ${endpoint}`)
          const response = await api.delete(endpoint)
          console.log(`MenuService: Delete success with ${endpoint}:`, response)
          deleteSuccess = true
          return // Success, exit function
        } catch (error: any) {
          console.log(`MenuService: ${endpoint} failed:`, error.response?.status, error.response?.data)
          lastError = error
          
          // If it's not a 404, don't try other endpoints
          if (error.response?.status !== 404) {
            // Some APIs return 204 No Content or other success codes
            if (error.response?.status >= 200 && error.response?.status < 300) {
              deleteSuccess = true
              return
            }
            throw error
          }
        }
      }
      
      // If we get here, all endpoints returned 404
      if (!deleteSuccess) {
        throw lastError
      }
    } catch (error: any) {
      console.error('MenuService: All category delete attempts failed:', error)
      console.error('MenuService: Final error response:', error.response)
      
      if (error.response?.status === 404) {
        throw new Error('ไม่พบหมวดหมู่ที่ต้องการลบ หรือถูกลบไปแล้ว')
      } else if (error.response?.status === 401) {
        throw new Error('กรุณาเข้าสู่ระบบใหม่')
      } else if (error.response?.status === 403) {
        throw new Error('ไม่มีสิทธิ์ในการลบหมวดหมู่')
      } else {
        throw new Error(error.response?.data?.status?.message || error.response?.data?.message || 'ไม่สามารถลบหมวดหมู่ได้')
      }
    }
  }
}

// Create instance for object-style usage
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
