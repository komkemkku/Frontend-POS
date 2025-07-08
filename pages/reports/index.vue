<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              รายงานสรุปผลภาพรวม
            </h1>
            <p class="mt-2 text-sm text-gray-600">
              ติดตามและวิเคราะห์ประสิทธิภาพการขายของธุรกิจ
            </p>
          </div>
          <button
            @click="exportExcel"
            :disabled="isExporting"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg v-if="isExporting" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {{ isExporting ? 'กำลังส่งออก...' : 'ส่งออกเป็น Excel' }}
          </button>
        </div>
      </div>

      <!-- Date Range Filter -->
      <DateRangePicker 
        :start-date="startDate"
        :end-date="endDate"
        @update:start-date="onStartDateChange"
        @update:end-date="onEndDateChange"
      />

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">เกิดข้อผิดพลาด</h3>
            <p class="mt-1 text-sm text-red-600">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- KPI Cards -->
        <KpiCards v-if="reportData" :data="reportData" />

        <!-- Recent Transactions -->
        <TransactionTable v-if="transactions" :transactions="transactions" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import DateRangePicker from '../../components/reports/DateRangePicker.vue'
import KpiCards from '../../components/reports/KpiCards.vue'
import TransactionTable from '../../components/reports/TransactionTable.vue'
import { useReportsAPI } from '../../composables/useReportsAPI'
import { exportToExcel } from '../../utils/excelExport'

export default {
  name: 'ReportsPage',
  components: {
    DateRangePicker,
    KpiCards,
    TransactionTable
  },
  setup() {
    // State
    const isLoading = ref(false)
    const isExporting = ref(false)
    const error = ref(null)
    const reportData = ref(null)
    const transactions = ref([])

    // Date range - default to current month
    const today = new Date()
    const startDate = ref(new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0])
    const endDate = ref(today.toISOString().split('T')[0])

    // API composable
    const { getReportSummary, getTransactions, getProductSales, getCategorySales } = useReportsAPI()

    // Load data
    const loadData = async () => {
      try {
        isLoading.value = true
        error.value = null
        
        console.log('Loading data for date range:', startDate.value, 'to', endDate.value)
        
        const [summaryData, transactionsData] = await Promise.all([
          getReportSummary(startDate.value, endDate.value),
          getTransactions(startDate.value, endDate.value)
        ])
        
        console.log('Summary data:', summaryData)
        console.log('Transactions data:', transactionsData)
        
        reportData.value = summaryData
        transactions.value = transactionsData
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
        console.error('Error loading report data:', err)
      } finally {
        isLoading.value = false
      }
    }

    // Export to Excel
    const exportExcel = async () => {
      try {
        isExporting.value = true
        
        const [summaryData, transactionsData, productSalesData, categorySalesData] = await Promise.all([
          getReportSummary(startDate.value, endDate.value),
          getTransactions(startDate.value, endDate.value),
          getProductSales(startDate.value, endDate.value),
          getCategorySales(startDate.value, endDate.value)
        ])
        
        exportToExcel({
          summary: summaryData,
          transactions: transactionsData,
          productSales: productSalesData,
          categorySales: categorySalesData
        }, startDate.value, endDate.value)
        
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งออกข้อมูล'
        console.error('Error exporting data:', err)
      } finally {
        isExporting.value = false
      }
    }

    // Handle date changes
    const onStartDateChange = (date) => {
      startDate.value = date
      loadData()
    }

    const onEndDateChange = (date) => {
      endDate.value = date
      loadData()
    }

    // Load initial data
    onMounted(() => {
      console.log('Reports page mounted, loading data...')
      loadData()
    })

    return {
      isLoading,
      isExporting,
      error,
      reportData,
      transactions,
      startDate,
      endDate,
      exportExcel,
      onStartDateChange,
      onEndDateChange
    }
  }
}
</script>
