<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">จัดการเมนู</h1>
        <p class="mt-1 text-sm text-gray-600">เพิ่ม แก้ไข และจัดการรายการอาหาร</p>
      </div>
      <button @click="openCreateModal" class="btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        เพิ่มเมนูใหม่
      </button>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="label">ค้นหา</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="ชื่อเมนู..."
            class="input-field"
          />
        </div>
        <div>
          <label class="label">หมวดหมู่</label>
          <select v-model="filters.category" class="input-field">
            <option value="">ทั้งหมด</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="label">สถานะ</label>
          <select v-model="filters.available" class="input-field">
            <option value="">ทั้งหมด</option>
            <option value="true">พร้อมจำหน่าย</option>
            <option value="false">ไม่พร้อม</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="clearFilters" class="btn-secondary w-full">
            ล้างตัวกรอง
          </button>
        </div>
      </div>
    </div>

    <!-- Menu List -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                เมนู
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                หมวดหมู่
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ราคา
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                สถานะ
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                การดำเนินการ
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in filteredMenuItems" :key="item.id" class="table-row">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-12 w-12 bg-gray-200 rounded-lg mr-4 overflow-hidden">
                    <img
                      v-if="item.image_url"
                      :src="item.image_url"
                      :alt="item.name"
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full bg-gray-300 flex items-center justify-center">
                      <PhotoIcon class="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                    <div class="text-sm text-gray-500">{{ item.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                  {{ getCategoryName(item.category_id) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">฿{{ item.price.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.is_available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`"
                >
                  {{ item.is_available ? 'พร้อมจำหน่าย' : 'ไม่พร้อม' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex space-x-2">
                  <button
                    @click="openEditModal(item)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </button>
                  <button
                    @click="toggleAvailability(item)"
                    :class="`${
                      item.is_available
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900'
                    }`"
                  >
                    <component :is="item.is_available ? EyeSlashIcon : EyeIcon" class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteMenuItem(item)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMenuItems.length === 0" class="text-center py-12">
        <PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่มีเมนู</h3>
        <p class="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการเพิ่มเมนูใหม่</p>
        <div class="mt-6">
          <button @click="openCreateModal" class="btn-primary">
            <PlusIcon class="h-5 w-5 mr-2" />
            เพิ่มเมนูใหม่
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Container -->
    <div 
      class="fixed top-4 right-4 z-50 w-96 max-w-sm"
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

    <!-- Menu Item Modal -->
    <MenuItemModal
      :open="showModal"
      :menu-item="selectedMenuItem"
      :categories="categories"
      @close="closeModal"
      @save="saveMenuItem"
    />

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :open="showDeleteDialog"
      title="ลบเมนู"
      message="คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
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
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'
import { menuService } from '@/services/menuService'
import MenuItemModal from '@/components/MenuItemModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import Toast from '@/components/Toast.vue'

const menuItems = ref([])
const categories = ref([])
const loading = ref(false)
const showModal = ref(false)
const selectedMenuItem = ref({})
const showDeleteDialog = ref(false)
const itemToDelete = ref(null)

// Toast queue state
const toastQueue = ref([])
let toastIdCounter = 0

const filters = ref({
  search: '',
  category: '',
  available: ''
})

const filteredMenuItems = computed(() => {
  let items = menuItems.value

  if (filters.value.search) {
    items = items.filter(item =>
      item.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.category) {
    items = items.filter(item => item.category_id === parseInt(filters.value.category))
  }

  if (filters.value.available !== '') {
    items = items.filter(item => item.is_available === (filters.value.available === 'true'))
  }

  return items
})

const loadMenuItems = async () => {
  try {
    loading.value = true
    const response = await menuService.getMenuItems()
    if (response.status.code === 200) {
      menuItems.value = response.data
    }
  } catch (error) {
    console.error('Error loading menu items:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await menuService.getCategories()
    if (response.status.code === 200) {
      categories.value = response.data
    }
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || 'ไม่ระบุ'
}

const toggleAvailability = async (item) => {
  try {
    const newStatus = !item.is_available
    const response = await menuService.updateMenuItem(item.id, {
      category_id: item.category_id,
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      is_available: newStatus
    })
    if (response.status.code === 200) {
      item.is_available = newStatus
      
      if (newStatus) {
        showToast(
          'success', 
          '🟢 เปิดให้บริการแล้ว',
          `เมนู "${item.name}" พร้อมจำหน่าย ลูกค้าสามารถสั่งได้`
        )
      } else {
        showToast(
          'info', 
          '🔴 ปิดให้บริการแล้ว',
          `เมนู "${item.name}" หยุดจำหน่ายชั่วคราว`
        )
      }
    }
  } catch (error) {
    console.error('Error toggling availability:', error)
    showToast('error', '⚠️ เกิดข้อผิดพลาด', 'ไม่สามารถปรับปรุงสถานะเมนูได้ กรุณาลองใหม่อีกครั้ง')
  }
}

const deleteMenuItem = (item) => {
  itemToDelete.value = item
  showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
  showDeleteDialog.value = false
  itemToDelete.value = null
}

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    available: ''
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

const showToast = addToast // Alias for backward compatibility

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    const response = await menuService.deleteMenuItem(itemToDelete.value.id)
    if (response.status.code === 200) {
      menuItems.value = menuItems.value.filter(i => i.id !== itemToDelete.value.id)
      closeDeleteDialog()
      showToast(
        'success', 
        '🗑️ ลบเมนูสำเร็จ', 
        `ลบเมนู "${itemToDelete.value.name}" ออกจากระบบเรียบร้อยแล้ว`
      )
    }
  } catch (error) {
    console.error('Error deleting menu item:', error)
    showToast(
      'error', 
      '❌ ไม่สามารถลบเมนูได้', 
      'เกิดข้อผิดพลาดระหว่างการลบ กรุณาลองใหม่อีกครั้ง'
    )
  }
}

const openCreateModal = () => {
  selectedMenuItem.value = {}
  showModal.value = true
}

const openEditModal = (item) => {
  selectedMenuItem.value = { ...item }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedMenuItem.value = {}
}

const saveMenuItem = async (formData) => {
  try {
    let response
    
    if (formData.id) {
      // Update existing menu item
      response = await menuService.updateMenuItem(formData.id, {
        category_id: formData.category_id,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image_url: formData.image_url,
        is_available: formData.is_available
      })
      
      if (response.status.code === 200) {
        // Update in local array
        const index = menuItems.value.findIndex(item => item.id === formData.id)
        if (index !== -1) {
          menuItems.value[index] = { ...menuItems.value[index], ...formData }
        }
        showToast(
          'success', 
          '✏️ แก้ไขเมนูสำเร็จ', 
          `อัปเดตข้อมูลเมนู "${formData.name}" เรียบร้อยแล้ว`
        )
      }
    } else {
      // Create new menu item
      response = await menuService.createMenuItem({
        category_id: formData.category_id,
        name: formData.name,
        description: formData.description,
        price: formData.price,
        image_url: formData.image_url,
        is_available: formData.is_available
      })
      
      if (response.status.code === 200) {
        // Add to local array
        menuItems.value.unshift(response.data)
        showToast(
          'success', 
          '🍽️ เพิ่มเมนูใหม่สำเร็จ', 
          `เมนู "${formData.name}" พร้อมให้บริการแล้ว`
        )
      }
    }
    
    closeModal()
  } catch (error) {
    console.error('Error saving menu item:', error)
    showToast(
      'error', 
      '💾 ไม่สามารถบันทึกได้', 
      'เกิดข้อผิดพลาดระหว่างการบันทึกข้อมูลเมนู กรุณาตรวจสอบและลองใหม่อีกครั้ง'
    )
  }
}

onMounted(() => {
  loadMenuItems()
  loadCategories()
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
</style>
