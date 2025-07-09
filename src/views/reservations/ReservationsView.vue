<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header Section -->
    <div class="bg-white shadow-lg border-b border-blue-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <CalendarDaysIcon class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">การจัดการการจอง</h1>
              <p class="text-sm text-gray-600 mt-1">จองโต๊ะ เก็บมัดจำ และติดตามสถานะ</p>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex items-center space-x-3">
            <!-- Real-time Status -->
            <RealTimeStatus
              :is-connected="isConnected"
              :connection-status="connectionStatus"
              :last-update="lastUpdate"
              :update-count="updateCount"
              :is-polling="isPolling"
              :on-reconnect="reconnect"
            />
            
            <button
              @click="refreshReservations"
              class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors"
              :disabled="loading"
            >
              <ArrowPathIcon class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
              รีเฟรช
            </button>
            <button
              @click="() => { console.log('Button clicked! Modal state:', showCreateModal); showCreateModal = true; console.log('Modal state after:', showCreateModal) }"
              class="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transition-all transform hover:scale-105"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              จองใหม่
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">การจองวันนี้</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats.today_reservations || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarDaysIcon class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 border border-green-100">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">มัดจำรวม</p>
              <p class="text-3xl font-bold text-green-600">₿{{ formatCurrency(stats.total_deposit_amount || 0) }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BanknotesIcon class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 border border-yellow-100">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">รอยืนยัน</p>
              <p class="text-3xl font-bold text-yellow-600">{{ stats.pending_confirmations || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">เข้าใช้บริการแล้ว</p>
              <p class="text-3xl font-bold text-purple-600">{{ stats.checked_in || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 border border-blue-100">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">สถานะการจอง</label>
            <select 
              v-model="filters.status" 
              @change="loadReservations"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">ทั้งหมด</option>
              <option value="pending">รอยืนยัน</option>
              <option value="confirmed">ยืนยันแล้ว</option>
              <option value="deposit_pending">รอชำระมัดจำ</option>
              <option value="deposit_paid">ชำระมัดจำแล้ว</option>
              <option value="checked_in">เช็คอินแล้ว</option>
              <option value="seated">นั่งโต๊ะแล้ว</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="cancelled">ยกเลิก</option>
              <option value="no_show">ไม่มาตามนัด</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">โต๊ะ</label>
            <select 
              v-model="filters.table_id" 
              @change="loadReservations"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              @change="loadReservations"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">วันที่สิ้นสุด</label>
            <input 
              type="date" 
              v-model="filters.end_date"
              @change="loadReservations"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อลูกค้า</label>
            <input 
              type="text" 
              v-model="filters.customer_name"
              @input="debounceSearch"
              placeholder="ค้นหาชื่อลูกค้า"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">เบอร์โทร</label>
            <input 
              type="text" 
              v-model="filters.customer_phone"
              @input="debounceSearch"
              placeholder="ค้นหาเบอร์โทร"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Reservations List -->
      <div class="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900">รายการการจอง</h3>
        </div>
        
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">กำลังโหลด...</span>
        </div>
        
        <div v-else-if="reservations.length === 0" class="text-center py-12">
          <CalendarDaysIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">ไม่มีการจอง</h3>
          <p class="mt-1 text-gray-500">เริ่มต้นด้วยการสร้างการจองใหม่</p>
          <button
            @click="showCreateModal = true"
            class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            จองใหม่
          </button>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="reservation in reservations"
            :key="reservation.id"
            class="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            @click="selectReservation(reservation)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-sm font-bold text-blue-600">{{ reservation.table?.table_number || 'N/A' }}</span>
                  </div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <h4 class="text-lg font-semibold text-gray-900">
                      {{ reservation.customer_name }}
                    </h4>
                    <span :class="getReservationStatusClass(reservation.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getReservationStatusText(reservation.status) }}
                    </span>
                    <span v-if="reservation.deposit_amount" :class="getDepositStatusClass(reservation)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ getDepositStatusText(reservation) }}
                    </span>
                  </div>
                  
                  <div class="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                    <span v-if="reservation.table">
                      <MapPinIcon class="w-4 h-4 inline mr-1" />
                      โต๊ะ {{ reservation.table.table_number }}
                    </span>
                    <span>
                      <PhoneIcon class="w-4 h-4 inline mr-1" />
                      {{ reservation.customer_phone }}
                    </span>
                    <span>
                      <ClockIcon class="w-4 h-4 inline mr-1" />
                      {{ formatDateTime(reservation.reservation_time) }}
                    </span>
                    <span>
                      <UsersIcon class="w-4 h-4 inline mr-1" />
                      {{ reservation.number_of_guests }} คน
                    </span>
                  </div>
                  
                  <div v-if="reservation.notes || reservation.special_requests" class="mt-2 text-sm text-gray-600">
                    <span v-if="reservation.notes" class="block">
                      <span class="font-medium">หมายเหตุ:</span> {{ reservation.notes }}
                    </span>
                    <span v-if="reservation.special_requests" class="block">
                      <span class="font-medium">ความต้องการพิเศษ:</span> {{ reservation.special_requests }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="text-right">
                  <div v-if="reservation.deposit_amount" class="text-lg font-bold text-gray-900">
                    มัดจำ: ₿{{ formatCurrency(reservation.deposit_amount) }}
                  </div>
                  <div v-if="reservation.total_estimated_cost" class="text-sm text-gray-500">
                    ประมาณ: ₿{{ formatCurrency(reservation.total_estimated_cost) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ reservation.number_of_guests }} คน
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <!-- Quick Actions -->
                  <button
                    v-if="reservation.status === 'confirmed' && canCheckIn(reservation)"
                    @click.stop="checkInReservation(reservation)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="เช็คอิน"
                  >
                    <CheckIcon class="w-5 h-5" />
                  </button>
                  
                  <button
                    v-if="!reservation.deposit_paid && reservation.deposit_amount"
                    @click.stop="showDepositModal(reservation)"
                    class="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="บันทึกการชำระมัดจำ"
                  >
                    <BanknotesIcon class="w-5 h-5" />
                  </button>
                  
                  <button
                    @click.stop="editReservation(reservation)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="แก้ไข"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  
                  <button
                    @click.stop="showReservationDetails(reservation)"
                    class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="ดูรายละเอียด"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  
                  <button
                    v-if="['pending', 'confirmed', 'deposit_pending', 'deposit_paid'].includes(reservation.status)"
                    @click.stop="cancelReservation(reservation)"
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
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">สร้างการจองใหม่</h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleCreateReservation" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อลูกค้า *</label>
                <input 
                  type="text" 
                  v-model="newReservation.customer_name"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ชื่อ-นามสกุล"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์ *</label>
                <input 
                  type="tel" 
                  v-model="newReservation.customer_phone"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="08X-XXX-XXXX"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                <input 
                  type="email" 
                  v-model="newReservation.customer_email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">โต๊ะ *</label>
                <select 
                  v-model="newReservation.table_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">เลือกโต๊ะ</option>
                  <option v-for="table in tables" :key="table.id" :value="table.id">
                    โต๊ะ {{ table.table_number }} ({{ table.capacity }} ที่นั่ง)
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">วันที่จอง *</label>
                <input 
                  type="date" 
                  v-model="newReservation.reservation_date"
                  required
                  :min="new Date().toISOString().split('T')[0]"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">เวลาจอง *</label>
                <input 
                  type="time" 
                  v-model="newReservation.reservation_time"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">จำนวนลูกค้า *</label>
                <input 
                  type="number" 
                  v-model="newReservation.number_of_guests"
                  required
                  min="1"
                  max="20"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="จำนวนคน"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">มัดจำ (บาท)</label>
                <input 
                  type="number" 
                  v-model="newReservation.deposit_amount"
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">หมายเหตุ</label>
              <textarea 
                v-model="newReservation.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="หมายเหตุเพิ่มเติม"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">ความต้องการพิเศษ</label>
              <textarea 
                v-model="newReservation.special_requests"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="เช่น ไม่ทานเผ็ด, ต้องการเก้าอี้เด็ก, โต๊ะใกล้หน้าต่าง"
              ></textarea>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModals"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :disabled="saving"
              >
                <span v-if="saving">กำลังบันทึก...</span>
                <span v-else>บันทึกการจอง</span>
              </button>
            </div>
          </form>
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
  CalendarDaysIcon,
  PlusIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilIcon,
  EyeIcon,
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  UsersIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

import { reservationService } from '../../services'
import { useRealTimeOrders } from '../../composables/useRealTime'
import type { 
  Reservation, 
  ReservationCreateRequest, 
  ReservationUpdateRequest, 
  ReservationStatus,
  ReservationStats
} from '../../types'
import type { Table } from '../../types/table'

// Import components
import NotificationToast from '../../components/common/NotificationToast.vue'
import RealTimeStatus from '../../components/common/RealTimeStatus.vue'

// State
const loading = ref(false)
const saving = ref(false)
const reservations = ref<Reservation[]>([])
const selectedReservation = ref<Reservation | null>(null)
const tables = ref<Table[]>([])

// Real-time functionality
const { isConnected, connectionStatus, lastUpdate, updateCount, connect, disconnect, reconnect } = useRealTimeOrders()
const isPolling = ref(false)

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const showDepositPaymentModal = ref(false)

// Filters
const filters = ref({
  status: '' as ReservationStatus | '',
  table_id: '',
  start_date: '',
  end_date: '',
  customer_name: '',
  customer_phone: ''
})

// New reservation form
const newReservation = ref({
  table_id: 0,
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  reservation_date: '',
  reservation_time: '',
  number_of_guests: 1,
  notes: '',
  special_requests: '',
  deposit_amount: 0
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

// Stats
const stats = ref<ReservationStats>({
  total_reservations: 0,
  today_reservations: 0,
  pending_confirmations: 0,
  deposit_pending: 0,
  checked_in: 0,
  completed_today: 0,
  cancelled_today: 0,
  no_shows_today: 0,
  total_deposit_amount: 0,
  average_party_size: 0
})

// Search debounce
let searchTimeout: NodeJS.Timeout

// Methods
const loadReservations = async () => {
  loading.value = true
  try {
    // For now, use mock data
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    const mockReservations = reservationService.getMockReservations()
    reservations.value = mockReservations
    totalItems.value = mockReservations.length
    
    // Update stats
    stats.value = reservationService.getMockStats()
  } catch (error) {
    console.error('Error loading reservations:', error)
    showNotification('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลการจองได้', 'error')
  } finally {
    loading.value = false
  }
}

const refreshReservations = async () => {
  console.log('Refreshing reservations...')
  await loadReservations()
  showNotification('รีเฟรชสำเร็จ', 'ข้อมูลการจองได้รับการอัปเดตแล้ว', 'success')
}

const selectReservation = (reservation: Reservation) => {
  selectedReservation.value = reservation
  showDetailsModal.value = true
}

const editReservation = (reservation: Reservation) => {
  selectedReservation.value = reservation
  showEditModal.value = true
}

const showReservationDetails = (reservation: Reservation) => {
  selectedReservation.value = reservation
  showDetailsModal.value = true
}

const showDepositModal = (reservation: Reservation) => {
  selectedReservation.value = reservation
  showDepositPaymentModal.value = true
}

const checkInReservation = async (reservation: Reservation) => {
  try {
    // Update reservation status
    const index = reservations.value.findIndex(r => r.id === reservation.id)
    if (index >= 0) {
      reservations.value[index].status = 'checked_in'
    }
    
    // Update selected reservation
    if (selectedReservation.value?.id === reservation.id) {
      selectedReservation.value.status = 'checked_in'
    }
    
    showNotification('เช็คอินสำเร็จ', `${reservation.customer_name} เช็คอินเรียบร้อยแล้ว`, 'success')
  } catch (error) {
    console.error('Error checking in reservation:', error)
    showNotification('เกิดข้อผิดพลาด', 'ไม่สามารถเช็คอินได้', 'error')
  }
}

const cancelReservation = async (reservation: Reservation) => {
  if (confirm(`คุณแน่ใจหรือไม่ที่จะยกเลิกการจองของ ${reservation.customer_name}?`)) {
    try {
      // Update reservation status
      const index = reservations.value.findIndex(r => r.id === reservation.id)
      if (index >= 0) {
        reservations.value[index].status = 'cancelled'
      }
      
      // Update selected reservation
      if (selectedReservation.value?.id === reservation.id) {
        selectedReservation.value.status = 'cancelled'
      }
      
      showNotification('ยกเลิกการจอง', `การจองของ ${reservation.customer_name} ถูกยกเลิกแล้ว`, 'warning')
    } catch (error) {
      console.error('Error cancelling reservation:', error)
      showNotification('เกิดข้อผิดพลาด', 'ไม่สามารถยกเลิกการจองได้', 'error')
    }
  }
}

const handleCreateReservation = async () => {
  console.log('Creating reservation...', newReservation.value)
  
  if (!newReservation.value.customer_name || !newReservation.value.customer_phone || 
      !newReservation.value.table_id || !newReservation.value.reservation_date || 
      !newReservation.value.reservation_time || !newReservation.value.number_of_guests) {
    showNotification('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'error')
    return
  }

  saving.value = true
  try {
    // Combine date and time
    const reservationDateTime = `${newReservation.value.reservation_date} ${newReservation.value.reservation_time}:00`
    
    console.log('Reservation DateTime:', reservationDateTime)
    
    // Create new reservation
    const reservationData: ReservationCreateRequest = {
      table_id: Number(newReservation.value.table_id),
      customer_name: newReservation.value.customer_name,
      customer_phone: newReservation.value.customer_phone,
      customer_email: newReservation.value.customer_email || '',
      reservation_time: reservationDateTime,
      number_of_guests: Number(newReservation.value.number_of_guests),
      notes: newReservation.value.notes || '',
      special_requests: newReservation.value.special_requests || '',
      deposit_amount: Number(newReservation.value.deposit_amount) || 0
    }
    
    const createdReservation: Reservation = {
      id: Date.now(), // Mock ID
      ...reservationData,
      table: tables.value.find(t => t.id === reservationData.table_id),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Created reservation:', createdReservation)
    
    reservations.value.unshift(createdReservation)
    totalItems.value++
    
    // Reset form
    newReservation.value = {
      table_id: 0,
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      reservation_date: today.toISOString().split('T')[0],
      reservation_time: '',
      number_of_guests: 1,
      notes: '',
      special_requests: '',
      deposit_amount: 0
    }
    
    closeModals()
    showNotification('สร้างการจองสำเร็จ', `การจองของ ${createdReservation.customer_name} ถูกสร้างแล้ว`, 'success')
    
    await loadReservations() // Refresh stats
  } catch (error) {
    console.error('Error creating reservation:', error)
    showNotification('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างการจองได้', 'error')
  } finally {
    saving.value = false
  }
}

const closeModals = () => {
  console.log('Closing modals...')
  showCreateModal.value = false
  showEditModal.value = false
  showDetailsModal.value = false
  showDepositPaymentModal.value = false
  selectedReservation.value = null
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadReservations()
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadReservations()
  }, 500)
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

const canCheckIn = (reservation: Reservation) => {
  const reservationTime = new Date(reservation.reservation_time)
  const now = new Date()
  const timeDiff = reservationTime.getTime() - now.getTime()
  
  // Allow check-in 30 minutes before reservation time
  return timeDiff <= 30 * 60 * 1000 && timeDiff >= -2 * 60 * 60 * 1000 // Up to 2 hours after
}

const getReservationStatusClass = (status: ReservationStatus) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'deposit_pending': 'bg-orange-100 text-orange-800',
    'deposit_paid': 'bg-green-100 text-green-800',
    'checked_in': 'bg-indigo-100 text-indigo-800',
    'seated': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'no_show': 'bg-gray-100 text-gray-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getReservationStatusText = (status: ReservationStatus) => {
  const statusTexts = {
    'pending': 'รอยืนยัน',
    'confirmed': 'ยืนยันแล้ว',
    'deposit_pending': 'รอชำระมัดจำ',
    'deposit_paid': 'ชำระมัดจำแล้ว',
    'checked_in': 'เช็คอินแล้ว',
    'seated': 'นั่งโต๊ะแล้ว',
    'completed': 'เสร็จสิ้น',
    'cancelled': 'ยกเลิก',
    'no_show': 'ไม่มาตามนัด'
  }
  return statusTexts[status] || status
}

const getDepositStatusClass = (reservation: Reservation) => {
  if (!reservation.deposit_amount) return ''
  
  if (reservation.deposit_paid) {
    return 'bg-green-100 text-green-800'
  } else {
    return 'bg-red-100 text-red-800'
  }
}

const getDepositStatusText = (reservation: Reservation) => {
  if (!reservation.deposit_amount) return ''
  
  if (reservation.deposit_paid) {
    return 'ชำระมัดจำแล้ว'
  } else {
    return 'ยังไม่ชำระมัดจำ'
  }
}

// Setup mock tables
tables.value = [
  { id: 1, table_number: '1', capacity: 4, status: 'available' },
  { id: 2, table_number: '2', capacity: 6, status: 'available' },
  { id: 3, table_number: '3', capacity: 2, status: 'available' },
  { id: 4, table_number: '4', capacity: 8, status: 'available' },
  { id: 5, table_number: '5', capacity: 6, status: 'available' }
] as Table[]

// Initialize form with today's date
const today = new Date()
newReservation.value.reservation_date = today.toISOString().split('T')[0]

// Lifecycle
onMounted(async () => {
  console.log('ReservationsView mounted!')
  console.log('Initial form data:', newReservation.value)
  console.log('Available tables:', tables.value)
  
  await loadReservations()
  
  // Start real-time connection
  await connect()
  
  // Listen for real-time events
  window.addEventListener('reservationCreated', handleReservationCreated)
  window.addEventListener('reservationUpdated', handleReservationUpdated)
  window.addEventListener('reservationStatusChanged', handleReservationStatusChanged)
  window.addEventListener('depositUpdated', handleDepositUpdated)
  window.addEventListener('reservationDeleted', handleReservationDeleted)
})

onUnmounted(() => {
  // Cleanup
  disconnect()
  
  // Remove event listeners
  window.removeEventListener('reservationCreated', handleReservationCreated)
  window.removeEventListener('reservationUpdated', handleReservationUpdated)
  window.removeEventListener('reservationStatusChanged', handleReservationStatusChanged)
  window.removeEventListener('depositUpdated', handleDepositUpdated)
  window.removeEventListener('reservationDeleted', handleReservationDeleted)
  
  // Clear timeout
  clearTimeout(searchTimeout)
})

// Real-time event handlers
const handleReservationCreated = (event: any) => {
  const newReservationData = event.detail
  reservations.value.unshift(newReservationData)
  totalItems.value++
  showNotification('การจองใหม่', `${newReservationData.customer_name} สร้างการจองใหม่`, 'success')
}

const handleReservationUpdated = (event: any) => {
  const updatedReservation = event.detail
  const index = reservations.value.findIndex(r => r.id === updatedReservation.id)
  
  if (index >= 0) {
    reservations.value[index] = updatedReservation
    
    if (selectedReservation.value?.id === updatedReservation.id) {
      selectedReservation.value = updatedReservation
    }
    
    showNotification('อัปเดตการจอง', `การจองของ ${updatedReservation.customer_name} ถูกอัปเดตแล้ว`, 'info')
  }
}

const handleReservationStatusChanged = (event: any) => {
  const { reservationId, status } = event.detail
  const index = reservations.value.findIndex(r => r.id === reservationId)
  
  if (index >= 0) {
    const reservation = reservations.value[index]
    reservation.status = status
    
    if (selectedReservation.value && selectedReservation.value.id === reservationId) {
      selectedReservation.value.status = status
    }
    
    showNotification('เปลี่ยนสถานะ', `การจองของ ${reservation.customer_name} เปลี่ยนเป็น ${getReservationStatusText(status)}`, 'info')
  }
}

const handleDepositUpdated = (event: any) => {
  const { reservationId, depositPaid, depositMethod, depositReference } = event.detail
  const index = reservations.value.findIndex(r => r.id === reservationId)
  
  if (index >= 0) {
    const reservation = reservations.value[index]
    reservation.deposit_paid = depositPaid
    reservation.deposit_method = depositMethod
    reservation.deposit_reference = depositReference
    
    if (selectedReservation.value && selectedReservation.value.id === reservationId) {
      selectedReservation.value.deposit_paid = depositPaid
      selectedReservation.value.deposit_method = depositMethod
      selectedReservation.value.deposit_reference = depositReference
    }
    
    showNotification('อัปเดตมัดจำ', `การชำระมัดจำของ ${reservation.customer_name} ถูกอัปเดตแล้ว`, 'success')
  }
}

const handleReservationDeleted = (event: any) => {
  const { reservationId } = event.detail
  const index = reservations.value.findIndex(r => r.id === reservationId)
  
  if (index >= 0) {
    const deletedReservation = reservations.value[index]
    reservations.value.splice(index, 1)
    totalItems.value--
    
    if (selectedReservation.value?.id === reservationId) {
      closeModals()
    }
    
    showNotification('ลบการจอง', `การจองของ ${deletedReservation.customer_name} ถูกลบแล้ว`, 'warning')
  }
}

// Notification system
const showNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
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
