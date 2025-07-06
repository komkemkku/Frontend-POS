import api from '@/utils/apiClient'
import type { 
  DashboardStats, 
  DashboardData,
  SalesData, 
  DashboardFilters
} from '@/types'

export class DashboardService {
  /**
   * Get dashboard summary data
   */
  static async getSummary(): Promise<DashboardData> {
    try {
      const response = await api.get('/summary')
      console.log('Dashboard API Response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Dashboard API Error:', error)
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลแดชบอร์ดได้')
    }
  }

  /**
   * Get sales data with filters
   */
  static async getSalesData(filters: DashboardFilters): Promise<SalesData[]> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('start_date', filters.start_date)
      queryParams.append('end_date', filters.end_date)
      if (filters.period) queryParams.append('period', filters.period)

      const response = await api.get(`/sales-data?${queryParams}`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลยอดขายได้')
    }
  }

  /**
   * Get analytics data for charts
   */
  static async getAnalytics(period: 'today' | 'week' | 'month' | 'year' = 'week'): Promise<any> {
    try {
      const response = await api.get(`/analytics?period=${period}`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลการวิเคราะห์ได้')
    }
  }
}

// Create instance for object-style usage
export const dashboardService = {
  getSummary: DashboardService.getSummary,
  getSalesData: DashboardService.getSalesData,
  getAnalytics: DashboardService.getAnalytics
}

// Export as default for backward compatibility
export default DashboardService
