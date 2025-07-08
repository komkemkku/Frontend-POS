<template>
  <div class="w-full max-w-full overflow-x-hidden min-h-0">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 min-w-0">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          รายงานสรุปผลภาพรวม
        </h1>
        <p class="mt-1 text-sm text-gray-600">
          ติดตามและวิเคราะห์ประสิทธิภาพการขายของธุรกิจ
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <button
          @click="exportTransactionData"
          :disabled="isExportingTransactions"
          class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="isExportingTransactions" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ isExportingTransactions ? 'กำลังส่งออก...' : 'ส่งออกข้อมูลดิบ' }}
        </button>
        <button
          @click="exportExcel"
          :disabled="isExporting"
          class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="isExporting" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          {{ isExporting ? 'กำลังส่งออก...' : 'ส่งออกรายงาน' }}
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
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
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
    <div v-else class="space-y-6">
      <!-- KPI Cards -->
      <KpiCards v-if="reportData" :data="reportData" />

      <!-- Charts Section -->
      <div v-if="reportData" class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <!-- Sales Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 min-w-0 overflow-hidden">
          <SalesChart
            title="ยอดขายรายวัน"
            :data="reportData.salesChartData"
            type="sales"
          />
        </div>
        
        <!-- Orders Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 min-w-0 overflow-hidden">
          <SalesChart
            title="จำนวนออเดอร์รายวัน"
            :data="reportData.ordersChartData"
            type="orders"
          />
        </div>
        
        <!-- Category Distribution -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 min-w-0 overflow-hidden">
          <CategoryChart
            title="ยอดขายตามหมวดหมู่"
            :data="reportData.salesByCategory"
          />
        </div>
        
        <!-- Customer Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 min-w-0 overflow-hidden">
          <SalesChart
            title="ลูกค้ารายวัน"
            :data="reportData.customersChartData"
            type="customers"
          />
        </div>
      </div>

      <!-- Insights Cards -->
      <InsightCards v-if="reportData" :data="reportData" />

      <!-- Additional Analytics Grid -->
      <div v-if="reportData && reportData.paymentMethods" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <!-- Payment Methods -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">วิธีการชำระเงิน</h3>
          <div class="space-y-3 overflow-hidden">
            <div v-for="method in reportData.paymentMethods" :key="method.method" class="flex items-center justify-between min-w-0">
              <div class="flex items-center space-x-3 min-w-0 flex-1">
                <div class="w-3 h-3 rounded-full flex-shrink-0" :class="{
                  'bg-blue-500': method.method === 'เงินสด',
                  'bg-green-500': method.method === 'โอนผ่านธนาคาร',
                  'bg-purple-500': method.method === 'บัตรเครดิต',
                  'bg-orange-500': method.method === 'QR Code'
                }"></div>
                <span class="text-sm font-medium text-gray-700 truncate">{{ method.method }}</span>
              </div>
              <div class="text-right flex-shrink-0 ml-2">
                <div class="text-sm font-semibold text-gray-900">{{ method.percentage }}%</div>
                <div class="text-xs text-gray-500">{{ method.count.toLocaleString() }} รายการ</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Staff Performance -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">ประสิทธิภาพพนักงาน</h3>
          <div class="space-y-3 overflow-hidden">
            <div v-for="(staff, index) in reportData.staffPerformance" :key="staff.staffId" class="flex items-center justify-between min-w-0">
              <div class="flex items-center space-x-3 min-w-0 flex-1">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0" :class="{
                  'bg-blue-500': index === 0,
                  'bg-green-500': index === 1,
                  'bg-purple-500': index === 2,
                  'bg-orange-500': index === 3
                }">
                  {{ index + 1 }}
                </div>
                <span class="text-sm font-medium text-gray-700 truncate">{{ staff.staffName }}</span>
              </div>
              <div class="text-right flex-shrink-0 ml-2">
                <div class="text-sm font-semibold text-gray-900">{{ staff.ordersHandled.toLocaleString() }}</div>
                <div class="text-xs text-gray-500">ออเดอร์</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Segments -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">กลุ่มลูกค้า</h3>
          <div class="space-y-3 overflow-hidden">
            <div v-for="segment in reportData.customerSegments" :key="segment.segment" class="flex items-center justify-between min-w-0">
              <div class="flex items-center space-x-3 min-w-0 flex-1">
                <div class="w-3 h-3 rounded-full flex-shrink-0" :class="{
                  'bg-green-500': segment.segment === 'ลูกค้าใหม่',
                  'bg-blue-500': segment.segment === 'ลูกค้าประจำ',
                  'bg-purple-500': segment.segment === 'ลูกค้า VIP'
                }"></div>
                <span class="text-sm font-medium text-gray-700 truncate">{{ segment.segment }}</span>
              </div>
              <div class="text-right flex-shrink-0 ml-2">
                <div class="text-sm font-semibold text-gray-900">{{ segment.count.toLocaleString() }}</div>
                <div class="text-xs text-gray-500">คน ({{ segment.frequency }}x)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Peak Hours Analytics -->
      <div v-if="reportData && reportData.peakHours" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 overflow-hidden">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">ช่วงเวลาขายดี</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3 lg:gap-4">
          <div v-for="hour in reportData.peakHours" :key="hour.time" class="text-center p-3 lg:p-4 bg-gray-50 rounded-lg min-w-0 overflow-hidden">
            <div class="text-sm lg:text-base font-bold text-gray-900 truncate">{{ hour.time }}</div>
            <div class="text-xs lg:text-sm text-gray-600 mt-1 truncate">{{ hour.orders.toLocaleString() }} ออเดอร์</div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: hour.percentage + '%' }"></div>
            </div>
            <div class="text-xs text-gray-500 mt-1">{{ hour.percentage }}%</div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <TransactionTable v-if="transactions && transactions.length > 0" :transactions="transactions" />
      
      <!-- No Data State -->
      <div v-else-if="!isLoading && (!reportData || !transactions)" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูล</h3>
        <p class="mt-1 text-sm text-gray-500">ไม่มีข้อมูลรายงานในช่วงเวลาที่เลือก</p>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import DateRangePicker from '../../../components/reports/DateRangePicker.vue'
