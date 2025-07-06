<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <!-- Header -->
              <div class="flex items-center justify-between mb-6">
                <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                  {{ menuItem.id ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่' }}
                </DialogTitle>
                <button @click="close" class="text-gray-400 hover:text-gray-600">
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <!-- Form -->
              <form @submit.prevent="saveMenuItem" class="space-y-4">
                <!-- Image Preview & Upload -->
                <div>
                  <label class="label">รูปภาพ</label>
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div class="space-y-2 text-center">
                      <!-- Image Preview -->
                      <div v-if="previewUrl" class="mb-4">
                        <img :src="previewUrl" alt="Preview" class="mx-auto h-32 w-32 object-cover rounded-lg" />
                      </div>
                      
                      <!-- Upload Area -->
                      <div v-else class="mb-4">
                        <PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />
                      </div>
                      
                      <div class="flex text-sm text-gray-600">
                        <label for="image-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                          <span>{{ previewUrl ? 'เปลี่ยนรูป' : 'อัปโหลดรูป' }}</span>
                          <input 
                            id="image-upload" 
                            type="file" 
                            class="sr-only" 
                            accept="image/*"
                            @change="handleImageUpload"
                          />
                        </label>
                        <p class="pl-1">หรือลากไฟล์มาวาง</p>
                      </div>
                      <p class="text-xs text-gray-500">PNG, JPG, GIF ขนาดไม่เกิน 10MB</p>
                    </div>
                  </div>
                  <!-- URL Input (Alternative) -->
                  <div class="mt-2">
                    <input
                      v-model="form.image_url"
                      type="url"
                      placeholder="หรือใส่ URL รูปภาพ"
                      class="input-field"
                      @input="handleUrlInput"
                    />
                  </div>
                </div>

                <!-- Menu Name -->
                <div>
                  <label class="label required">ชื่อเมนู</label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="ป้อนชื่อเมนู"
                    class="input-field"
                    required
                  />
                </div>

                <!-- Category -->
                <div>
                  <label class="label required">หมวดหมู่</label>
                  <select v-model="form.category_id" class="input-field" required @change="onCategoryChange">
                    <option value="">เลือกหมวดหมู่</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <!-- Drink Options (only show for beverage category) -->
                <div v-if="isDrinkCategory" class="space-y-3">
                  <label class="label">ตัวเลือกเครื่องดื่ม</label>
                  <div class="flex flex-wrap gap-3">
                    <label class="inline-flex items-center">
                      <input
                        v-model="form.options.cold"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span class="ml-2 text-sm text-gray-700">เย็น</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input
                        v-model="form.options.hot"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span class="ml-2 text-sm text-gray-700">ร้อน</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input
                        v-model="form.options.blended"
                        type="checkbox"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span class="ml-2 text-sm text-gray-700">ปั่น</span>
                    </label>
                  </div>
                  <p class="text-xs text-gray-500">เลือกตัวเลือกที่มีให้บริการ (สามารถเลือกหลายตัวเลือก)</p>
                </div>

                <!-- Description -->
                <div>
                  <label class="label">คำอธิบาย</label>
                  <textarea
                    v-model="form.description"
                    rows="3"
                    placeholder="รายละเอียดเมนู"
                    class="input-field"
                  ></textarea>
                </div>

                <!-- Price -->
                <div>
                  <label class="label required">ราคา</label>
                  <div class="relative">
                    <input
                      v-model.number="form.price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      class="input-field pl-8"
                      required
                    />
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">฿</span>
                    </div>
                  </div>
                </div>

                <!-- Availability -->
                <div class="flex items-center">
                  <input
                    v-model="form.is_available"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">
                    พร้อมจำหน่าย
                  </label>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex space-x-3">
                  <button
                    type="button"
                    @click="close"
                    class="btn-secondary flex-1"
                    :disabled="loading"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    class="btn-primary flex-1"
                    :disabled="loading || !isFormValid"
                  >
                    <span v-if="loading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      กำลังบันทึก...
                    </span>
                    <span v-else>
                      {{ menuItem.id ? 'บันทึก' : 'เพิ่มเมนู' }}
                    </span>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, watch, type Ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  XMarkIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'
import type { MenuItem, Category, MenuItemOptions } from '../types/menu'

interface MenuItemFormData {
  name: string
  category_id: string | number
  description: string
  price: number
  image_url: string
  is_available: boolean
  options: MenuItemOptions
}

interface Props {
  open: boolean
  menuItem: Partial<MenuItem>
  categories: Category[]
}

interface Emits {
  close: []
  save: [menuItem: MenuItemFormData & { id?: number }]
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  menuItem: () => ({}),
  categories: () => []
})

const emit = defineEmits<Emits>()

const loading = ref<boolean>(false)
const previewUrl = ref<string>('')
const isDrinkCategory = ref<boolean>(false)

const form: Ref<MenuItemFormData> = ref({
  name: '',
  category_id: '',
  description: '',
  price: 0,
  image_url: '',
  is_available: true,
  options: {
    cold: false,
    hot: false,
    blended: false
  }
})

const isFormValid = computed(() => {
  return form.value.name && form.value.category_id && form.value.price > 0
})

// Check if selected category is drink category
const onCategoryChange = (): void => {
  const selectedCategory = props.categories.find(cat => cat.id === parseInt(form.value.category_id.toString()))
  isDrinkCategory.value = selectedCategory ? selectedCategory.name.includes('เครื่องดื่ม') : false
  
  // Reset drink options when changing category
  if (!isDrinkCategory.value) {
    form.value.options = {
      cold: false,
      hot: false,
      blended: false
    }
  }
}

// Reset form when modal opens/closes
watch(() => props.open, (newVal: boolean) => {
  if (newVal) {
    resetForm()
  }
})

// Watch for menuItem changes (for edit mode)
watch(() => props.menuItem, (newVal: Partial<MenuItem>) => {
  if (newVal && newVal.id) {
    form.value = {
      name: newVal.name || '',
      category_id: newVal.category_id || '',
      description: newVal.description || '',
      price: newVal.price || 0,
      image_url: newVal.image_url || '',
      is_available: newVal.is_available ?? true,
      options: {
        cold: newVal.options?.cold ?? false,
        hot: newVal.options?.hot ?? false,
        blended: newVal.options?.blended ?? false
      }
    }
    previewUrl.value = newVal.image_url || ''
    onCategoryChange() // Check if it's a drink category
  }
}, { immediate: true })

const resetForm = (): void => {
  if (!props.menuItem.id) {
    form.value = {
      name: '',
      category_id: '',
      description: '',
      price: 0,
      image_url: '',
      is_available: true,
      options: {
        cold: false,
        hot: false,
        blended: false
      }
    }
    previewUrl.value = ''
    isDrinkCategory.value = false
  }
}

const handleImageUpload = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    
    // TODO: Upload to server and get URL
    // For now, we'll just use the preview URL
    form.value.image_url = previewUrl.value
  }
}

const handleUrlInput = (): void => {
  previewUrl.value = form.value.image_url
}

const saveMenuItem = async (): Promise<void> => {
  if (!isFormValid.value) return
  
  loading.value = true
  try {
    // Include drink options in description if it's a drink category
    let finalForm = { ...form.value, id: props.menuItem.id }
    
    if (isDrinkCategory.value) {
      const selectedOptions: string[] = []
      if (form.value.options.cold) selectedOptions.push('เย็น')
      if (form.value.options.hot) selectedOptions.push('ร้อน')
      if (form.value.options.blended) selectedOptions.push('ปั่น')
      
      if (selectedOptions.length > 0) {
        const optionsText = selectedOptions.join('/') + ' - '
        finalForm.description = optionsText + (form.value.description || '').replace(/^(เย็น|ร้อน|ปั่น).*? - /, '')
      }
    }
    
    await emit('save', finalForm)
  } catch (error) {
    console.error('Error saving menu item:', error)
  } finally {
    loading.value = false
  }
}

const close = (): void => {
  emit('close')
}
</script>

<style scoped>
.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.label.required::after {
  content: ' *';
  color: #ef4444;
}
</style>
