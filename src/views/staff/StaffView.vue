<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">จัดการพนักงาน</h1>
          <p class="text-gray-600 mt-1">จัดการข้อมูลพนักงานในระบบ POS</p>
        </div>
        <div class="flex items-center space-x-3">
          <!-- Stats Cards -->
          <div class="hidden sm:flex items-center space-x-4">
            <div class="bg-blue-50 rounded-lg px-4 py-2">
              <div class="text-center">
                <div class="text-lg font-semibold text-blue-600">{{ pagination.total }}</div>
                <div class="text-xs text-blue-500">พนักงานทั้งหมด</div>
              </div>
            </div>
            <div class="bg-green-50 rounded-lg px-4 py-2">
              <div class="text-center">
                <div class="text-lg font-semibold text-green-600">{{ activeStaffCount }}</div>
                <div class="text-xs text-green-500">พนักงานที่ใช้งาน</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff Management Card -->
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
                @input="handleSearch"
                type="text"
                placeholder="ค้นหาพนักงาน..."
                class="block w-80 pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <!-- Add New Button -->
            <button
              @click="openCreateModal"
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
              <div class="mt-3">
                <button
                  @click="retryFetchStaff"
                  class="bg-red-100 px-3 py-1 rounded text-sm text-red-800 hover:bg-red-200 transition-colors duration-200"
                >
                  ลองใหม่
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && staffList.length === 0" class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">ไม่พบข้อมูลพนักงาน</h3>
        <p class="mt-2 text-gray-500">เริ่มต้นด้วยการเพิ่มพนักงานคนแรกของคุณ</p>
        <button
          @click="openCreateModal"
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
            v-for="staff in filteredStaffList"
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
                        {{ getInitials(staff.full_name || staff.username) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ staff.full_name || 'ไม่ระบุชื่อ' }}
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
                    @click="viewStaff(staff)"
                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title="ดูรายละเอียด"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="editStaff(staff)"
                    class="p-2 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                    title="แก้ไข"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="handleDeleteStaff(staff)"
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

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
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
                @click="handlePrevPage"
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
                @click="handleNextPage"
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
    </div>

    <!-- Form Modal -->
    <div
      v-if="showFormModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="closeFormModal"
        ></div>

        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ isEditing ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่' }}
            </h3>
            <button
              @click="closeFormModal"
              class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Username -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้ <span class="text-red-500">*</span>
              </label>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="กรอกชื่อผู้ใช้"
              />
            </div>

            <!-- Full Name -->
            <div>
              <label for="full_name" class="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ-นามสกุล <span class="text-red-500">*</span>
              </label>
              <input
                id="full_name"
                v-model="formData.full_name"
                type="text"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>

            <!-- Role -->
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
                ตำแหน่ง <span class="text-red-500">*</span>
              </label>
              <select
                id="role"
                v-model="formData.role"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">เลือกตำแหน่ง</option>
                <option value="admin">ผู้ดูแลระบบ</option>
                <option value="manager">ผู้จัดการ</option>
                <option value="cashier">แคชเชียร์</option>
                <option value="waiter">พนักงานเสิร์ฟ</option>
                <option value="kitchen">พนักงานครัว</option>
              </select>
            </div>

            <!-- Password -->
            <div v-if="!isEditing">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน <span class="text-red-500">*</span>
              </label>
              <input
                id="password"
                v-model="formData.password_hash"
                type="password"
                required
                class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="กรอกรหัสผ่าน"
              />
            </div>

            <!-- Error Message -->
            <div v-if="submitError" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ submitError }}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="closeFormModal"
                :disabled="submitting"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg
                  v-if="submitting"
                  class="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submitting ? 'กำลังบันทึก...' : (isEditing ? 'บันทึกการแก้ไข' : 'สร้างพนักงาน') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-0 right-0 mb-4 mr-4 max-w-sm z-50"
    >
      <div class="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
        <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span class="font-medium">{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useStaff } from '../../composables/useStaff'
import type { Staff, StaffCreateRequest, StaffUpdateRequest } from '../../types'
import { DateUtils } from '../../utils/dateUtils'

// Use the real API through composable
const {
  staffList,
  loading,
  error,
  pagination,
  totalPages,
  hasNextPage,
  hasPrevPage,
  fetchStaffList,
  createStaff,
  updateStaff,
  deleteStaff,
  searchStaff,
  nextPage,
  prevPage,
  clearError
} = useStaff()

