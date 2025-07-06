<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          จัดการหมวดหมู่
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          จัดการหมวดหมู่สินค้าและเมนูของร้าน
        </p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button @click="openCreateModal" class="btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          เพิ่มหมวดหมู่ใหม่
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white shadow rounded-lg">
      <div class="p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
              ค้นหาหมวดหมู่
            </label>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="ค้นหาชื่อหมวดหมู่..."
              class="input-field"
            />
          </div>

          <!-- Clear Filters -->
          <div class="lg:col-span-2 flex items-end">
            <button
              @click="clearFilters"
              class="btn-secondary w-full sm:w-auto"
            >
              ล้างการกรอง
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div v-if="loading" class="p-8">
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>

      <div v-else-if="filteredCategories.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="group relative bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-primary-300"
        >
          <!-- Category Info -->
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div class="min-w-0 flex-1">
                <h3 class="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  {{ category.name }}
                </h3>
                <p v-if="category.description" class="mt-1 text-sm text-gray-500 line-clamp-2">
                  {{ category.description }}
                </p>
                <div class="mt-3 flex items-center text-xs text-gray-400">
                  <HashtagIcon class="h-3 w-3 mr-1" />
                  ลำดับ: {{ category.display_order }}
                </div>
              </div>
              
              <!-- Actions -->
              <div class="ml-4 flex-shrink-0">
                <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="openEditModal(category)"
                    class="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                    title="แก้ไข"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteCategory(category)"
                    class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="ลบ"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Menu Items Count (if available) -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center text-xs text-gray-500">
              <ClipboardDocumentListIcon class="h-3 w-3 mr-1" />
              <span>{{ getMenuItemsCount(category.id) }} เมนู</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <TagIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มีหมวดหมู่</h3>
        <p class="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการเพิ่มหมวดหมู่ใหม่</p>
        <div class="mt-6">
          <button @click="openCreateModal" class="btn-primary">
            <PlusIcon class="h-5 w-5 mr-2" />
            เพิ่มหมวดหมู่ใหม่
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Container -->
    <div 
      class="fixed top-4 right-4 z-[100] w-96 max-w-sm"
      aria-live="assertive"
    >
      <TransitionGroup
        name="toast-list"
        tag="div"
        class="space-y-2"
      >
        <Toast
          v-for="(toastItem, index) in toastQueue"
          :key="toastItem.id"
          :show="true"
          :type="toastItem.type"
          :title="toastItem.title"
          :message="toastItem.message"
          @close="removeToast(toastItem.id)"
          class="toast-item"
        />
      </TransitionGroup>
    </div>

    <!-- Category Modal -->
    <CategoryModal
      :open="showModal"
      :category="selectedCategory"
      @close="closeModal"
      @save="saveCategory"
    />

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :open="showDeleteDialog"
      title="ลบหมวดหมู่"
      message="คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
      :item-name="itemToDelete?.name"
      :item-description="itemToDelete?.description"
      @close="closeDeleteDialog"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { TransitionGroup } from 'vue'
import {
  PlusIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  HashtagIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'
import { categoryService } from '@/services/categoryService'
import { menuService } from '@/services/menuService'
import CategoryModal from '@/components/CategoryModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import Toast from '@/components/Toast.vue'

const categories = ref([])
const menuItems = ref([])
const loading = ref(false)
const showModal = ref(false)
const selectedCategory = ref({})
const showDeleteDialog = ref(false)
const itemToDelete = ref(null)

// Toast queue state
const toastQueue = ref([])
let toastIdCounter = 0

const filters = ref({
  search: ''
})

const filteredCategories = computed(() => {
  let items = categories.value

  if (filters.value.search) {
    items = items.filter(item =>
      item.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(filters.value.search.toLowerCase()))
    )
  }

  // Sort by display_order, then by name
  return items.sort((a, b) => {
    const orderA = parseInt(a.display_order) || 999
    const orderB = parseInt(b.display_order) || 999
    
    if (orderA !== orderB) {
      return orderA - orderB
    }
    
    return a.name.localeCompare(b.name, 'th')
  })
})

const loadCategories = async () => {
  try {
    loading.value = true
    const response = await categoryService.getCategories()
    if (response.status.code === 200) {
      categories.value = response.data || []
    }
  } catch (error) {
    console.error('Error loading categories:', error)
    addToast('error', '⚠️ เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลหมวดหมู่ได้')
  } finally {
    loading.value = false
  }
}

