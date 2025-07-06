<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-40" @close="$emit('close')">
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
              <form @submit.prevent="handleSubmit">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <TagIcon class="h-6 w-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      {{ isEditing ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่' }}
                    </DialogTitle>
                  </div>
                </div>

                <div class="mt-6 space-y-6">
                  <!-- Category Name -->
                  <div>
                    <label for="name" class="block text-sm font-medium leading-6 text-gray-900">
                      ชื่อหมวดหมู่ <span class="text-red-500">*</span>
                    </label>
                    <div class="mt-2">
                      <input
                        id="name"
                        v-model="formData.name"
                        type="text"
                        required
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        placeholder="เช่น เครื่องดื่ม, อาหารหลัก"
                        :class="{ 'ring-red-500': errors.name }"
                      />
                      <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                    </div>
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="description" class="block text-sm font-medium leading-6 text-gray-900">
                      คำอธิบาย
                    </label>
                    <div class="mt-2">
                      <textarea
                        id="description"
                        v-model="formData.description"
                        rows="3"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 resize-none"
                        placeholder="อธิบายหมวดหมู่นี้..."
                        :class="{ 'ring-red-500': errors.description }"
                      />
                      <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
                    </div>
                  </div>

                  <!-- Display Order -->
                  <div>
                    <label for="display_order" class="block text-sm font-medium leading-6 text-gray-900">
                      ลำดับการแสดง
                    </label>
                    <div class="mt-2">
                      <input
                        id="display_order"
                        v-model="formData.display_order"
                        type="number"
                        min="1"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                        placeholder="1"
                        :class="{ 'ring-red-500': errors.display_order }"
                      />
                      <p v-if="errors.display_order" class="mt-1 text-sm text-red-600">{{ errors.display_order }}</p>
                      <p class="mt-1 text-sm text-gray-500">หมวดหมู่จะแสดงเรียงตามลำดับนี้</p>
                    </div>
                  </div>
                </div>

                <div class="mt-8 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSubmitting ? 'กำลังบันทึก...' : (isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่') }}
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="$emit('close')"
                    :disabled="isSubmitting"
                  >
                    ยกเลิก
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
import { ref, watch, computed, type Ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { TagIcon } from '@heroicons/vue/24/outline'
import type { Category } from '../types/menu'

interface CategoryFormData {
  id?: number
  name: string
  description: string
  display_order: string
  is_active: boolean
}

interface FormErrors {
  name?: string
  description?: string
  display_order?: string
}

interface Props {
  open: boolean
  category?: Partial<Category>
}

interface Emits {
  close: []
  save: [formData: CategoryFormData]
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  category: () => ({})
})

const emit = defineEmits<Emits>()

const formData: Ref<CategoryFormData> = ref({
  name: '',
  description: '',
  display_order: '',
  is_active: true
})

const errors: Ref<FormErrors> = ref({})
const isSubmitting = ref<boolean>(false)

const isEditing = computed(() => !!props.category?.id)

// Watch for changes in category prop to populate form
watch(() => props.category, (newCategory) => {
  if (newCategory && Object.keys(newCategory).length > 0) {
    formData.value = {
      id: newCategory.id,
      name: newCategory.name || '',
      description: newCategory.description || '',
      display_order: newCategory.display_order?.toString() || '',
      is_active: newCategory.is_active ?? true
    }
  } else {
    // Reset form for new category
    formData.value = {
      name: '',
      description: '',
      display_order: '',
      is_active: true
    }
  }
  errors.value = {}
}, { immediate: true })

// Watch for open prop to reset form
watch(() => props.open, (isOpen: boolean) => {
  if (!isOpen) {
    errors.value = {}
  }
})

const validateForm = (): boolean => {
  errors.value = {}
  
  if (!formData.value.name?.trim()) {
    errors.value.name = 'กรุณากรอกชื่อหมวดหมู่'
  }
  
  if (formData.value.display_order && isNaN(Number(formData.value.display_order))) {
    errors.value.display_order = 'ลำดับการแสดงต้องเป็นตัวเลข'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    console.log('Validation failed:', errors.value)
    return
  }
  
  isSubmitting.value = true
  
  try {
    const submitData: CategoryFormData = {
      name: formData.value.name.trim(),
      description: formData.value.description?.trim() || '',
      display_order: formData.value.display_order ? formData.value.display_order.toString() : '1',
      is_active: formData.value.is_active
    }
    
    if (isEditing.value && formData.value.id) {
      submitData.id = formData.value.id
    }
    
    console.log('CategoryModal: About to submit data:', submitData)
    console.log('CategoryModal: Is editing?', isEditing.value)
    
    console.log('CategoryModal: Submitting data:', submitData)
    
    // Emit to parent - this now works as the parent handles the promise properly
    emit('save', submitData)
    
    console.log('CategoryModal: Save event emitted')
  } catch (error) {
    console.error('CategoryModal: Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
