<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-400/5"></div>
    <div class="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full filter blur-3xl animate-pulse"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
    
    <!-- Header Section -->
    <div class="bg-white/80 backdrop-blur-lg border-b border-blue-200/30 sticky top-0 z-40 shadow-xl shadow-blue-100/20">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex items-center justify-between py-6">
          <!-- Title and Stats -->
          <div class="flex items-center space-x-8">
            <!-- Icon and Title -->
            <div class="flex items-center space-x-4">
              <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <div class="relative w-18 h-18 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-300/50 transform group-hover:scale-110 transition-all duration-300">
                  <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 10h18M3 14h18m-9-4v8m-7 0V7a2 2 0 012-2h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div class="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <span class="text-xs font-bold text-white">{{ tables.length }}</span>
                </div>
              </div>
              <div class="space-y-1">
                <h1 class="text-5xl font-extrabold bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent animate-gradient">
                  จัดการโต๊ะ
                </h1>
                <p class="text-blue-700/80 font-medium text-lg">จัดการโต๊ะและสร้าง QR Code สำหรับลูกค้า</p>
              </div>
            </div>
            
            <!-- Quick Stats -->
            <div class="hidden lg:flex items-center space-x-5">
              <div class="group relative">
                <div class="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div class="relative bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 px-5 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                    <span class="text-sm text-green-800 font-bold">ว่าง: {{ stats.available }}</span>
                  </div>
                </div>
              </div>
              <div class="group relative">
                <div class="absolute -inset-1 bg-gradient-to-r from-red-400 to-rose-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div class="relative bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50 px-5 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-full animate-pulse shadow-lg"></div>
                    <span class="text-sm text-red-800 font-bold">มีลูกค้า: {{ stats.occupied }}</span>
                  </div>
                </div>
              </div>
              <div class="group relative">
                <div class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div class="relative bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/50 px-5 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full animate-pulse shadow-lg"></div>
                    <span class="text-sm text-yellow-800 font-bold">จอง: {{ stats.reserved }}</span>
                  </div>
                </div>
              </div>
              <div class="group relative">
                <div class="absolute -inset-1 bg-gradient-to-r from-gray-400 to-slate-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div class="relative bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200/50 px-5 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                  <div class="flex items-center space-x-3">
                    <div class="w-4 h-4 bg-gradient-to-r from-gray-500 to-slate-500 rounded-full shadow-lg"></div>
                    <span class="text-sm text-gray-800 font-bold">ปิด: {{ stats.maintenance }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center space-x-4">
            <button
              @click="refreshTables"
              :disabled="loading"
              class="flex items-center px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5 mr-2" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              รีเฟรช
            </button>
            
            <button
              @click="openCreateModal"
              class="group relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div class="relative flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                เพิ่มโต๊ะใหม่
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
      <!-- Filter Section -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
            <select
              v-model="filters.status"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">ทั้งหมด</option>
              <option value="available">ว่าง</option>
              <option value="occupied">มีลูกค้า</option>
              <option value="reserved">จอง</option>
              <option value="maintenance">ปิดปรับปรุง</option>
            </select>
          </div>

          <!-- Capacity Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">จำนวนที่นั่ง</label>
            <select
              v-model="filters.capacity"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">ทั้งหมด</option>
              <option value="2">2 ที่นั่ง</option>
              <option value="4">4 ที่นั่ง</option>
              <option value="6">6 ที่นั่ง</option>
              <option value="8">8+ ที่นั่ง</option>
            </select>
          </div>

          <!-- Location Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ตำแหน่ง</label>
            <select
              v-model="filters.location"
              @change="applyFilters"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">ทั้งหมด</option>
              <option value="indoor">ในร้าน</option>
              <option value="outdoor">นอกร้าน</option>
              <option value="terrace">ระเบียง</option>
              <option value="private">ห้องส่วนตัว</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="applyFilters"
                type="text"
                placeholder="หมายเลขโต๊ะ..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Tables Grid -->
      <div v-if="loading && tables.length === 0" class="flex justify-center items-center py-12">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-500">กำลังโหลดข้อมูลโต๊ะ...</p>
        </div>
      </div>

      <div v-else-if="filteredTables.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบโต๊ะ</h3>
        <p class="text-gray-500 mb-6">ไม่มีโต๊ะที่ตรงกับเงื่อนไขที่ค้นหา</p>
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ล้างตัวกรอง
        </button>
      </div>

      <!-- Tables Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div
          v-for="table in filteredTables"
          :key="table.id"
          class="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden hover:shadow-2xl hover:shadow-blue-200/25 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
        >
          <!-- Gradient Border Effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <!-- Glow Effect -->
          <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500"></div>
          
          <!-- Main Card Content -->
          <div class="relative bg-white rounded-2xl overflow-hidden">
            <!-- Table Card Header -->
            <div class="p-6 border-b border-gray-100/80 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <!-- Table Number Circle -->
                    <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                         :class="getTableStatusColor(table.status)">
                      {{ table.table_number }}
                    </div>
                    <!-- Status Indicator -->
                    <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full shadow-lg"
                         :class="getStatusIndicatorClass(table.status)">
                    </div>
                  </div>
                  <div class="space-y-1">
                    <h3 class="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">โต๊ะ {{ table.table_number }}</h3>
                    <div class="flex items-center space-x-2">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-600">{{ table.capacity }} ที่นั่ง</span>
                    </div>
                  </div>
                </div>
                
                <!-- Status Badge -->
                <div class="relative">
                  <span class="px-3 py-1.5 text-xs font-bold rounded-full shadow-sm"
                        :class="getStatusBadgeClass(table.status)">
                    {{ TABLE_STATUSES[table.status] }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Table Card Content -->
            <div class="p-6 space-y-4">
              <!-- Table Info -->
              <div class="space-y-3">
                <div v-if="table.location" class="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <svg class="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="font-medium">{{ getLocationText(table.location) }}</span>
                </div>
                
                <div v-if="table.current_order_id" class="flex items-center text-sm text-blue-700 bg-blue-50 p-3 rounded-xl">
                  <svg class="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="font-semibold">ออเดอร์ #{{ table.current_order_id }}</span>
                </div>
                
                <div v-if="table.current_reservation_id" class="flex items-center text-sm text-amber-700 bg-amber-50 p-3 rounded-xl">
                  <svg class="w-5 h-5 mr-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l6 6m0-6l-6 6" />
                  </svg>
                  <span class="font-semibold">การจอง #{{ table.current_reservation_id }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="grid grid-cols-2 gap-3 pt-2">
                <!-- QR Code Button -->
                <button
                  @click="generateQRCode(table)"
                  class="group relative flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <svg class="w-5 h-5 mr-2 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span class="text-sm font-bold relative z-10">QR Code</span>
                </button>

                <!-- Edit Button -->
                <button
                  @click="editTable(table)"
                  class="group relative flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="text-sm font-bold">แก้ไข</span>
                </button>
              </div>

              <!-- Secondary Actions -->
              <div class="flex gap-2 pt-2">
                <!-- Status Toggle -->
                <button
                  @click="toggleTableStatus(table)"
                  :disabled="updatingStatus === table.id"
                  class="px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm"
                >
                  <svg class="w-4 h-4" :class="{ 'animate-spin': updatingStatus === table.id }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>

                <!-- Delete Button -->
                <button
                  @click="confirmDeleteTable(table)"
                  class="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { tableService } from '../../services/table.service'
import { useRealTimeOrders } from '../../composables/useRealTime'
import NotificationToast from '../../components/common/NotificationToast.vue'
import type { Table, TableStatus, TableCreateRequest, TableUpdateRequest } from '../../types/table'
import { TABLE_STATUSES } from '../../types/table'

// Real-time connection
const { isConnected, reconnect } = useRealTimeOrders()

// Data
const tables = ref<Table[]>([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const updatingStatus = ref<number | null>(null)

// Modals
const showTableModal = ref(false)
const showQRModal = ref(false)
const showDeleteModal = ref(false)

// Form data
const editingTable = ref<Table | null>(null)
const tableToDelete = ref<Table | null>(null)
const qrCodeTable = ref<Table | null>(null)
const qrCodeData = ref<any>(null)

const tableForm = ref<TableCreateRequest & { status?: TableStatus }>({
  table_number: '',
  capacity: undefined as any,
  location: '',
  is_active: true,
  status: 'available'
})

// Filters
const filters = ref({
  status: '',
  capacity: '',
  location: ''
})

const searchQuery = ref('')

// Mock data for development
const mockTables: Table[] = [
  {
    id: 1,
    table_number: 'T01',
    capacity: 4,
    status: 'available',
    location: 'indoor',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    table_number: 'T02',
    capacity: 2,
    status: 'occupied',
    location: 'indoor',
    is_active: true,
    current_order_id: 1001,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    table_number: 'T03',
    capacity: 6,
    status: 'reserved',
    location: 'outdoor',
    is_active: true,
    current_reservation_id: 501,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    table_number: 'VIP01',
    capacity: 8,
    status: 'maintenance',
    location: 'private',
    is_active: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    table_number: 'T04',
    capacity: 4,
    status: 'available',
    location: 'terrace',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    table_number: 'T05',
    capacity: 2,
    status: 'available',
    location: 'indoor',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

// Computed
const stats = computed(() => {
  const available = tables.value.filter(t => t.status === 'available' && t.is_active).length
  const occupied = tables.value.filter(t => t.status === 'occupied').length
  const reserved = tables.value.filter(t => t.status === 'reserved').length
  const maintenance = tables.value.filter(t => t.status === 'maintenance' || !t.is_active).length
  
  return { available, occupied, reserved, maintenance }
})

const filteredTables = computed(() => {
  let result = tables.value

  // Status filter
  if (filters.value.status) {
    result = result.filter(table => table.status === filters.value.status)
  }

  // Capacity filter
  if (filters.value.capacity) {
    const capacity = parseInt(filters.value.capacity)
    if (capacity === 8) {
      result = result.filter(table => table.capacity >= 8)
    } else {
      result = result.filter(table => table.capacity === capacity)
    }
  }

  // Location filter
  if (filters.value.location) {
    result = result.filter(table => table.location === filters.value.location)
  }

  // Search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(table => 
      table.table_number.toLowerCase().includes(query)
    )
  }

  return result
})

// Methods
const loadTables = async () => {
  try {
    loading.value = true
    
    // Try to load from API, fallback to mock data
    try {
      const response = await tableService.getTables()
      tables.value = response.data || response
    } catch (error) {
      console.warn('Failed to load tables from API, using mock data:', error)
      tables.value = mockTables
    }
  } catch (error) {
    console.error('Error loading tables:', error)
    showNotification('เกิดข้อผิดพลาดในการโหลดข้อมูลโต๊ะ', 'error')
    tables.value = mockTables
  } finally {
    loading.value = false
  }
}

const refreshTables = async () => {
  await loadTables()
  showNotification('รีเฟรชข้อมูลโต๊ะเรียบร้อย', 'success')
}

const applyFilters = () => {
  // Filters are reactive, no action needed
}

const clearFilters = () => {
  filters.value = {
    status: '',
    capacity: '',
    location: ''
  }
  searchQuery.value = ''
}

// Table Modal Methods
const openCreateModal = () => {
  editingTable.value = null
  tableForm.value = {
    table_number: '',
    capacity: undefined as any,
    location: '',
    is_active: true,
    status: 'available'
  }
  showTableModal.value = true
}

const editTable = (table: Table) => {
  editingTable.value = table
  tableForm.value = {
    table_number: table.table_number,
    capacity: table.capacity,
    location: table.location || '',
    is_active: table.is_active,
    status: table.status
  }
  showTableModal.value = true
}

const closeTableModal = () => {
  showTableModal.value = false
  editingTable.value = null
  tableForm.value = {
    table_number: '',
    capacity: undefined as any,
    location: '',
    is_active: true,
    status: 'available'
  }
}

const saveTable = async () => {
  try {
    saving.value = true
    
    if (editingTable.value) {
      // Edit mode
      try {
        const updatedTable = await tableService.updateTable(editingTable.value.id, tableForm.value as TableUpdateRequest)
        const index = tables.value.findIndex(t => t.id === editingTable.value!.id)
        if (index !== -1) {
          tables.value[index] = updatedTable
        }
        showNotification('แก้ไขโต๊ะเรียบร้อย', 'success')
      } catch (error) {
        // Mock update for development
        const index = tables.value.findIndex(t => t.id === editingTable.value!.id)
        if (index !== -1) {
          tables.value[index] = {
            ...tables.value[index],
            ...tableForm.value,
            updated_at: new Date().toISOString()
          }
        }
        showNotification('แก้ไขโต๊ะเรียบร้อย (Mock)', 'success')
      }
    } else {
      // Create mode
      try {
        const newTable = await tableService.createTable(tableForm.value)
        tables.value.unshift(newTable)
        showNotification('เพิ่มโต๊ะใหม่เรียบร้อย', 'success')
      } catch (error) {
        // Mock create for development
        const newTable: Table = {
          id: Date.now(),
          table_number: tableForm.value.table_number,
          capacity: parseInt(tableForm.value.capacity as any),
          location: tableForm.value.location,
          is_active: tableForm.value.is_active || true,
          status: 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        tables.value.unshift(newTable)
        showNotification('เพิ่มโต๊ะใหม่เรียบร้อย (Mock)', 'success')
      }
    }
    
    closeTableModal()
  } catch (error) {
    console.error('Error saving table:', error)
    showNotification('เกิดข้อผิดพลาดในการบันทึกโต๊ะ', 'error')
  } finally {
    saving.value = false
  }
}

// Delete Methods
const confirmDeleteTable = (table: Table) => {
  tableToDelete.value = table
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  tableToDelete.value = null
}

const deleteTable = async () => {
  if (!tableToDelete.value) return
  
  try {
    deleting.value = true
    
    try {
      await tableService.deleteTable(tableToDelete.value.id)
    } catch (error) {
      // Mock delete for development
      console.warn('Failed to delete via API, using mock deletion')
    }
    
    tables.value = tables.value.filter(t => t.id !== tableToDelete.value!.id)
    showNotification('ลบโต๊ะเรียบร้อย', 'success')
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting table:', error)
    showNotification('เกิดข้อผิดพลาดในการลบโต๊ะ', 'error')
  } finally {
    deleting.value = false
  }
}

// Status Methods
const toggleTableStatus = async (table: Table) => {
  const statusOrder: TableStatus[] = ['available', 'occupied', 'reserved', 'maintenance']
  const currentIndex = statusOrder.indexOf(table.status)
  const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
  
  try {
    updatingStatus.value = table.id
    
    try {
      const updatedTable = await tableService.updateTableStatus(table.id, nextStatus)
      const index = tables.value.findIndex(t => t.id === table.id)
      if (index !== -1) {
        tables.value[index] = updatedTable
      }
    } catch (error) {
      // Mock status update
      const index = tables.value.findIndex(t => t.id === table.id)
      if (index !== -1) {
        tables.value[index] = {
          ...tables.value[index],
          status: nextStatus,
          updated_at: new Date().toISOString()
        }
      }
    }
    
    showNotification(`เปลี่ยนสถานะโต๊ะ ${table.table_number} เป็น "${TABLE_STATUSES[nextStatus]}"`, 'success')
  } catch (error) {
    console.error('Error updating table status:', error)
    showNotification('เกิดข้อผิดพลาดในการเปลี่ยนสถานะโต๊ะ', 'error')
  } finally {
    updatingStatus.value = null
  }
}

// QR Code Methods
const generateQRCode = async (table: Table) => {
  qrCodeTable.value = table
  
  // Generate QR code data
  qrCodeData.value = {
    table_id: table.id,
    table_number: table.table_number,
    restaurant_url: `${window.location.origin}/order?table=${table.table_number}&id=${table.id}`
  }
  
  showQRModal.value = true
  
  // Generate QR code after modal is shown
  await nextTick()
  await generateQRCodeImage()
}

const generateQRCodeImage = async () => {
  if (!qrCodeData.value) return
  
  try {
    // Clear previous QR code
    const qrContainer = document.getElementById('qrcode')
    if (qrContainer) {
      qrContainer.innerHTML = ''
    }
    
    // Dynamic import for QR code library
    const QRCode = await import('qrcode')
    
    // Create canvas element for QR code
    const canvas = document.createElement('canvas')
    canvas.className = 'mx-auto'
    
    // Generate QR code
    await QRCode.toCanvas(canvas, qrCodeData.value.restaurant_url, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    if (qrContainer) {
      qrContainer.appendChild(canvas)
    }
    
  } catch (error) {
    console.error('Error generating QR code:', error)
    
    // Fallback to placeholder QR code
    const qrContainer = document.getElementById('qrcode')
    if (qrContainer) {
      qrContainer.innerHTML = ''
      
      const qrDiv = document.createElement('div')
      qrDiv.className = 'w-48 h-48 bg-black mx-auto flex items-center justify-center text-white text-sm'
      qrDiv.innerHTML = `
        <div class="text-center">
          <div class="text-xs mb-2">QR Code</div>
          <div class="text-xs">Table: ${qrCodeTable.value?.table_number}</div>
          <div class="text-xs mt-2 break-all">${qrCodeData.value.restaurant_url}</div>
        </div>
      `
      
      qrContainer.appendChild(qrDiv)
    }
    
    showNotification('เกิดข้อผิดพลาดในการสร้าง QR Code', 'error')
  }
}

const closeQRModal = () => {
  showQRModal.value = false
  qrCodeTable.value = null
  qrCodeData.value = null
}

// Utility Methods
const getTableStatusColor = (status: TableStatus) => {
  const colors = {
    available: 'bg-green-500',
    occupied: 'bg-red-500',
    reserved: 'bg-yellow-500',
    maintenance: 'bg-gray-500'
  }
  return colors[status] || 'bg-gray-500'
}

const getStatusBadgeClass = (status: TableStatus) => {
  const classes = {
    available: 'bg-green-100 text-green-800',
    occupied: 'bg-red-100 text-red-800',
    reserved: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusIndicatorClass = (status: TableStatus) => {
  const classes = {
    available: 'bg-green-500 animate-pulse',
    occupied: 'bg-red-500 animate-pulse',
    reserved: 'bg-yellow-500 animate-pulse',
    maintenance: 'bg-gray-400'
  }
  return classes[status] || 'bg-gray-400'
}

const getLocationText = (location: string) => {
  const locations = {
    indoor: 'ในร้าน',
    outdoor: 'นอกร้าน',
    terrace: 'ระเบียง',
    private: 'ห้องส่วนตัว'
  }
  return locations[location as keyof typeof locations] || location
}

// Notification system
const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
  window.dispatchEvent(new CustomEvent('showNotification', {
    detail: { 
      title: type === 'success' ? 'สำเร็จ' : 
             type === 'error' ? 'เกิดข้อผิดพลาด' : 
             type === 'warning' ? 'คำเตือน' : 'แจ้งเตือน',
      message, 
      type, 
      duration: 5000 
    }
  }))
}

// Lifecycle
onMounted(() => {
  loadTables()
})
</script>

<style scoped>
/* Custom animations */
@keyframes gradient {
  0%, 100% {
    background-size: 400% 400%;
    background-position: 0% 50%;
  }
  50% {
    background-size: 400% 400%;
    background-position: 100% 50%;
  }
}

@keyframes tilt {
  0%, 50%, 100% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(1deg);
  }
  20% {
    transform: rotate(-1deg);
  }
  30% {
    transform: rotate(1.5deg);
  }
  40% {
    transform: rotate(-1.5deg);
  }
}

.animate-gradient {
  animation: gradient 15s ease infinite;
}

.animate-tilt {
  animation: tilt 10s infinite linear;
}

/* Glass morphism effects */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* QR Code container styling */
#qrcode {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
