<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">จัดการเมนู</h1>
        <p class="mt-1 text-sm text-gray-600">เพิ่ม แก้ไข และจัดการรายการอาหาร</p>
      </div>
      <router-link to="/menu/create" class="btn-primary">
        <PlusIcon class="h-5 w-5 mr-2" />
        เพิ่มเมนูใหม่
      </router-link>
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
                  <router-link
                    :to="`/menu/${item.id}/edit`"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    <PencilIcon class="h-4 w-4" />
                  </router-link>
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
          <router-link to="/menu/create" class="btn-primary">
            <PlusIcon class="h-5 w-5 mr-2" />
            เพิ่มเมนูใหม่
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'
import axios from '@/utils/axios'

const menuItems = ref([])
const categories = ref([])
const loading = ref(false)

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
    const response = await axios.get('/menu-items')
    if (response.data.status.code === 200) {
      menuItems.value = response.data.data
    }
  } catch (error) {
    console.error('Error loading menu items:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await axios.get('/categories')
    if (response.data.status.code === 200) {
      categories.value = response.data.data
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
    const response = await axios.patch(`/menu-items/${item.id}`, {
      is_available: !item.is_available
    })
    if (response.data.status.code === 200) {
      item.is_available = !item.is_available
    }
  } catch (error) {
    console.error('Error toggling availability:', error)
  }
}

const deleteMenuItem = async (item) => {
  if (!confirm(`คุณต้องการลบเมนู "${item.name}" หรือไม่?`)) {
    return
  }

  try {
    const response = await axios.delete(`/menu-items/${item.id}`)
    if (response.data.status.code === 200) {
      menuItems.value = menuItems.value.filter(i => i.id !== item.id)
    }
  } catch (error) {
    console.error('Error deleting menu item:', error)
  }
}

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    available: ''
  }
}

onMounted(() => {
  loadMenuItems()
  loadCategories()
})
</script>
