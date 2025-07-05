import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/apiClient'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null
      
      console.log('Login request to:', '/staff/login')
      console.log('Credentials:', { username: credentials.username })
      
      const response = await api.post('/staff/login', credentials)
      
      console.log('Login response:', response.data)
      
      if (response.data.status.code === 200) {
        token.value = response.data.data.token
        user.value = response.data.data.staff
        
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('auth_user', JSON.stringify(user.value))
        
        console.log('Login successful, user:', user.value)
        return { success: true }
      } else {
        throw new Error(response.data.status.message || 'เข้าสู่ระบบไม่สำเร็จ')
      }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.response?.data?.status?.message || err.message || 'เกิดข้อผิดพลาด'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize user data on store creation
  const initializeStore = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser)
        console.log('AuthStore initialized with user:', user.value)
      } catch (e) {
        console.error('Error parsing saved user data:', e)
        localStorage.removeItem('auth_user')
        user.value = null
      }
    }
  }

  // Call initialize on store creation
  initializeStore()

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    clearError,
    initializeStore
  }
})
