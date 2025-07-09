<template>
  <div class="space-y-6">
    <!-- Order Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">ออเดอร์ #{{ order.order_number }}</h2>
          <p class="text-gray-600 mt-1">{{ formatDateTime(order.created_at) }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <span :class="getOrderStatusClass(order.status)" class="px-3 py-1 text-sm font-medium rounded-full">
            {{ getOrderStatusText(order.status) }}
          </span>
          <span :class="getPaymentStatusClass(order.payment_status)" class="px-3 py-1 text-sm font-medium rounded-full">
            {{ getPaymentStatusText(order.payment_status) }}
          </span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div v-if="order.table">
          <span class="text-gray-500">โต๊ะ:</span>
          <span class="ml-2 font-medium">โต๊ะ {{ order.table.table_number }}</span>
        </div>
        <div v-if="order.customer_name">
          <span class="text-gray-500">ลูกค้า:</span>
          <span class="ml-2 font-medium">{{ order.customer_name }}</span>
        </div>
        <div>
          <span class="text-gray-500">รายการ:</span>
          <span class="ml-2 font-medium">{{ order.items.length }} รายการ</span>
        </div>
      </div>
    </div>

    <!-- Order Items -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">รายการอาหาร</h3>
      </div>
      <div class="divide-y divide-gray-200">
        <div
          v-for="item in order.items"
          :key="item.id"
          class="px-6 py-4 flex items-center justify-between"
        >
          <div class="flex-1">
            <h4 class="font-medium text-gray-900">
              {{ item.menu_item?.name || 'Unknown Item' }}
            </h4>
            <p class="text-sm text-gray-500 mt-1">
              ₿{{ formatCurrency(item.unit_price) }} × {{ item.quantity }}
            </p>
            <p v-if="item.notes" class="text-sm text-gray-600 mt-1">
              หมายเหตุ: {{ item.notes }}
            </p>
          </div>
          <div class="text-lg font-semibold text-gray-900">
            ₿{{ formatCurrency(item.total_price) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="bg-gray-50 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">สรุปการชำระเงิน</h3>
      <div class="space-y-3">
        <div class="flex justify-between text-gray-600">
          <span>ยอดรวม</span>
          <span>₿{{ formatCurrency(order.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>ภาษี</span>
          <span>₿{{ formatCurrency(order.tax) }}</span>
        </div>
        <div v-if="order.discount > 0" class="flex justify-between text-green-600">
          <span>ส่วนลด</span>
          <span>-₿{{ formatCurrency(order.discount) }}</span>
        </div>
        <div class="border-t border-gray-200 pt-3">
          <div class="flex justify-between text-xl font-bold text-gray-900">
            <span>ยอดสุทธิ</span>
            <span>₿{{ formatCurrency(order.total_amount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Notes -->
    <div v-if="order.notes" class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
      <h4 class="text-sm font-medium text-yellow-800 mb-2">หมายเหตุ</h4>
      <p class="text-sm text-yellow-700">{{ order.notes }}</p>
    </div>

    <!-- Status Update Section -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">อัปเดตสถานะ</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Order Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะออเดอร์</label>
          <div class="flex space-x-2">
            <select 
              v-model="selectedOrderStatus" 
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">รอดำเนินการ</option>
              <option value="confirmed">ยืนยันแล้ว</option>
              <option value="preparing">กำลังเตรียม</option>
              <option value="ready">พร้อมเสิร์ฟ</option>
              <option value="served">เสิร์ฟแล้ว</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
            <button
              @click="updateOrderStatus"
              :disabled="selectedOrderStatus === order.status || updating"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ updating ? 'กำลังอัปเดต...' : 'อัปเดต' }}
            </button>
          </div>
        </div>

        <!-- Payment Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">สถานะการชำระเงิน</label>
          <div class="space-y-2">
            <div class="flex space-x-2">
              <select 
                v-model="selectedPaymentStatus" 
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">รอชำระ</option>
                <option value="paid">ชำระแล้ว</option>
                <option value="partially_paid">ชำระบางส่วน</option>
                <option value="refunded">คืนเงินแล้ว</option>
              </select>
              <button
                @click="updatePaymentStatus"
                :disabled="selectedPaymentStatus === order.payment_status || updating"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ updating ? 'กำลังอัปเดต...' : 'อัปเดต' }}
              </button>
            </div>
            
            <div v-if="selectedPaymentStatus === 'paid'">
              <select 
                v-model="selectedPaymentMethod" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">เลือกวิธีการชำระเงิน</option>
                <option value="cash">เงินสด</option>
                <option value="credit_card">บัตรเครดิต</option>
                <option value="debit_card">บัตรเดบิต</option>
                <option value="bank_transfer">โอนเงิน</option>
                <option value="mobile_payment">Mobile Payment</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex flex-wrap gap-3">
      <button
        v-if="order.status !== 'cancelled'"
        @click="quickUpdateStatus('confirmed')"
        :disabled="order.status === 'confirmed' || updating"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ยืนยันออเดอร์
      </button>
      
      <button
        v-if="['confirmed', 'preparing'].includes(order.status)"
        @click="quickUpdateStatus('ready')"
        :disabled="order.status === 'ready' || updating"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        พร้อมเสิร์ฟ
      </button>
      
      <button
        v-if="order.status === 'ready'"
        @click="quickUpdateStatus('served')"
        :disabled="updating"
        class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        เสิร์ฟแล้ว
      </button>
      
      <button
        v-if="order.payment_status === 'pending'"
        @click="quickPaymentUpdate('paid', 'cash')"
        :disabled="updating"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ชำระเงินสด
      </button>
      
      <button
        v-if="order.status !== 'cancelled' && order.status !== 'completed'"
        @click="cancelOrder"
        :disabled="updating"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ยกเลิกออเดอร์
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import type { Order, OrderStatus, PaymentStatus } from '../../types'

interface Props {
  order: Order
}

interface Emits {
  (e: 'update-status', orderId: number, status: OrderStatus): void
  (e: 'update-payment', orderId: number, paymentStatus: PaymentStatus, paymentMethod?: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const updating = ref(false)
const selectedOrderStatus = ref<OrderStatus>(props.order.status)
const selectedPaymentStatus = ref<PaymentStatus>(props.order.payment_status)
const selectedPaymentMethod = ref(props.order.payment_method || '')

// Methods
const updateOrderStatus = async () => {
  if (selectedOrderStatus.value === props.order.status) return
  
  updating.value = true
  try {
    emit('update-status', props.order.id, selectedOrderStatus.value)
  } finally {
    updating.value = false
  }
}

const updatePaymentStatus = async () => {
  if (selectedPaymentStatus.value === props.order.payment_status) return
  
  updating.value = true
  try {
    emit('update-payment', props.order.id, selectedPaymentStatus.value, selectedPaymentMethod.value)
  } finally {
    updating.value = false
  }
}

const quickUpdateStatus = async (status: OrderStatus) => {
  updating.value = true
  try {
    selectedOrderStatus.value = status
    emit('update-status', props.order.id, status)
  } finally {
    updating.value = false
  }
}

const quickPaymentUpdate = async (paymentStatus: PaymentStatus, paymentMethod: string) => {
  updating.value = true
  try {
    selectedPaymentStatus.value = paymentStatus
    selectedPaymentMethod.value = paymentMethod
    emit('update-payment', props.order.id, paymentStatus, paymentMethod)
  } finally {
    updating.value = false
  }
}

const cancelOrder = async () => {
  if (confirm('คุณแน่ใจหรือไม่ที่จะยกเลิกออเดอร์นี้?')) {
    await quickUpdateStatus('cancelled')
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

// Watch for prop changes
onMounted(() => {
  selectedOrderStatus.value = props.order.status
  selectedPaymentStatus.value = props.order.payment_status
  selectedPaymentMethod.value = props.order.payment_method || ''
})
</script>
