<template>
  <!-- Modal Overlay -->
  <Teleport to="body">
    <div
      v-if="show && staff"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Background backdrop -->
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="$emit('close')"
        ></div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              รายละเอียดพนักงาน
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Staff Information -->
          <div class="space-y-6">
            <!-- Avatar and Basic Info -->
            <div class="flex items-center space-x-4">
              <div class="h-16 w-16 flex-shrink-0">
                <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-xl font-medium text-blue-600">
                    {{ getInitials(staff.full_name || staff.name || staff.username) }}
                  </span>
                </div>
              </div>
              <div>
                <h4 class="text-xl font-semibold text-gray-900">
                  {{ staff.full_name || staff.name || 'ไม่ระบุชื่อ' }}
                </h4>
                <p class="text-sm text-gray-500">ID: {{ staff.id }}</p>
                <span 
                  :class="getRoleColor(staff.role)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2"
                >
                  {{ getRoleLabel(staff.role) }}
                </span>
              </div>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 gap-6">
              <!-- Username -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
                    <p class="mt-1 text-sm text-gray-900">{{ staff.username }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Full Name -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
                    <p class="mt-1 text-sm text-gray-900">{{ staff.full_name || staff.name || 'ไม่ระบุ' }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Role -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">ตำแหน่ง</label>
                    <p class="mt-1 text-sm text-gray-900">{{ getRoleLabel(staff.role) }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Email (if available) -->
              <div v-if="staff.email" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">อีเมล</label>
                    <p class="mt-1 text-sm text-gray-900">{{ staff.email }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Phone (if available) -->
              <div v-if="staff.phone" class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">เบอร์โทรศัพท์</label>
                    <p class="mt-1 text-sm text-gray-900">{{ staff.phone }}</p>
                  </div>
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Timestamps -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="text-center">
                    <label class="text-sm font-medium text-gray-700">วันที่สร้าง</label>
                    <p class="mt-1 text-sm text-gray-900">{{ formatDate(staff.created_at) }}</p>
                  </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <div class="text-center">
                    <label class="text-sm font-medium text-gray-700">แก้ไขล่าสุด</label>
                    <p class="mt-1 text-sm text-gray-900">{{ formatDate(staff.updated_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              ปิด
            </button>
            <button
              @click="$emit('edit', staff)"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              แก้ไข
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Staff } from '../types/auth'
import { STAFF_ROLES } from '../types/staff'
import { DateUtils } from '../utils/dateUtils'

// Props
interface Props {
  show: boolean
  staff: Staff | null
}

const props = withDefaults(defineProps<Props>(), {
  staff: null
})

// Emits
const emit = defineEmits<{
  close: []
  edit: [staff: Staff]
}>()

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
    return DateUtils.formatThaiDateTime(numericTimestamp)
  } catch {
    return 'ไม่ระบุ'
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
