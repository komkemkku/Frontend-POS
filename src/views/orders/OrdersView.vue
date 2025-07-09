<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header Section with Enhanced Design -->
    <div class="bg-white shadow-xl border-b border-blue-200 backdrop-blur-lg bg-white/90">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-8">
          <div class="flex items-center space-x-6">
            <div class="relative">
              <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform">
                <ShoppingBagIcon class="w-8 h-8 text-white" />
              </div>
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">การจัดการออเดอร์</h1>
              <p class="text-sm text-blue-600 mt-2 font-medium">จัดการคำสั่งซื้อและติดตามสถานะแบบเรียลไทม์</p>
            </div>
          </div>
          
          <!-- Action Buttons with Enhanced Design -->
          <div class="flex items-center space-x-4">
            <!-- Real-time Status with Better Design -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-2">
              <RealTimeStatus
                :is-connected="isConnected"
                :connection-status="connectionStatus"
                :last-update="lastUpdate"
                :update-count="updateCount"
                :is-polling="isPolling"
                :on-reconnect="reconnect"
              />
            </div>
            
            <button
              @click="refreshOrders"
              class="inline-flex items-center px-6 py-3 bg-white border-2 border-blue-200 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-lg transition-all duration-200 transform hover:scale-105"
              :disabled="loading"
            >
              <ArrowPathIcon class="w-5 h-5 mr-2" :class="{ 'animate-spin': loading }" />
              รีเฟรชข้อมูล
            </button>
            
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-2xl transition-all duration-200 transform hover:scale-105 hover:shadow-3xl"
            >
              <PlusIcon class="w-5 h-5 mr-2" />
              สร้างออเดอร์ใหม่
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Stats Cards with Modern Design -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Today's Orders Card -->
        <div class="group bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-semibold text-blue-600 uppercase tracking-wide">ออเดอร์วันนี้</p>
              <p class="text-4xl font-bold text-gray-900 mt-2">{{ stats.todayOrders || 0 }}</p>
              <p class="text-xs text-blue-500 mt-1">+12% จากเมื่อวาน</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <ShoppingBagIcon class="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        
        <!-- Today's Revenue Card -->
        <div class="group bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-xl p-6 border border-emerald-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-semibold text-emerald-600 uppercase tracking-wide">ยอดขายวันนี้</p>
              <p class="text-4xl font-bold text-gray-900 mt-2">₿{{ formatCurrency(stats.todayRevenue || 0) }}</p>
              <p class="text-xs text-emerald-500 mt-1">+8% จากเมื่อวาน</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <BanknotesIcon class="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        
        <!-- Pending Orders Card -->
        <div class="group bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl p-6 border border-amber-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-semibold text-amber-600 uppercase tracking-wide">รอดำเนินการ</p>
              <p class="text-4xl font-bold text-gray-900 mt-2">{{ stats.pendingOrders || 0 }}</p>
              <p class="text-xs text-amber-500 mt-1">ต้องการความสนใจ</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <ClockIcon class="w-7 h-7 text-white animate-pulse" />
            </div>
          </div>
        </div>
        
        <!-- Completed Orders Card -->
        <div class="group bg-gradient-to-br from-white to-violet-50 rounded-2xl shadow-xl p-6 border border-violet-100/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-sm font-semibold text-violet-600 uppercase tracking-wide">เสร็จสิ้นแล้ว</p>
              <p class="text-4xl font-bold text-gray-900 mt-2">{{ stats.completedOrders || 0 }}</p>
              <p class="text-xs text-violet-500 mt-1">สำเร็จแล้ววันนี้</p>
            </div>
            <div class="w-14 h-14 bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <CheckCircleIcon class="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Filters Section -->
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-blue-100/50">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 flex items-center">
            <FunnelIcon class="w-5 h-5 mr-2 text-blue-600" />
            ตัวกรองขั้นสูง
          </h3>
          <button 
            @click="clearFilters"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
          >
            ล้างตัวกรอง
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">สถานะออเดอร์</label>
            <select 
              v-model="filters.status" 
              @change="loadOrders"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            >
              <option value="">ทั้งหมด</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="confirmed">ยืนยันแล้ว</option>
              <option value="preparing">กำลังเตรียม</option>
              <option value="ready">พร้อมเสิร์ฟ</option>
              <option value="served">เสิร์ฟแล้ว</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">สถานะการชำระ</label>
            <select 
              v-model="filters.payment_status" 
              @change="loadOrders"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            >
              <option value="">ทั้งหมด</option>
              <option value="pending">รอชำระ</option>
              <option value="paid">ชำระแล้ว</option>
              <option value="partially_paid">ชำระบางส่วน</option>
              <option value="refunded">คืนเงินแล้ว</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">โต๊ะ</label>
            <select 
              v-model="filters.table_id" 
              @change="loadOrders"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
            >
              <option value="">ทั้งหมด</option>
              <option v-for="table in tables" :key="table.id" :value="table.id">
                โต๊ะ {{ table.table_number }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">วันที่เริ่มต้น</label>
            <input 
              type="date" 
              v-model="filters.start_date"
              @change="loadOrders"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">วันที่สิ้นสุด</label>
            <input 
              type="date" 
              v-model="filters.end_date"
              @change="loadOrders"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900">รายการออเดอร์</h3>
        </div>
        
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">กำลังโหลด...</span>
        </div>
        
        <div v-else-if="orders.length === 0" class="text-center py-12">
          <ShoppingBagIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">ไม่มีออเดอร์</h3>
          <p class="mt-1 text-gray-500">เริ่มต้นด้วยการสร้างออเดอร์ใหม่</p>
          <button
            @click="showCreateModal = true"
            class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            สร้างออเดอร์ใหม่
          </button>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="order in orders"
            :key="order.id"
            class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="selectOrder(order)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-bold text-blue-600">#{{ order.order_number }}</span>
                  </div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <h4 class="text-lg font-semibold text-gray-900">
                      ออเดอร์ #{{ order.order_number }}
                    </h4>
                    <span :class="getOrderStatusClass(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getOrderStatusText(order.status) }}
                    </span>
                    <span :class="getPaymentStatusClass(order.payment_status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getPaymentStatusText(order.payment_status) }}
                    </span>
                  </div>
                  
                  <div class="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                    <span v-if="order.table">
                      <MapPinIcon class="w-4 h-4 inline mr-1" />
                      โต๊ะ {{ order.table.table_number }}
                    </span>
                    <span v-if="order.customer_name">
                      <UserIcon class="w-4 h-4 inline mr-1" />
                      {{ order.customer_name }}
                    </span>
                    <span>
                      <ClockIcon class="w-4 h-4 inline mr-1" />
                      {{ formatDateTime(order.created_at) }}
                    </span>
                  </div>
                  
                  <div class="mt-2 text-sm text-gray-600">
                    {{ order.items.length }} รายการ
                    <span v-if="order.notes" class="ml-2 text-gray-500">
                      • {{ order.notes }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div class="text-lg font-bold text-gray-900">
                    ₿{{ formatCurrency(order.total_amount) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ order.items.length }} รายการ
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <button
                    @click.stop="editOrder(order)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="แก้ไข"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  
                  <button
                    @click.stop="showOrderDetails(order)"
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="ดูรายละเอียด"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  
                  <button
                    v-if="order.status !== 'cancelled'"
                    @click.stop="cancelOrder(order)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="ยกเลิก"
                  >
                    <XMarkIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center text-sm text-gray-700">
              <span>แสดง {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, totalItems) }} จาก {{ totalItems }} รายการ</span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ก่อนหน้า
              </button>
              
              <span class="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg">
                {{ currentPage }}
              </span>
              
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple Create Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeModals"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">สร้างออเดอร์ใหม่</h3>
        </div>
        <div class="p-6">
          <p class="text-gray-600 mb-4">ฟีเจอร์นี้กำลังพัฒนา กรุณาใช้แอปพลิเคชันหลักในการสร้างออเดอร์</p>
          <div class="flex justify-end space-x-3">
            <button
              @click="closeModals"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import {
  ShoppingBagIcon,
  PlusIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilIcon,
  EyeIcon,
  XMarkIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

import { orderService } from '../../services'
import { menuService } from '../../services'
import { useRealTimeOrders, useRealTimeStats, usePolling } from '../../composables/useRealTime'
import type { Order, OrderCreateRequest, OrderUpdateRequest, OrderStatus, PaymentStatus, MenuItem, Table } from '../../types'
import NotificationToast from '../../components/common/NotificationToast.vue'
import RealTimeStatus from '../../components/common/RealTimeStatus.vue'

// State
const loading = ref(false)
const orders = ref<Order[]>([])
const selectedOrder = ref<Order | null>(null)
const menuItems = ref<MenuItem[]>([])
const tables = ref<Table[]>([])

// Real-time functionality
const { isConnected, connectionStatus, lastUpdate, updateCount, connect, disconnect, reconnect } = useRealTimeOrders()
const { stats: realtimeStats } = useRealTimeStats()
const { isPolling, startPolling, stopPolling } = usePolling(() => {
  if (!isConnected.value) {
    loadOrders()
  }
}, 30000) // Poll every 30 seconds when not connected

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)