import KpiCards from '../../../components/reports/KpiCards.vue'
import TransactionTable from '../../../components/reports/TransactionTable.vue'
import SalesChart from '../../../components/reports/SalesChart.vue'
import CategoryChart from '../../../components/reports/CategoryChart.vue'
import InsightCards from '../../../components/reports/InsightCards.vue'
import { useReportsAPI } from '../../../composables/useReportsAPI'
import { exportToExcel, exportTransactionDetails } from '../../../utils/excelExport'

export default {
  name: 'ReportsView',
  components: {
    DateRangePicker,
    KpiCards,
    TransactionTable,
    SalesChart,
    CategoryChart,
    InsightCards
  },
  setup() {
    // State
    const isLoading = ref(false)
    const isExporting = ref(false)
    const isExportingTransactions = ref(false)
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

    // Export transaction details to Excel
    const exportTransactionData = async () => {
      try {
        isExportingTransactions.value = true
        
        const transactionsData = await getTransactions(startDate.value, endDate.value)
        
        exportTransactionDetails(
          transactionsData,
          startDate.value,
          endDate.value
        )
        
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งออกข้อมูล transaction'
        console.error('Error exporting transaction data:', err)
      } finally {
        isExportingTransactions.value = false
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
      console.log('ReportsView mounted, loading data...')
      loadData()
    })

    return {
      isLoading,
      isExporting,
      isExportingTransactions,
      error,
      reportData,
      transactions,
      startDate,
      endDate,
      exportExcel,
      exportTransactionData,
      onStartDateChange,
      onEndDateChange
    }
  }
}
</script>
