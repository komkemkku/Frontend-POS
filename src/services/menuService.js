import api from '@/utils/apiClient'

export const menuService = {
  // Menu Items API
  async getMenuItems(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page)
      if (params.size) queryParams.append('size', params.size)
      if (params.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/menu-items?${queryParams}` : '/menu-items'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลเมนูได้')
    }
  },

  async getMenuItemById(id) {
    try {
      const response = await api.get(`/menu-items/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลเมนูได้')
    }
  },

  async createMenuItem(data) {
    try {
      const response = await api.post('/menu-items/create', data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถสร้างเมนูได้')
    }
  },

  async updateMenuItem(id, data) {
    try {
      const response = await api.patch(`/menu-items/${id}`, data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถแก้ไขเมนูได้')
    }
  },

  async deleteMenuItem(id) {
    try {
      const response = await api.delete(`/menu-items/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถลบเมนูได้')
    }
  },

  // Categories API
  async getCategories(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page)
      if (params.size) queryParams.append('size', params.size)
      if (params.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/categories?${queryParams}` : '/categories'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
    }
  },

  async getCategoryById(id) {
    try {
      const response = await api.get(`/categories/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
    }
  },

  async createCategory(data) {
    try {
      const response = await api.post('/categories', data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถสร้างหมวดหมู่ได้')
    }
  },

  async updateCategory(id, data) {
    try {
      const response = await api.put(`/categories/${id}`, data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถแก้ไขหมวดหมู่ได้')
    }
  },

  async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถลบหมวดหมู่ได้')
    }
  }
}