// Filters
const filters = ref({
  status: '' as OrderStatus | '',
  payment_status: '' as PaymentStatus | '',
  table_id: '',
  start_date: '',
  end_date: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// Stats
const stats = ref({
  todayOrders: 0,
  todayRevenue: 0,
  pendingOrders: 0,
  completedOrders: 0,
  activeOrders: 0,
  averageOrderValue: 0
})

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: 1,
    order_number: 'ORD-001',
    table_id: 1,
    table: { id: 1, table_number: '1', capacity: 4, status: 'occupied' } as Table,
    customer_name: 'คุณสมชาย',
    status: 'pending',
    payment_status: 'pending',
    items: [
      {
        id: 1,
        order_id: 1,
        menu_item_id: 1,
        menu_item: { id: 1, name: 'กาแฟดำ', price: 35 },
        quantity: 2,
        unit_price: 35,
        total_price: 70
      }
    ],
    subtotal: 70,
    tax: 4.9,
    discount: 0,
    total_amount: 74.9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    order_number: 'ORD-002',
    table_id: 2,
    table: { id: 2, table_number: '2', capacity: 6, status: 'occupied' } as Table,
    customer_name: 'คุณสมหญิง',
    status: 'ready',
    payment_status: 'paid',
    payment_method: 'cash',
    items: [
      {
        id: 2,
        order_id: 2,
        menu_item_id: 2,
        menu_item: { id: 2, name: 'ข้าวผัดไข่', price: 45 },
        quantity: 1,
        unit_price: 45,
        total_price: 45
      }
    ],
    subtotal: 45,
    tax: 3.15,
    discount: 0,
    total_amount: 48.15,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString()
  }
]

