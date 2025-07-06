<template>
  <!-- Modal Overlay -->
  <Teleport to="body">
    <div
      v-if="show"
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
              {{ isEditing ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่' }}
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

          <!-- Form -->
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
                :class="{ 'border-red-300 focus:ring-red-500': errors.username }"
              />
              <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
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
                :class="{ 'border-red-300 focus:ring-red-500': errors.full_name }"
              />
              <p v-if="errors.full_name" class="mt-1 text-sm text-red-600">{{ errors.full_name }}</p>
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
                :class="{ 'border-red-300 focus:ring-red-500': errors.role }"
              >
                <option value="">เลือกตำแหน่ง</option>
                <option
                  v-for="role in STAFF_ROLES"
                  :key="role.value"
                  :value="role.value"
                >
                  {{ role.label }}
                </option>
              </select>
              <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
            </div>

            <!-- Password -->
            <div v-if="!isEditing || showPasswordField">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน 
                <span v-if="!isEditing" class="text-red-500">*</span>
                <span v-if="isEditing" class="text-gray-500 text-xs">(เว้นว่างหากไม่ต้องการเปลี่ยน)</span>
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="formData.password_hash"
                  :type="showPassword ? 'text' : 'password'"
                  :required="!isEditing"
                  class="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="กรอกรหัสผ่าน"
                  :class="{ 'border-red-300 focus:ring-red-500': errors.password_hash }"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                  <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password_hash" class="mt-1 text-sm text-red-600">{{ errors.password_hash }}</p>
            </div>

            <!-- Change Password Toggle (Edit Mode) -->
            <div v-if="isEditing && !showPasswordField" class="flex items-center">
              <button
                type="button"
                @click="showPasswordField = true"
                class="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                เปลี่ยนรหัสผ่าน
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800">{{ error }}</p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                {{ loading ? 'กำลังบันทึก...' : (isEditing ? 'บันทึกการแก้ไข' : 'สร้างพนักงาน') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Staff } from '../types/auth'
import type { StaffCreateRequest, StaffUpdateRequest } from '../types/staff'
import { STAFF_ROLES } from '../types/staff'

// Props
interface Props {
  show: boolean
  staff?: Staff | null
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
  submit: [data: StaffCreateRequest | StaffUpdateRequest]
}>()

// Form state
const formData = reactive({
  username: '',
  full_name: '',
  role: '',
  password_hash: ''
})

const errors = reactive({
  username: '',
  full_name: '',
  role: '',
  password_hash: ''
})

const showPassword = ref(false)
const showPasswordField = ref(false)

// Computed
const isEditing = computed(() => !!props.staff?.id)

// Validation
const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Username validation
  if (!formData.username.trim()) {
    errors.username = 'กรุณากรอกชื่อผู้ใช้'
    isValid = false
  } else if (formData.username.length < 3) {
    errors.username = 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร'
    isValid = false
  }

  // Full name validation
  if (!formData.full_name.trim()) {
    errors.full_name = 'กรุณากรอกชื่อ-นามสกุล'
    isValid = false
  }

  // Role validation
  if (!formData.role) {
    errors.role = 'กรุณาเลือกตำแหน่ง'
    isValid = false
  }

  // Password validation (required for new staff, optional for edit)
  if (!isEditing.value && !formData.password_hash.trim()) {
    errors.password_hash = 'กรุณากรอกรหัสผ่าน'
    isValid = false
  } else if (formData.password_hash && formData.password_hash.length < 6) {
    errors.password_hash = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    isValid = false
  }

  return isValid
}

// Form submission
const handleSubmit = () => {
  if (!validateForm()) return

  const submitData = isEditing.value
    ? {
        id: props.staff!.id,
        username: formData.username,
        full_name: formData.full_name,
        role: formData.role,
        ...(formData.password_hash && { password_hash: formData.password_hash })
      } as StaffUpdateRequest
    : {
        username: formData.username,
        full_name: formData.full_name,
        role: formData.role,
        password_hash: formData.password_hash
      } as StaffCreateRequest

  emit('submit', submitData)
}

// Reset form
const resetForm = () => {
  formData.username = ''
  formData.full_name = ''
  formData.role = ''
  formData.password_hash = ''
  showPasswordField.value = false
  showPassword.value = false
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

// Watch for staff changes (editing mode)
watch(() => props.staff, (newStaff) => {
  if (newStaff) {
    formData.username = newStaff.username || ''
    formData.full_name = newStaff.full_name || newStaff.name || ''
    formData.role = newStaff.role || ''
    formData.password_hash = ''
    showPasswordField.value = false
  }
}, { immediate: true })

// Watch for show changes (reset form when closed)
watch(() => props.show, (newShow) => {
  if (!newShow) {
    setTimeout(resetForm, 300) // Delay to allow modal transition
  }
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