const loadMenuItems = async () => {
  try {
    const response = await menuService.getMenuItems()
    if (response.status.code === 200) {
      menuItems.value = response.data || []
    }
  } catch (error) {
    console.error('Error loading menu items:', error)
  }
}

const getMenuItemsCount = (categoryId) => {
  return menuItems.value.filter(item => item.category_id === categoryId).length
}

const deleteCategory = (category) => {
  // Check if category has menu items
  const menuCount = getMenuItemsCount(category.id)
  if (menuCount > 0) {
    addToast(
      'warning',
      '⚠️ ไม่สามารถลบได้',
      `หมวดหมู่นี้มีเมนู ${menuCount} รายการ กรุณาลบเมนูออกก่อน`
    )
    return
  }
  
  itemToDelete.value = category
  showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
  showDeleteDialog.value = false
  itemToDelete.value = null
}

const clearFilters = () => {
  filters.value = {
    search: ''
  }
}

// Toast functions
const addToast = (type, title, message = '') => {
  const id = ++toastIdCounter
  const newToast = {
    id,
    type,
    title,
    message
  }
  
  toastQueue.value.push(newToast)
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    removeToast(id)
  }, 4000)
}

const removeToast = (id) => {
  const index = toastQueue.value.findIndex(t => t.id === id)
  if (index > -1) {
    toastQueue.value.splice(index, 1)
  }
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    const response = await categoryService.deleteCategory(itemToDelete.value.id)
    if (response.status.code === 200) {
      categories.value = categories.value.filter(c => c.id !== itemToDelete.value.id)
      closeDeleteDialog()
      addToast(
        'success', 
        '🗑️ ลบหมวดหมู่สำเร็จ', 
        `ลบหมวดหมู่ "${itemToDelete.value.name}" ออกจากระบบเรียบร้อยแล้ว`
      )
    }
  } catch (error) {
    console.error('Error deleting category:', error)
    addToast(
      'error', 
      '❌ ไม่สามารถลบหมวดหมู่ได้', 
      'เกิดข้อผิดพลาดระหว่างการลบ กรุณาลองใหม่อีกครั้ง'
    )
  }
}

const openCreateModal = () => {
  selectedCategory.value = {}
  showModal.value = true
}

const openEditModal = (category) => {
  selectedCategory.value = { ...category }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCategory.value = {}
}

const saveCategory = async (formData) => {
  try {
    console.log('Saving category with data:', formData)
    let response
    
    if (formData.id) {
      // Update existing category
      response = await categoryService.updateCategory(formData.id, {
        name: formData.name,
        description: formData.description,
        display_order: formData.display_order
      })
      
      if (response.status.code === 200) {
        // Update in local array
        const index = categories.value.findIndex(cat => cat.id === formData.id)
        if (index !== -1) {
          categories.value[index] = { ...categories.value[index], ...formData }
        }
        addToast(
          'success', 
          '✏️ แก้ไขหมวดหมู่สำเร็จ', 
          `อัปเดตข้อมูลหมวดหมู่ "${formData.name}" เรียบร้อยแล้ว`
        )
      }
    } else {
      // Create new category
      response = await categoryService.createCategory({
        name: formData.name,
        description: formData.description,
        display_order: formData.display_order
      })
      
      if (response.status.code === 200) {
        // Add to local array
        categories.value.unshift(response.data)
        addToast(
          'success', 
          '🏷️ เพิ่มหมวดหมู่ใหม่สำเร็จ', 
          `หมวดหมู่ "${formData.name}" พร้อมใช้งานแล้ว`
        )
      }
    }
    
    closeModal()
  } catch (error) {
    console.error('Error saving category:', error)
    console.error('Error response:', error.response?.data)
    addToast(
      'error', 
      '💾 ไม่สามารถบันทึกได้', 
      'เกิดข้อผิดพลาดระหว่างการบันทึกข้อมูลหมวดหมู่ กรุณาตรวจสอบและลองใหม่อีกครั้ง'
    )
  }
}

onMounted(() => {
  loadCategories()
  loadMenuItems()
})
</script>

<style scoped>
/* Toast queue animations */
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.4s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-list-move {
  transition: transform 0.3s ease;
}

.toast-item {
  transition: all 0.3s ease;
}

.toast-item:hover {
  transform: translateX(-4px);
}

/* Utility classes */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