// Methods
const loadOrders = async () => {
  loading.value = true
  try {
    // For now, use mock data
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    orders.value = mockOrders
    totalItems.value = mockOrders.length
    
    // Update stats
    stats.value = {
      todayOrders: mockOrders.length,
      todayRevenue: mockOrders.reduce((sum, order) => sum + order.total_amount, 0),
      pendingOrders: mockOrders.filter(order => order.status === 'pending').length,
      completedOrders: mockOrders.filter(order => order.status === 'completed').length,
      activeOrders: mockOrders.filter(order => !['completed', 'cancelled'].includes(order.status)).length,
      averageOrderValue: mockOrders.length > 0 ? mockOrders.reduce((sum, order) => sum + order.total_amount, 0) / mockOrders.length : 0
    }
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    loading.value = false
  }
}

const refreshOrders = async () => {
  await loadOrders()
}

const selectOrder = (order: Order) => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const editOrder = (order: Order) => {
  selectedOrder.value = order
  showEditModal.value = true
}

const showOrderDetails = (order: Order) => {
  selectedOrder.value = order
  showDetailsModal.value = true
}

const cancelOrder = async (order: Order) => {
  if (confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกออเดอร์นี้?')) {
    try {
      // Update order status to cancelled
      const orderIndex = orders.value.findIndex(o => o.id === order.id)
      if (orderIndex >= 0) {
        orders.value[orderIndex].status = 'cancelled'
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
    }
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showDetailsModal.value = false
  selectedOrder.value = null
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadOrders()
  }
}

const handleStatusUpdate = async (orderId: number, status: OrderStatus) => {
  try {
    const orderIndex = orders.value.findIndex(o => o.id === orderId)
    if (orderIndex >= 0) {
      orders.value[orderIndex].status = status
    }
    // Update selected order if it's the same one
    if (selectedOrder.value?.id === orderId) {
      selectedOrder.value.status = status
    }
  } catch (error) {
    console.error('Error updating order status:', error)
  }
}

const handlePaymentUpdate = async (orderId: number, paymentStatus: PaymentStatus, paymentMethod?: string) => {
  try {
    const orderIndex = orders.value.findIndex(o => o.id === orderId)
    if (orderIndex >= 0) {
      orders.value[orderIndex].payment_status = paymentStatus
      if (paymentMethod) {
        orders.value[orderIndex].payment_method = paymentMethod
      }
    }
    // Update selected order if it's the same one
    if (selectedOrder.value?.id === orderId) {
      selectedOrder.value.payment_status = paymentStatus
      if (paymentMethod) {
        selectedOrder.value.payment_method = paymentMethod
      }
    }
  } catch (error) {
    console.error('Error updating payment status:', error)
  }
}

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: th })
}

