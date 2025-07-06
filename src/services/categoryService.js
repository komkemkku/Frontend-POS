import api from '@/utils/apiClient'

export const categoryService = {
  // Get all categories with optional pagination and search
  getCategories: async (params = {}) => {
    try {
      const response = await api.get('/categories', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching category:', error)
      throw error
    }
  },

  // Create new category
  createCategory: async (categoryData) => {
    try {
      console.log('Creating category with data:', categoryData)
      const payload = {
        name: categoryData.name,
        description: categoryData.description || '',
        display_order: String(categoryData.display_order || '1')
      }
      console.log('Sending payload to /categories/create:', payload)
      const response = await api.post('/categories/create', payload)
      return response.data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },

  // Update existing category
  updateCategory: async (id, categoryData) => {
    try {
      console.log('Updating category with data:', categoryData)
      const payload = {
        name: categoryData.name,
        description: categoryData.description || '',
        display_order: String(categoryData.display_order || '1')
      }
      console.log(`Sending payload to /categories/${id} via PATCH:`, payload)
      const response = await api.patch(`/categories/${id}`, payload)
      return response.data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      console.log('Deleting category with id:', id)
      const response = await api.delete(`/categories/${id}`)
      console.log('Delete category response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error deleting category:', error)
      console.error('Delete error response:', error.response?.data)
      throw error
    }
  }
}
