import type { AxiosResponse } from 'axios'
import type { ApiResponse } from './auth'

export interface ApiClient {
  get<T = any>(url: string, config?: any): Promise<AxiosResponse<ApiResponse<T>>>
  post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<ApiResponse<T>>>
  put<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<ApiResponse<T>>>
  delete<T = any>(url: string, config?: any): Promise<AxiosResponse<ApiResponse<T>>>
}