// State
const searchTerm = ref('')
const showFormModal = ref(false)
const selectedStaff = ref<Staff | null>(null)
const showSuccessToast = ref(false)
const successMessage = ref('')
const submitting = ref(false)
const submitError = ref<string | null>(null)

const formData = reactive({
  username: '',
  full_name: '',
  role: '',
  password_hash: ''
})

// Computed
const activeStaffCount = computed(() => staffList.value.length)

const isEditing = computed(() => !!selectedStaff.value?.id)

const filteredStaffList = computed(() => {
  // When using real API, filtering is handled by the backend search
  return staffList.value
})

// Methods
const openCreateModal = () => {
  selectedStaff.value = null
  resetForm()
  clearError()
  submitError.value = null
  showFormModal.value = true
}

const editStaff = (staff: Staff) => {
  selectedStaff.value = staff
  formData.username = staff.username
  formData.full_name = staff.full_name || staff.name || ''
  formData.role = staff.role
  formData.password_hash = ''
  clearError()
  submitError.value = null
  showFormModal.value = true
}

const viewStaff = (staff: Staff) => {
  // For now, just edit the staff
  editStaff(staff)
}

const handleDeleteStaff = async (staff: Staff) => {
  try {
    // Pass staff name and role to useStaff for better confirmation modal
    const success = await deleteStaff(staff.id, staff.full_name || staff.name, staff.role)
    if (success) {
      showSuccess('ลบพนักงานสำเร็จ')
    }
  } catch (err) {
    console.error('Error deleting staff:', err)
  }
}

const handleSearch = async () => {
  try {
    await searchStaff(searchTerm.value)
  } catch (err) {
    console.error('Error searching staff:', err)
  }
}

const handleSubmit = async () => {
  try {
    submitting.value = true
    submitError.value = null

    let success = false
    let message = ''

    if (isEditing.value && selectedStaff.value) {
      // Update existing staff
      const updateData: StaffUpdateRequest = {
        id: selectedStaff.value.id,
        username: formData.username,
        full_name: formData.full_name,
        role: formData.role
      }
      
      // Only include password if provided
      if (formData.password_hash.trim()) {
        updateData.password_hash = formData.password_hash
      }

      success = await updateStaff(selectedStaff.value.id, updateData)
      message = 'แก้ไขข้อมูลพนักงานสำเร็จ'
    } else {
      // Create new staff
      if (!formData.password_hash.trim()) {
        submitError.value = 'กรุณากรอกรหัสผ่าน'
        return
      }

      const createData: StaffCreateRequest = {
        username: formData.username,
        full_name: formData.full_name,
        role: formData.role,
        password_hash: formData.password_hash
      }

      success = await createStaff(createData)
      message = 'เพิ่มพนักงานใหม่สำเร็จ'
    }

    if (success) {
      closeFormModal()
      showSuccess(message)
    }
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    submitting.value = false
  }
}

const closeFormModal = () => {
  showFormModal.value = false
  selectedStaff.value = null
  submitError.value = null
  resetForm()
}

const resetForm = () => {
  formData.username = ''
  formData.full_name = ''
  formData.role = ''
  formData.password_hash = ''
}

const showSuccess = (message: string) => {
  successMessage.value = message
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const retryFetchStaff = async () => {
  try {
    await fetchStaffList()
  } catch (err) {
    console.error('Error retrying to fetch staff:', err)
  }
}

const handleNextPage = async () => {
  try {
    await nextPage()
  } catch (err) {
    console.error('Error going to next page:', err)
  }
}

const handlePrevPage = async () => {
  try {
    await prevPage()
  } catch (err) {
    console.error('Error going to previous page:', err)
  }
}

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
  const roleMap: Record<string, string> = {
    admin: 'ผู้ดูแลระบบ',
    manager: 'ผู้จัดการ',
    cashier: 'แคชเชียร์',
    waiter: 'พนักงานเสิร์ฟ',
    kitchen: 'พนักงานครัว'
  }
  return roleMap[role] || role
}

const getRoleColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    admin: 'text-red-600 bg-red-50',
    manager: 'text-purple-600 bg-purple-50',
    cashier: 'text-blue-600 bg-blue-50',
    waiter: 'text-green-600 bg-green-50',
    kitchen: 'text-orange-600 bg-orange-50'
  }
  return colorMap[role] || 'text-gray-600 bg-gray-50'
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

// Lifecycle
onMounted(async () => {
  try {
    await fetchStaffList()
  } catch (err) {
    console.error('Error fetching staff list on mount:', err)
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