const getOrderStatusClass = (status: OrderStatus) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'preparing': 'bg-orange-100 text-orange-800',
    'ready': 'bg-green-100 text-green-800',
    'served': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getOrderStatusText = (status: OrderStatus) => {
  const statusTexts = {
    'pending': 'รอดำเนินการ',
    'confirmed': 'ยืนยันแล้ว',
    'preparing': 'กำลังเตรียม',
    'ready': 'พร้อมเสิร์ฟ',
    'served': 'เสิร์ฟแล้ว',
    'completed': 'เสร็จสิ้น',
    'cancelled': 'ยกเลิก'
  }
  return statusTexts[status] || status
}

const getPaymentStatusClass = (status: PaymentStatus) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'paid': 'bg-green-100 text-green-800',
    'partially_paid': 'bg-orange-100 text-orange-800',
    'refunded': 'bg-red-100 text-red-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusText = (status: PaymentStatus) => {
  const statusTexts = {
    'pending': 'รอชำระ',
    'paid': 'ชำระแล้ว',
    'partially_paid': 'ชำระบางส่วน',
    'refunded': 'คืนเงินแล้ว'
  }
  return statusTexts[status] || status
}

// Setup mock tables
tables.value = [
  { id: 1, table_number: '1', capacity: 4, status: 'available' },
  { id: 2, table_number: '2', capacity: 6, status: 'occupied' },
  { id: 3, table_number: '3', capacity: 2, status: 'available' }
] as Table[]

// Lifecycle
onMounted(async () => {
  await loadOrders()
  
  // Start real-time connection
  await connect()
  
  // Start polling as fallback
  startPolling()
  
  // Listen for real-time events
  window.addEventListener('orderCreated', handleOrderCreated)
  window.addEventListener('orderUpdated', handleOrderUpdated)
  window.addEventListener('orderStatusChanged', handleOrderStatusChanged)
  window.addEventListener('paymentUpdated', handlePaymentUpdated)
  window.addEventListener('orderDeleted', handleOrderDeleted)
  window.addEventListener('statsUpdated', handleStatsUpdated)
})

onUnmounted(() => {
  // Cleanup
  disconnect()
  stopPolling()
  
  // Remove event listeners
  window.removeEventListener('orderCreated', handleOrderCreated)
  window.removeEventListener('orderUpdated', handleOrderUpdated)
  window.removeEventListener('orderStatusChanged', handleOrderStatusChanged)
  window.removeEventListener('paymentUpdated', handlePaymentUpdated)
  window.removeEventListener('orderDeleted', handleOrderDeleted)
  window.removeEventListener('statsUpdated', handleStatsUpdated)
})

