<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-3xl font-bold text-center mb-8">ทดสอบหน้ารายงาน</h1>
    
    <!-- Test Mock Data -->
    <div class="max-w-4xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h2 class="text-xl font-semibold mb-4">ข้อมูลจำลอง</h2>
        <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ JSON.stringify(mockData, null, 2) }}</pre>
      </div>
      
      <!-- Test KPI Cards -->
      <div v-if="mockData" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
          <h3 class="text-sm text-gray-500 uppercase">ยอดขายรวม</h3>
          <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(mockData.totalSales) }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
          <h3 class="text-sm text-gray-500 uppercase">จำนวนออเดอร์</h3>
          <p class="text-2xl font-bold text-gray-900">{{ mockData.totalOrders.toLocaleString() }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-purple-600">
          <h3 class="text-sm text-gray-500 uppercase">ลูกค้าใหม่</h3>
          <p class="text-2xl font-bold text-gray-900">{{ mockData.newCustomers.toLocaleString() }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-orange-600">
          <h3 class="text-sm text-gray-500 uppercase">มูลค่าเฉลี่ย</h3>
          <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(mockData.averageOrderValue) }}</p>
        </div>
      </div>
      
      <!-- Test Button -->
      <div class="text-center">
        <button 
          @click="testAPI"
          class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          ทดสอบ API
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'TestReports',
  setup() {
    const mockData = ref(null)
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
      }).format(amount)
    }
    
    const testAPI = async () => {
      try {
        // ข้อมูลจำลองโดยตรง
        const testData = {
          totalSales: 1250000,
          totalOrders: 150,
          newCustomers: 25,
          averageOrderValue: 8333
        }
        mockData.value = testData
        console.log('Test data loaded:', testData)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    
    onMounted(() => {
      testAPI()
    })
    
    return {
      mockData,
      formatCurrency,
      testAPI
    }
  }
}
</script>
