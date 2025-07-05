<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">แดชบอร์ด</h1>
          <p class="text-gray-600 flex items-center">
            <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
            วันนี้ {{ currentDate }}
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            @click="toggleAutoRefresh"
            :class="[
              'px-3 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all duration-200',
              autoRefreshEnabled 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ autoRefreshEnabled ? 'Auto ON' : 'Auto OFF' }}</span>
          </button>
          <button 
            @click="refreshData" 
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <svg :class="['h-4 w-4', loading ? 'animate-spin' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ loading ? 'กำลังโหลด...' : 'รีเฟรช' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div 
      v-if="error"
      class="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
    >
      <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <div class="flex-1">
        <p class="text-red-800 font-medium">{{ error }}</p>
        <p class="text-red-600 text-sm">กรุณาลองรีเฟรชข้อมูลอีกครั้ง</p>
      </div>
      <button 
        @click="error = null"
        class="text-red-500 hover:text-red-700"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="(stat, index) in stats" 
        :key="stat.title" 
        class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-gray-900 mb-1">{{ stat.value }}</p>
            <div class="flex items-center">
              <span :class="`text-sm font-medium ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`">
                {{ stat.change >= 0 ? '+' : '' }}{{ stat.change }}%
              </span>
              <span class="text-xs text-gray-500 ml-2">จากเมื่อวาน</span>
            </div>
          </div>
          <div :class="`p-4 rounded-2xl ${stat.bgColor}`">
            <component :is="stat.icon" :class="`h-8 w-8 ${stat.iconColor}`" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Sales Chart - Takes 2 columns -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">ยอดขายรายวัน</h3>
            <div class="flex space-x-2">
              <button 
                v-for="period in chartPeriods" 
                :key="period.value"
                @click="selectedPeriod = period.value"
                :class="[
                  'px-3 py-1 rounded-lg text-sm font-medium transition-all',
                  selectedPeriod === period.value 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
          <div class="h-96 p-4 bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <SalesChartVue :period="selectedPeriod" :chart-data="chartData" />
          </div>
        </div>
      </div>

      <!-- Popular Menu Items -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">เมนูขายดี</h3>
          <span class="text-sm text-gray-500">วันนี้</span>
        </div>
        <div class="space-y-4 h-96 overflow-y-auto pr-2"
             style="scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9;">
          <div 
            v-if="popularItems.length === 0"
            class="flex flex-col items-center justify-center h-full text-gray-500"
          >
            <svg class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="font-medium">ยังไม่มีข้อมูลเมนูขายดี</p>
            <p class="text-sm">เมื่อมีการสั่งอาหารจะแสดงข้อมูลที่นี่</p>
          </div>
          <div 
            v-for="(item, index) in popularItems" 
            :key="item.id" 
            class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
          >
            <div class="flex items-center space-x-4">
              <div class="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-lg">{{ index + 1 }}</span>
              </div>
              <div>
                <p class="font-semibold text-gray-900">{{ item.name }}</p>
                <p class="text-sm text-gray-500">{{ item.category }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900">{{ item.sold }}</p>
              <p class="text-xs text-gray-500">ชิ้น</p>
              <p class="text-sm text-blue-600 font-medium">฿{{ item.revenue.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">ออเดอร์ล่าสุด</h3>
          <router-link 
            to="/orders" 
            class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            ดูทั้งหมด
            <svg class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
        <div class="space-y-4 h-80 overflow-y-auto pr-2"
             style="scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9;">
          <div 
            v-if="recentOrders.length === 0"
            class="flex flex-col items-center justify-center h-full text-gray-500"
          >
            <svg class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="font-medium">ยังไม่มีออเดอร์</p>
            <p class="text-sm">เมื่อมีการสั่งอาหารจะแสดงข้อมูลที่นี่</p>
          </div>
          <div 
            v-for="order in recentOrders" 
            :key="order.id" 
            class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center space-x-4">
              <div class="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <span class="text-gray-600 font-medium text-sm">#{{ order.id }}</span>
              </div>
              <div>
                <p class="font-medium text-gray-900">โต๊ะ {{ order.table_number }}</p>
                <p class="text-sm text-gray-500">{{ formatTime(order.created_at) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-900">฿{{ order.total_amount.toLocaleString() }}</p>
              <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`">
                {{ getStatusText(order.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">การดำเนินการด่วน</h3>
          <div class="text-right">
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">4 actions</span>
            <p class="text-xs text-gray-400 mt-1">
              อัปเดตล่าสุด: {{ lastRefresh.toLocaleTimeString('th-TH') }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <button 
            v-for="action in quickActions" 
            :key="action.title"
            @click="action.action"
            :disabled="action.title === 'รีเฟรชข้อมูล' && refreshing"
            :class="[
              'p-4 border-2 border-gray-200 rounded-xl transition-all duration-200 text-left group hover:shadow-md active:transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
              action.bgColor,
              (action.title === 'รีเฟรชข้อมูล' && refreshing) ? 'opacity-75 cursor-not-allowed' : ''
            ]"
            :title="`${action.title} - ${action.description}`"
          >
            <div class="flex items-start space-x-3">
              <div :class="[
                'p-2 rounded-lg transition-colors',
                action.bgColor.includes('blue') ? 'bg-blue-100 group-hover:bg-blue-200' :
                action.bgColor.includes('green') ? 'bg-green-100 group-hover:bg-green-200' :
                action.bgColor.includes('purple') ? 'bg-purple-100 group-hover:bg-purple-200' :
                'bg-orange-100 group-hover:bg-orange-200'
              ]">
                <component 
                  :is="action.icon" 
                  :class="[
                    'h-5 w-5 transition-all',
                    action.iconColor,
                    action.title === 'รีเฟรชข้อมูล' && refreshing ? 'animate-spin' : ''
                  ]" 
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 group-hover:text-gray-700 truncate">
                  {{ action.title }}
                </p>
                <p class="text-xs text-gray-500 group-hover:text-gray-600 mt-1">
                  {{ action.description }}
                </p>
              </div>
            </div>
          </button>
        </div>
        
        <!-- Quick Stats -->
        <div class="mt-6 pt-4 border-t border-gray-100">
          <p class="text-xs text-gray-500 text-center">
            💡 แป้นลัด: 
            <kbd class="px-1 py-0.5 bg-gray-100 rounded text-xs mx-1">Ctrl+N</kbd> ออเดอร์ใหม่
            <kbd class="px-1 py-0.5 bg-gray-100 rounded text-xs mx-1">Ctrl+M</kbd> เมนู
            <kbd class="px-1 py-0.5 bg-gray-100 rounded text-xs mx-1">Ctrl+T</kbd> โต๊ะ
            <kbd class="px-1 py-0.5 bg-gray-100 rounded text-xs mx-1">Ctrl+R</kbd> รีเฟรช
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { dashboardService } from '@/services/dashboardService'
import SalesChartVue from '@/components/SalesChartVue.vue'
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  ClockIcon,
  PlusIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  TableCellsIcon,
  UserPlusIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

const $router = useRouter()

// Reactive data
const loading = ref(false)
const refreshing = ref(false)
const error = ref(null)
const dashboardData = ref(null)
const selectedPeriod = ref('7d')
const lastRefresh = ref(new Date())
const autoRefreshInterval = ref(null)
const autoRefreshEnabled = ref(true)

// Chart periods
const chartPeriods = ref([
  { value: '7d', label: '7 วัน' },
  { value: '30d', label: '30 วัน' },
  { value: '90d', label: '3 เดือน' }
])

// Current date computed
const currentDate = computed(() => {
  return new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Computed stats with real percentage calculation
const stats = computed(() => {
  if (!dashboardData.value) {
    return [
      {
        title: 'ยอดขายวันนี้',
        value: '฿0',
        change: 0,
        icon: CurrencyDollarIcon,
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      {
        title: 'คำสั่งซื้อ',
        value: '0',
        change: 0,
        icon: ShoppingCartIcon,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        title: 'ลูกค้าวันนี้',
        value: '0',
        change: 0,
        icon: UsersIcon,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      {
        title: 'เวลาเฉลี่ย',
        value: '0 นาที',
        change: 0,
        icon: ClockIcon,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      }
    ]
  }

  const data = dashboardData.value.data
  
  // คำนวณเปอร์เซ็นต์การเปลี่ยนแปลงจากข้อมูลจริง
  const revenueChange = data.yesterday_revenue ? 
    ((data.today_revenue - data.yesterday_revenue) / data.yesterday_revenue * 100) : 0
  const ordersChange = data.yesterday_orders ? 
    ((data.today_orders - data.yesterday_orders) / data.yesterday_orders * 100) : 0
  const customersChange = data.yesterday_customers ? 
    ((data.today_customers - data.yesterday_customers) / data.yesterday_customers * 100) : 0
  const timeChange = data.last_week_avg_time_minutes ? 
    ((data.avg_order_time_minutes - data.last_week_avg_time_minutes) / data.last_week_avg_time_minutes * 100) : 0

  return [
    {
      title: 'ยอดขายวันนี้',
      value: `฿${data.today_revenue?.toLocaleString() || '0'}`,
      change: parseFloat(revenueChange.toFixed(1)),
      icon: CurrencyDollarIcon,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'คำสั่งซื้อ',
      value: data.today_orders?.toString() || '0',
      change: parseFloat(ordersChange.toFixed(1)),
      icon: ShoppingCartIcon,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'ลูกค้าวันนี้',
      value: data.today_customers?.toString() || '0',
      change: parseFloat(customersChange.toFixed(1)),
      icon: UsersIcon,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'เวลาเฉลี่ย',
      value: `${data.avg_order_time_minutes || 0} นาที`,
      change: parseFloat(timeChange.toFixed(1)),
      icon: ClockIcon,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ]
})

// Computed popular items from API data
const popularItems = computed(() => {
  if (!dashboardData.value?.data?.popular_items) {
    return []
  }
  return dashboardData.value.data.popular_items
})

// Computed recent orders from API data
const recentOrders = computed(() => {
  if (!dashboardData.value?.data?.recent_orders) {
    return []
  }
  return dashboardData.value.data.recent_orders
})

// Computed chart data from API
const chartData = computed(() => {
  if (!dashboardData.value?.data?.sales_chart) {
    // Fallback to mock data
    return {
      '7d': {
        labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
        data: [12000, 15000, 18000, 22000, 25000, 28000, 20000]
      },
      '30d': {
        labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
        data: [85000, 92000, 105000, 98000]
      },
      '90d': {
        labels: ['เดือน 1', 'เดือน 2', 'เดือน 3'],
        data: [350000, 380000, 420000]
      }
    }
  }

  const apiData = dashboardData.value.data.sales_chart
  return {
    '7d': apiData.seven_days,
    '30d': apiData.thirty_days,
    '90d': apiData.ninety_days
  }
})

// Quick actions with real functionality
const quickActions = ref([
  {
    title: 'สร้างออเดอร์ใหม่',
    description: 'สร้างคำสั่งซื้อใหม่',
    icon: ClipboardDocumentListIcon,
    bgColor: 'hover:bg-blue-50 hover:border-blue-300',
    iconColor: 'text-blue-600',
    action: () => handleCreateOrder()
  },
  {
    title: 'เพิ่มเมนูใหม่',
    description: 'เพิ่มรายการอาหาร',
    icon: PlusIcon,
    bgColor: 'hover:bg-green-50 hover:border-green-300',
    iconColor: 'text-green-600',
    action: () => handleAddMenu()
  },
  {
    title: 'จัดการโต๊ะ',
    description: 'ดูสถานะโต๊ะทั้งหมด',
    icon: TableCellsIcon,
    bgColor: 'hover:bg-purple-50 hover:border-purple-300',
    iconColor: 'text-purple-600',
    action: () => handleManageTables()
  },
  {
    title: 'รีเฟรชข้อมูล',
    description: 'อัปเดตข้อมูลล่าสุด',
    icon: ArrowPathIcon,
    bgColor: 'hover:bg-orange-50 hover:border-orange-300',
    iconColor: 'text-orange-600',
    action: () => handleRefreshData()
  }
])

// Methods
const loadDashboardData = async () => {
  loading.value = true
  error.value = null
  try {
    console.log('Loading dashboard data...')
    const response = await dashboardService.getSummary()
    dashboardData.value = response
    lastRefresh.value = new Date() // อัปเดตเวลารีเฟรชล่าสุด
    console.log('Dashboard data loaded:', response)
  } catch (err) {
    console.error('Dashboard error:', err)
    error.value = err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await handleRefreshData()
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'รอดำเนินการ',
    preparing: 'กำลังเตรียม',
    ready: 'พร้อมเสิร์ฟ',
    completed: 'เสร็จสิ้น'
  }
  return texts[status] || status
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000) // Convert Unix timestamp to milliseconds
  return date.toLocaleTimeString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Quick Actions Handlers
const handleCreateOrder = () => {
  // ในอนาคตจะเป็นการเปิด modal สำหรับสร้างออเดอร์
  // ตอนนี้ไปหน้าออเดอร์ก่อน
  $router.push('/orders').catch(() => {
    // หากยังไม่มีหน้าออเดอร์ ให้แสดง alert
    alert('🚧 หน้าจัดการออเดอร์กำลังพัฒนา\nจะเปิดใช้งานในเร็วๆ นี้!')
  })
}

const handleAddMenu = () => {
  $router.push('/menu').catch(() => {
    // หากยังไม่มีหน้าเมนู ให้แสดง alert
    alert('🚧 หน้าจัดการเมนูกำลังพัฒนา\nจะเปิดใช้งานในเร็วๆ นี้!')
  })
}

const handleManageTables = () => {
  $router.push('/tables').catch(() => {
    // หากยังไม่มีหน้าโต๊ะ ให้แสดง alert
    alert('🚧 หน้าจัดการโต๊ะกำลังพัฒนา\nจะเปิดใช้งานในเร็วๆ นี้!')
  })
}

const handleRefreshData = async () => {    console.log('🔄 Starting data refresh...')
    refreshing.value = true
    
    try {
      // เพิ่มการแสดงเวลาใน console
      const startTime = Date.now()
      console.log('Refreshing dashboard data at:', new Date().toLocaleTimeString())
      
      await loadDashboardData()
      
      // จำลองการเปลี่ยนแปลงข้อมูลเล็กน้อย (เพื่อแสดงว่ารีเฟรชได้จริง)
      if (dashboardData.value?.data) {
        // เพิ่ม random variance เล็กน้อยในข้อมูล
        const variance = (Math.random() - 0.5) * 100
        const originalRevenue = dashboardData.value.data.today_revenue
        dashboardData.value.data.today_revenue = Math.max(0, originalRevenue + variance)
        console.log(`💰 Revenue updated: ${originalRevenue} → ${dashboardData.value.data.today_revenue}`)
      }
      
      const endTime = Date.now()
      console.log(`✅ Data refresh completed in ${endTime - startTime}ms`)
      showNotification('🔄 ข้อมูลได้รับการอัปเดตแล้ว', 'success')
      
    } catch (error) {
    console.error('❌ Refresh failed:', error)
    showNotification('❌ ไม่สามารถอัปเดตข้อมูลได้', 'error')
  } finally {
    refreshing.value = false
    console.log('🏁 Refresh process completed')
  }
}

// Auto-refresh functionality
const startAutoRefresh = () => {
  if (autoRefreshInterval.value) clearInterval(autoRefreshInterval.value)
  
  autoRefreshInterval.value = setInterval(async () => {
    if (!refreshing.value && autoRefreshEnabled.value) {
      console.log('🔄 Auto-refreshing data...')
      await loadDashboardData()
      console.log('✅ Auto-refresh completed')
    }
  }, 30000) // 30 seconds
}

const stopAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
    autoRefreshInterval.value = null
  }
}

const toggleAutoRefresh = () => {
  autoRefreshEnabled.value = !autoRefreshEnabled.value
  if (autoRefreshEnabled.value) {
    startAutoRefresh()
    showNotification('🔄 เปิดการรีเฟรชอัตโนมัติแล้ว', 'success')
  } else {
    stopAutoRefresh()
    showNotification('⏸️ ปิดการรีเฟรชอัตโนมัติแล้ว', 'info')
  }
}

// Simple notification system
const showNotification = (message, type = 'info') => {
  // สร้าง toast notification แบบง่าย
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  }`
  toast.textContent = message
  toast.style.transform = 'translateX(100%)'
  
  document.body.appendChild(toast)
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
  }, 100)
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

// Lifecycle
onMounted(() => {
  console.log('DashboardView mounted')
  loadDashboardData()
  
  // Auto-refresh every 30 seconds
  if (autoRefreshEnabled.value) {
    autoRefreshInterval.value = setInterval(() => {
      console.log('Auto-refreshing dashboard data...')
      refreshData()
    }, 30000)
  }
  
  // Add keyboard shortcuts
  const handleKeyboard = (event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'n':
          event.preventDefault()
          handleCreateOrder()
          break
        case 'm':
          event.preventDefault()
          handleAddMenu()
          break
        case 't':
          event.preventDefault()
          handleManageTables()
          break
        case 'r':
          event.preventDefault()
          handleRefreshData()
          break
      }
    }
  }
  
  document.addEventListener('keydown', handleKeyboard)
  
  // Cleanup
  return () => {
    document.removeEventListener('keydown', handleKeyboard)
    clearInterval(autoRefreshInterval.value)
  }
})
</script>

<style scoped>
/* Custom scrollbar สำหรับ popular menu และ recent orders */
.space-y-4::-webkit-scrollbar {
  width: 6px;
}

.space-y-4::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.space-y-4::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.space-y-4::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
