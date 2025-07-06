import { ref, type Ref } from 'vue'
import { DashboardService } from '@/services/dashboard.service'
import type { 
  DashboardData, 
  SalesData, 
  DashboardFilters
} from '@/types'

export function useDashboard() {
  const stats: Ref<DashboardData | null> = ref(null)
  const salesData: Ref<SalesData[]> = ref([])
  const analytics: Ref<any> = ref(null)
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const fetchSummary = async () => {
    try {
      loading.value = true
      error.value = null
      
      stats.value = await DashboardService.getSummary()
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching dashboard summary:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchSalesData = async (filters: DashboardFilters) => {
    try {
      loading.value = true
      error.value = null
      
      salesData.value = await DashboardService.getSalesData(filters)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching sales data:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAnalytics = async (period: 'today' | 'week' | 'month' | 'year' = 'week') => {
    try {
      loading.value = true
      error.value = null
      
      analytics.value = await DashboardService.getAnalytics(period)
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching analytics:', err)
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    stats,
    salesData,
    analytics,
    loading,
    error,
    
    // Actions
    fetchSummary,
    fetchSalesData,
    fetchAnalytics,
    clearError
  }
}
