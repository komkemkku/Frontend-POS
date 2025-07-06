import { ref, type Ref } from 'vue'
import { MenuService } from '@/services/menu.service'
import type { 
  MenuItem, 
  MenuItemCreateRequest, 
  MenuItemUpdateRequest,
  MenuQueryParams,
  MenuItemsResponse
} from '@/types'

export function useMenuItems() {
  const items: Ref<MenuItem[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  const total: Ref<number> = ref(0)
  const currentPage: Ref<number> = ref(1)
  const totalPages: Ref<number> = ref(0)

  const fetchMenuItems = async (params: MenuQueryParams = {}) => {
    try {
      loading.value = true
      error.value = null
      
      const response: MenuItem[] = await MenuService.getMenuItems(params)
      
      items.value = response
      total.value = response.length
      currentPage.value = 1
      totalPages.value = 1
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching menu items:', err)
    } finally {
      loading.value = false
    }
  }

  const getMenuItemById = async (id: number): Promise<MenuItem | null> => {
    try {
      loading.value = true
      error.value = null
      
      return await MenuService.getMenuItemById(id)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching menu item:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createMenuItem = async (data: MenuItemCreateRequest): Promise<MenuItem | null> => {
    try {
      loading.value = true
      error.value = null
      
      const newItem = await MenuService.createMenuItem(data)
      items.value.unshift(newItem)
      total.value += 1
      
      return newItem
    } catch (err: any) {
      error.value = err.message
      console.error('Error creating menu item:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateMenuItem = async (id: number, data: MenuItemUpdateRequest): Promise<MenuItem | null> => {
    try {
      loading.value = true
      error.value = null
      
      const updatedItem = await MenuService.updateMenuItem(id, data)
      
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      
      return updatedItem
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating menu item:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteMenuItem = async (id: number): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null
      
      await MenuService.deleteMenuItem(id)
      
      items.value = items.value.filter(item => item.id !== id)
      total.value -= 1
      
      return true
    } catch (err: any) {
      error.value = err.message
      console.error('Error deleting menu item:', err)
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
    items,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    
    // Actions
    fetchMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    clearError
  }
}
