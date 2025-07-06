import api from '@/utils/apiClient'
import type { 
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryQueryParams,
  CategoriesResponse
} from '@/types'

// Extended interface สำหรับ legacy API
interface LegacyCategoryCreateRequest {
  name: string
  description?: string
  display_order?: string | number
}

interface LegacyCategoryUpdateRequest extends LegacyCategoryCreateRequest {}

export class CategoryService {
  /**
   * Get all categories with optional pagination and search
   */
  static async getCategories(params: CategoryQueryParams = {}): Promise<CategoriesResponse> {
    try {
      const response = await api.get('/categories', { params })
      return response.data.data
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
    }
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await api.get(`/categories/${id}`)
      return response.data.data
    } catch (error: any) {
      console.error('Error fetching category:', error)
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
    }
  }

  /**
   * Create new category
   */
  static async createCategory(categoryData: CategoryCreateRequest): Promise<Category> {
    try {
      console.log('Creating category with data:', categoryData)
      
      // Transform to legacy API format
      const payload: LegacyCategoryCreateRequest = {
        name: categoryData.name,
        description: categoryData.description || '',
        display_order: String(categoryData.sort_order || 1)
      }
      
      console.log('Sending payload to /categories/create:', payload)
      const response = await api.post('/categories/create', payload)
      return response.data.data
    } catch (error: any) {
      console.error('Error creating category:', error)
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถสร้างหมวดหมู่ได้')
    }
  }

  /**
   * Update existing category
   */
  static async updateCategory(id: number, categoryData: CategoryUpdateRequest): Promise<Category> {
    try {
      console.log('Updating category with data:', categoryData)
      
      // Transform to legacy API format
      const payload: LegacyCategoryUpdateRequest = {
        name: categoryData.name!,
        description: categoryData.description || '',
        display_order: String(categoryData.sort_order || 1)
      }
      
      console.log(`Sending payload to /categories/${id} via PATCH:`, payload)
      const response = await api.patch(`/categories/${id}`, payload)
      return response.data.data
    } catch (error: any) {
      console.error('Error updating category:', error)
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถแก้ไขหมวดหมู่ได้')
    }
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: number): Promise<void> {
    try {
      console.log('Deleting category with id:', id)
      const response = await api.delete(`/categories/${id}`)
      console.log('Delete category response:', response.data)
    } catch (error: any) {
      console.error('Error deleting category:', error)
      console.error('Delete error response:', error.response?.data)
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถลบหมวดหมู่ได้')
    }
  }
}

// Create instance for object-style usage (backward compatibility)
export const categoryService = {
  getCategories: CategoryService.getCategories,
  getCategoryById: CategoryService.getCategoryById,
  createCategory: CategoryService.createCategory,
  updateCategory: CategoryService.updateCategory,
  deleteCategory: CategoryService.deleteCategory
}

// Export as default
export default CategoryService
