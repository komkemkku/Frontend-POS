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
      console.log('Sending payload:', payload)
      const response = await api.post('/categories', payload)
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
      console.log('Sending payload:', payload)
      const response = await api.put(`/categories/${id}`, payload)
      return response.data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }
}
