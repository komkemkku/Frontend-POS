import { ref, type Ref } from 'vue'
import { CategoryService } from '@/services/category.service'
import type { 
  Category, 
  CategoryCreateRequest, 
  CategoryUpdateRequest,
  CategoryQueryParams,
  CategoriesResponse
} from '@/types'

export function useCategories() {
  const categories: Ref<Category[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const total: Ref<number> = ref(0)
  const currentPage: Ref<number> = ref(1)
  const totalPages: Ref<number> = ref(0)

  const fetchCategories = async (params: CategoryQueryParams = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response: CategoriesResponse = await CategoryService.getCategories(params)
      
      categories.value = response.items
      total.value = response.total
      currentPage.value = response.page
      totalPages.value = response.totalPages
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching categories:', err)
    } finally {
      loading.value = false
    }
  }

  const getCategoryById = async (id: number): Promise<Category | null> => {
    try {
      loading.value = true
      error.value = null
      
      return await CategoryService.getCategoryById(id)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching category:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (data: CategoryCreateRequest): Promise<Category | null> => {
    try {
      loading.value = true
      error.value = null
      
      const newCategory = await CategoryService.createCategory(data)
      categories.value.unshift(newCategory)
      total.value += 1
      
      return newCategory
    } catch (err: any) {
      error.value = err.message
      console.error('Error creating category:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: number, data: CategoryUpdateRequest): Promise<Category | null> => {
    try {
      loading.value = true
      error.value = null
      
      const updatedCategory = await CategoryService.updateCategory(id, data)
      
      const index = categories.value.findIndex(cat => cat.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
      
      return updatedCategory
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating category:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: number): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null
      
      await CategoryService.deleteCategory(id)
      
      categories.value = categories.value.filter(cat => cat.id !== id)
      total.value -= 1
      
      return true
    } catch (err: any) {
      error.value = err.message
      console.error('Error deleting category:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    categories,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    
    // Actions
    fetchCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError
  }
}
