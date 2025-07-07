<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-2xl mx-auto px-4 py-6 sm:px-6">
        <div class="text-center">
          <div class="flex items-center justify-center space-x-3 mb-2">
            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">POS Restaurant</h1>
              <p class="text-sm text-gray-600">เมนูอาหารของเรา</p>
            </div>
          </div>
          
          <div v-if="tableInfo" class="bg-blue-50 rounded-lg p-4 mt-4">
            <div class="flex items-center justify-center space-x-2">
              <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-blue-800 font-medium">
                โต๊ะ {{ tableInfo.table_number }} ({{ tableInfo.capacity }} ที่นั่ง)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">กำลังโหลดเมนู...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-2xl mx-auto px-4 py-12 sm:px-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-lg font-medium text-red-800 mb-2">ไม่สามารถโหลดเมนูได้</h3>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <button
          @click="loadMenu"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          ลองใหม่
        </button>
      </div>
    </div>

    <!-- Menu Content -->
    <div v-else class="max-w-2xl mx-auto px-4 py-8 sm:px-6">
      <!-- Categories -->
      <div v-if="menuData.categories?.length" class="space-y-8">
        <div
          v-for="category in menuData.categories"
          :key="category.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <!-- Category Header -->
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ category.name }}
            </h2>
            <p v-if="category.description" class="text-sm text-gray-600 mt-1">
              {{ category.description }}
            </p>
          </div>

          <!-- Menu Items -->
          <div class="p-6">
            <div v-if="category.menu_items?.length" class="space-y-4">
              <div
                v-for="item in category.menu_items"
                :key="item.id"
                class="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <!-- Item Image -->
                <div class="flex-shrink-0">
                  <div class="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      v-if="item.image_url"
                      :src="item.image_url"
                      :alt="item.name"
                      class="h-full w-full object-cover"
                    />
                    <svg v-else class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                </div>

                <!-- Item Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ item.name }}
                      </h3>
                      <p v-if="item.description" class="text-sm text-gray-600 mt-1 line-clamp-2">
                        {{ item.description }}
                      </p>
                      
                      <!-- Item Status -->
                      <div class="flex items-center space-x-2 mt-2">
                        <span
                          v-if="item.is_available"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                          พร้อมเสิร์ฟ
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                          </svg>
                          หมด
                        </span>
                      </div>
                    </div>

                    <!-- Price -->
                    <div class="text-right">
                      <p class="text-lg font-bold text-blue-600">
                        ฿{{ item.price.toLocaleString() }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              ไม่มีเมนูในหมวดหมู่นี้
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่มีเมนู</h3>
        <p class="text-gray-500">ขณะนี้ยังไม่มีเมนูในระบบ</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-white border-t border-gray-200 mt-12">
      <div class="max-w-2xl mx-auto px-4 py-6 sm:px-6">
        <div class="text-center">
          <p class="text-sm text-gray-500">
            เรียกพนักงานได้ที่โต๊ะของท่าน หรือติดต่อที่เคาน์เตอร์
          </p>
          <div class="flex items-center justify-center space-x-4 mt-4">
            <button
              class="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              เรียกพนักงาน
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { TableService } from '../../services/table.service'

// Route
const route = useRoute()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const menuData = ref<any>({})
const tableInfo = ref<any>(null)

// Get QR code identifier from route
const qrCodeIdentifier = route.params.qrCodeIdentifier as string

// Load menu data
const loadMenu = async () => {
  try {
    loading.value = true
    error.value = null
    
    const data = await TableService.getMenuByQRCode(qrCodeIdentifier)
    menuData.value = data.menu || {}
    tableInfo.value = data.table || null
  } catch (err: any) {
    error.value = err.message || 'ไม่สามารถโหลดเมนูได้'
    console.error('Load menu error:', err)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (qrCodeIdentifier) {
    loadMenu()
  } else {
    error.value = 'ไม่พบรหัส QR Code'
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
