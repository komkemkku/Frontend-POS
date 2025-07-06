import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import api from '@/utils/apiClient'
import type { 
  LoginCredentials, 
  Staff, 
  LoginApiResponse, 
  LoginResult,
  ApiError 
} from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token: Ref<string | null> = ref(localStorage.getItem('auth_token') || null)
  const user: Ref<Staff | null> = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const isAuthenticated: ComputedRef<boolean> = computed(() => !!token.value)

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      loading.value = true
      error.value = null
      
      console.log('Login request to:', '/staff/login')
      console.log('Credentials:', { username: credentials.username })
      
      const response = await api.post<LoginApiResponse>('/staff/login', credentials)
      
      console.log('Login response:', response.data)
      
      if (response.data.status.code === 200) {
        const loginData = response.data.data
        token.value = loginData.token
        user.value = loginData.staff
        
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('auth_user', JSON.stringify(user.value))
        
        console.log('Login successful, user:', user.value)
        return { success: true }
      } else {
        throw new Error(response.data.status.message || 'เข้าสู่ระบบไม่สำเร็จ')
      }
    } catch (err: unknown) {
      console.error('Login error:', err)
      const apiError = err as ApiError
      error.value = apiError.response?.data?.status?.message || apiError.message || 'เกิดข้อผิดพลาด'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const logout = (): void => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  const clearError = (): void => {
    error.value = null
  }

  // Initialize user data on store creation
  const initializeStore = (): void => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser) as Staff
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
