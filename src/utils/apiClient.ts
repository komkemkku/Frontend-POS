import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/auth'

// สร้าง axios instance ที่มี interceptor สำหรับ token
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend-pos-production.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Debug logging
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'https://backend-pos-production.up.railway.app')

// Interceptor สำหรับเพิ่ม auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor สำหรับจัดการ response
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>): AxiosResponse<ApiResponse> => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token หมดอายุ ให้ redirect ไป login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
