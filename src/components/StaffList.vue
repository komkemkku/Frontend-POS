<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">รายการพนักงาน</h3>
          <p class="text-sm text-gray-500 mt-1">จัดการข้อมูลพนักงานในระบบ</p>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Search -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchTerm"
              @input="debouncedSearch"
              type="text"
              placeholder="ค้นหาพนักงาน..."
              class="block w-80 pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <!-- Add New Button -->
          <button
            @click="$emit('create')"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            เพิ่มพนักงาน
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-8">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">เกิดข้อผิดพลาด</h3>
            <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="staffList.length === 0" class="p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">ไม่พบข้อมูลพนักงาน</h3>
      <p class="mt-2 text-gray-500">เริ่มต้นด้วยการเพิ่มพนักงานคนแรกของคุณ</p>
      <button
        @click="$emit('create')"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        เพิ่มพนักงาน
      </button>
    </div>

    <!-- Staff List -->
    <div v-else class="overflow-hidden">
      <!-- Table Header -->
      <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div class="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div class="col-span-3">พนักงาน</div>
          <div class="col-span-2">ชื่อผู้ใช้</div>
          <div class="col-span-2">ตำแหน่ง</div>
          <div class="col-span-2">วันที่สร้าง</div>
          <div class="col-span-3 text-right">การดำเนินการ</div>
        </div>
      </div>

      <!-- Table Body -->
      <div class="divide-y divide-gray-200">
        <div
          v-for="staff in staffList"
          :key="staff.id"
          class="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
        >
          <div class="grid grid-cols-12 gap-4 items-center">
            <!-- Staff Info -->
            <div class="col-span-3">
              <div class="flex items-center">
                <div class="h-10 w-10 flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-blue-600">
                      {{ getInitials(staff.full_name || staff.name || staff.username) }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ staff.full_name || staff.name || 'ไม่ระบุชื่อ' }}
                  </div>
                  <div class="text-sm text-gray-500">ID: {{ staff.id }}</div>
                </div>
              </div>
            </div>

            <!-- Username -->
            <div class="col-span-2">
              <div class="text-sm text-gray-900">{{ staff.username }}</div>
            </div>

            <!-- Role -->
            <div class="col-span-2">
              <span 
                :class="getRoleColor(staff.role)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ getRoleLabel(staff.role) }}
              </span>
            </div>

            <!-- Created Date -->
            <div class="col-span-2">
              <div class="text-sm text-gray-900">
                {{ formatDate(staff.created_at) }}
              </div>
            </div>

            <!-- Actions -->
            <div class="col-span-3 text-right">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="$emit('view', staff)"
                  class="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  title="ดูรายละเอียด"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  @click="$emit('edit', staff)"
                  class="p-2 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                  title="แก้ไข"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="$emit('delete', staff)"
                  class="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  title="ลบ"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="staffList.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-sm text-gray-700">
          <span>
            แสดง {{ ((pagination.page - 1) * pagination.size) + 1 }} ถึง 
            {{ Math.min(pagination.page * pagination.size, pagination.total) }} 
            จาก {{ pagination.total }} รายการ
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('prevPage')"
            :disabled="!hasPrevPage"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              hasPrevPage 
                ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50' 
                : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
            ]"
          >
            ก่อนหน้า
          </button>
          <span class="px-3 py-2 text-sm text-gray-700">
            หน้า {{ pagination.page }} จาก {{ totalPages }}
          </span>
          <button
            @click="$emit('nextPage')"
            :disabled="!hasNextPage"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
              hasNextPage 
                ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50' 
                : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
            ]"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Staff } from '../types/auth'
import { STAFF_ROLES } from '../types/staff'
import { DateUtils } from '../utils/dateUtils'

// Props
interface Props {
  staffList: Staff[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    size: number
    total: number
  }
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const props = withDefaults(defineProps<Props>(), {
  staffList: () => [],
  loading: false,
  error: null,
  pagination: () => ({ page: 1, size: 10, total: 0 }),
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false
})

// Emits
const emit = defineEmits<{
  create: []
  view: [staff: Staff]
  edit: [staff: Staff]
  delete: [staff: Staff]
  search: [term: string]
  nextPage: []
  prevPage: []
}>()

// Search
const searchTerm = ref('')

// Simple debounce function
const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

const debouncedSearch = debounce(() => {
  emit('search', searchTerm.value)
}, 300)

// Helper functions
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRoleLabel = (role: string): string => {
  const roleData = STAFF_ROLES.find(r => r.value === role)
  return roleData?.label || role
}

const getRoleColor = (role: string): string => {
  const roleData = STAFF_ROLES.find(r => r.value === role)
  return roleData?.color || 'text-gray-600 bg-gray-50'
}

const formatDate = (timestamp?: number | string): string => {
  if (!timestamp) return 'ไม่ระบุ'
  
  try {
    // ถ้าเป็น string ให้แปลงเป็น number
    const numericTimestamp = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
    return DateUtils.formatThaiDate(numericTimestamp)
  } catch {
    return 'ไม่ระบุ'
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
