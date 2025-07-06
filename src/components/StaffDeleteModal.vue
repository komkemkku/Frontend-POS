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
          <!-- Warning Icon -->
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <!-- Modal Content -->
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              ยืนยันการลบพนักงาน
            </h3>
            <p class="text-sm text-gray-500 mb-6">
              คุณแน่ใจหรือไม่ที่ต้องการลบพนักงานคนนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>

            <!-- Staff Info Card -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <div class="flex items-center space-x-4">
                <div class="h-12 w-12 flex-shrink-0">
                  <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-red-600">
                      {{ getInitials(staff.full_name || staff.name || staff.username) }}
                    </span>
                  </div>
                </div>
                <div class="text-left">
                  <h4 class="text-sm font-semibold text-gray-900">
                    {{ staff.full_name || staff.name || 'ไม่ระบุชื่อ' }}
                  </h4>
                  <p class="text-xs text-gray-500">{{ staff.username }}</p>
                  <span 
                    :class="getRoleColor(staff.role)"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1"
                  >
                    {{ getRoleLabel(staff.role) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Warning Message -->
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3 text-left">
                  <h4 class="text-sm font-medium text-red-800">ข้อมูลที่จะถูกลบ:</h4>
                  <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                    <li>ข้อมูลส่วนตัวของพนักงาน</li>
                    <li>ประวัติการเข้าสู่ระบบ</li>
                    <li>สิทธิ์การเข้าถึงระบบ</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3 text-left">
                  <p class="text-sm text-red-800">{{ error }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="$emit('close')"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              @click="$emit('confirm', staff)"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <svg
                v-if="loading"
                class="animate-spin -ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {{ loading ? 'กำลังลบ...' : 'ลบพนักงาน' }}
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

// Props
interface Props {
  show: boolean
  staff: Staff | null
  loading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  staff: null,
  loading: false,
  error: null
})

// Emits
const emit = defineEmits<{
  close: []
  confirm: [staff: Staff]
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
</script>

<style scoped>
/* Custom styles if needed */
</style>
