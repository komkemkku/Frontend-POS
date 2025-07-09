<template>
  <div class="space-y-6">
    <form @submit.prevent="handleSubmit">
      <!-- Order Basic Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">โต๊ะ</label>
          <select 
            v-model="formData.table_id" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">ไม่มีโต๊ะ (Take Away)</option>
            <option v-for="table in availableTables" :key="table.id" :value="table.id">
              โต๊ะ {{ table.table_number }} ({{ table.capacity }} ที่นั่ง)
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อลูกค้า</label>
          <input 
            type="text" 
            v-model="formData.customer_name"
            placeholder="ชื่อลูกค้า (ไม่บังคับ)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Menu Items Selection -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">เลือกรายการอาหาร</h4>
        
        <!-- Category Filter -->
        <div class="mb-4">
          <select 
            v-model="selectedCategory" 
            @change="filterMenuItems"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">ทุกหมวดหมู่</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <!-- Menu Items Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-60 overflow-y-auto">
          <div
            v-for="item in filteredMenuItems"
            :key="item.id"
            :class="[
              'p-4 border-2 rounded-lg cursor-pointer transition-all',
              item.is_available 
                ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50' 
                : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
            ]"
            @click="item.is_available && addMenuItem(item)"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-1">
                <h5 class="font-medium text-gray-900">{{ item.name }}</h5>
                <p class="text-sm text-gray-500">{{ item.description }}</p>
                <p class="text-lg font-bold text-blue-600">₿{{ formatCurrency(item.price) }}</p>
              </div>
              <button
                v-if="item.is_available"
                type="button"
                class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                @click.stop="addMenuItem(item)"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Items -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">รายการที่เลือก</h4>
        
        <div v-if="formData.items.length === 0" class="text-center py-8 text-gray-500">
          ยังไม่ได้เลือกรายการอาหาร
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="(item, index) in formData.items"
            :key="index"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex-1">
              <h5 class="font-medium text-gray-900">{{ getMenuItemName(item.menu_item_id) }}</h5>
              <p class="text-sm text-gray-500">₿{{ formatCurrency(getMenuItemPrice(item.menu_item_id)) }} × {{ item.quantity }}</p>
              <div v-if="item.notes" class="text-sm text-gray-600 mt-1">
                หมายเหตุ: {{ item.notes }}
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <button
                  type="button"
                  @click="updateQuantity(index, item.quantity - 1)"
                  class="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  :disabled="item.quantity <= 1"
                >
                  <MinusIcon class="w-4 h-4" />
                </button>
                
                <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                
                <button
                  type="button"
                  @click="updateQuantity(index, item.quantity + 1)"
                  class="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <PlusIcon class="w-4 h-4" />
                </button>
              </div>
              
              <div class="text-lg font-bold text-gray-900">
                ₿{{ formatCurrency(getMenuItemPrice(item.menu_item_id) * item.quantity) }}
              </div>
              
              <button
                type="button"
                @click="removeMenuItem(index)"
                class="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Notes -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">หมายเหตุ</label>
        <textarea 
          v-model="formData.notes"
          rows="3"
          placeholder="หมายเหตุสำหรับออเดอร์นี้..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
      </div>

      <!-- Order Summary -->
      <div class="bg-blue-50 rounded-lg p-6 mb-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">สรุปออเดอร์</h4>
        <div class="space-y-2">
          <div class="flex justify-between text-gray-600">
            <span>ยอดรวม ({{ formData.items.length }} รายการ)</span>
            <span>₿{{ formatCurrency(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>ภาษี (7%)</span>
            <span>₿{{ formatCurrency(tax) }}</span>
          </div>
          <div class="border-t border-blue-200 pt-2">
            <div class="flex justify-between text-xl font-bold text-gray-900">
              <span>ยอดสุทธิ</span>
              <span>₿{{ formatCurrency(total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          :disabled="formData.items.length === 0 || submitting"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ submitting ? 'กำลังบันทึก...' : (isEdit ? 'อัปเดตออเดอร์' : 'สร้างออเดอร์') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { Order, OrderCreateRequest, OrderUpdateRequest, OrderItemRequest, MenuItem, Category, Table } from '../../types'
import { menuService, categoryService } from '../../services'

interface Props {
  order?: Order | null
  isEdit?: boolean
}

interface Emits {
  (e: 'save', orderData: OrderCreateRequest | OrderUpdateRequest): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  order: null,
  isEdit: false
})

const emit = defineEmits<Emits>()

// State
const submitting = ref(false)
const selectedCategory = ref('')
const menuItems = ref<MenuItem[]>([])
const categories = ref<Category[]>([])
const availableTables = ref<Table[]>([])

// Form data
const formData = ref<{
  table_id?: number
  customer_name?: string
  items: OrderItemRequest[]
  notes?: string
}>({
  table_id: undefined,
  customer_name: '',
  items: [],
  notes: ''
})

// Computed
const filteredMenuItems = computed(() => {
  if (!selectedCategory.value) return menuItems.value
  return menuItems.value.filter(item => item.category_id === parseInt(selectedCategory.value))
})

const subtotal = computed(() => {
  return formData.value.items.reduce((sum, item) => {
    const menuItem = menuItems.value.find(m => m.id === item.menu_item_id)
    return sum + (menuItem?.price || 0) * item.quantity
  }, 0)
})

const tax = computed(() => subtotal.value * 0.07)
const total = computed(() => subtotal.value + tax.value)

// Methods
const loadData = async () => {
  try {
    const [menuResponse, categoryResponse] = await Promise.all([
      menuService.getMenuItems(),
      categoryService.getCategories()
    ])
    
    menuItems.value = menuResponse || []
    // Handle PaginatedResponse structure
    categories.value = categoryResponse.items || []
    
    // Mock available tables
    availableTables.value = [
      { id: 1, table_number: '1', capacity: 4, status: 'available' },
      { id: 2, table_number: '2', capacity: 6, status: 'available' },
      { id: 3, table_number: '3', capacity: 2, status: 'available' }
    ] as Table[]
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

const addMenuItem = (menuItem: MenuItem) => {
  const existingIndex = formData.value.items.findIndex(item => item.menu_item_id === menuItem.id)
  
  if (existingIndex >= 0) {
    formData.value.items[existingIndex].quantity += 1
  } else {
    formData.value.items.push({
      menu_item_id: menuItem.id,
      quantity: 1,
      notes: ''
    })
  }
}

const removeMenuItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

const updateQuantity = (index: number, newQuantity: number) => {
  if (newQuantity <= 0) {
    removeMenuItem(index)
  } else {
    formData.value.items[index].quantity = newQuantity
  }
}

const getMenuItemName = (menuItemId: number) => {
  const menuItem = menuItems.value.find(m => m.id === menuItemId)
  return menuItem?.name || 'Unknown Item'
}

const getMenuItemPrice = (menuItemId: number) => {
  const menuItem = menuItems.value.find(m => m.id === menuItemId)
  return menuItem?.price || 0
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

const handleSubmit = async () => {
  if (formData.value.items.length === 0) return
  
  submitting.value = true
  try {
    const orderData = {
      table_id: formData.value.table_id || undefined,
      customer_name: formData.value.customer_name || undefined,
      items: formData.value.items,
      notes: formData.value.notes || undefined
    }
    
    emit('save', orderData)
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    submitting.value = false
  }
}

const filterMenuItems = () => {
  // Filter is handled by computed property
}

// Watchers
watch(() => props.order, (newOrder) => {
  if (newOrder && props.isEdit) {
    formData.value = {
      table_id: newOrder.table_id,
      customer_name: newOrder.customer_name || '',
      items: newOrder.items.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        notes: item.notes || ''
      })),
      notes: newOrder.notes || ''
    }
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  loadData()
})
</script>