// Real-time event handlers
const handleOrderCreated = (event: any) => {
  const newOrder = event.detail
  orders.value.unshift(newOrder)
  totalItems.value++
  
  // Update stats
  updateLocalStats()
  
  // Show notification
  showNotification('ออเดอร์ใหม่', `ออเดอร์ #${newOrder.order_number} ถูกสร้างแล้ว`, 'success')
}

const handleOrderUpdated = (event: any) => {
  const updatedOrder = event.detail
  const index = orders.value.findIndex(order => order.id === updatedOrder.id)
  
  if (index >= 0) {
    orders.value[index] = updatedOrder
    
    // Update selected order if it's the same one
    if (selectedOrder.value?.id === updatedOrder.id) {
      selectedOrder.value = updatedOrder
    }
    
    updateLocalStats()
    showNotification('อัปเดตออเดอร์', `ออเดอร์ #${updatedOrder.order_number} ถูกอัปเดตแล้ว`, 'info')
  }
}

const handleOrderStatusChanged = (event: any) => {
  const { orderId, status } = event.detail
  const index = orders.value.findIndex(order => order.id === orderId)
  
  if (index >= 0) {
    orders.value[index].status = status
    
    if (selectedOrder.value && selectedOrder.value.id === orderId) {
      selectedOrder.value.status = status
    }
    
    updateLocalStats()
    showNotification('เปลี่ยนสถานะ', `ออเดอร์ #${orders.value[index].order_number} เปลี่ยนเป็น ${getOrderStatusText(status)}`, 'info')
  }
}

const handlePaymentUpdated = (event: any) => {
  const { orderId, paymentStatus, paymentMethod } = event.detail
  const index = orders.value.findIndex(order => order.id === orderId)
  
  if (index >= 0) {
    orders.value[index].payment_status = paymentStatus
    if (paymentMethod) {
      orders.value[index].payment_method = paymentMethod
    }
    
    if (selectedOrder.value && selectedOrder.value.id === orderId) {
      selectedOrder.value.payment_status = paymentStatus
      if (paymentMethod) {
        selectedOrder.value.payment_method = paymentMethod
      }
    }
    
    updateLocalStats()
    showNotification('อัปเดตการชำระเงิน', `การชำระเงินออเดอร์ #${orders.value[index].order_number} ถูกอัปเดตแล้ว`, 'success')
  }
}

const handleOrderDeleted = (event: any) => {
  const { orderId } = event.detail
  const index = orders.value.findIndex(order => order.id === orderId)
  
  if (index >= 0) {
    const deletedOrder = orders.value[index]
    orders.value.splice(index, 1)
    totalItems.value--
    
    if (selectedOrder.value?.id === orderId) {
      closeModals()
    }
    
    updateLocalStats()
    showNotification('ลบออเดอร์', `ออเดอร์ #${deletedOrder.order_number} ถูกลบแล้ว`, 'warning')
  }
}

const handleStatsUpdated = (event: any) => {
  const newStats = event.detail
  Object.assign(stats.value, newStats)
}

// Update local stats based on current orders
const updateLocalStats = () => {
  stats.value.todayOrders = orders.value.length
  stats.value.todayRevenue = orders.value.reduce((sum, order) => sum + order.total_amount, 0)
  stats.value.pendingOrders = orders.value.filter(order => order.status === 'pending').length
  stats.value.completedOrders = orders.value.filter(order => order.status === 'completed').length
  stats.value.activeOrders = orders.value.filter(order => !['completed', 'cancelled'].includes(order.status)).length
  stats.value.averageOrderValue = orders.value.length > 0 ? stats.value.todayRevenue / orders.value.length : 0
}

// Notification system
const showNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
  // Emit custom event for NotificationToast component
  window.dispatchEvent(new CustomEvent('showNotification', {
    detail: { title, message, type, duration: 5000 }
  }))
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
