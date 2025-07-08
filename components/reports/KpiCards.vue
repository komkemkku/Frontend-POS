<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- ยอดขายรวม -->
    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
      <div class="flex items-center">
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">
            ยอดขายรวม
          </h3>
          <p class="text-2xl font-bold text-gray-900 mt-2">
            {{ formatCurrency(data.totalSales) }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <div class="bg-blue-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- จำนวนออเดอร์ -->
    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
      <div class="flex items-center">
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">
            จำนวนออเดอร์
          </h3>
          <p class="text-2xl font-bold text-gray-900 mt-2">
            {{ data.totalOrders.toLocaleString() }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <div class="bg-green-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- ลูกค้าใหม่ -->
    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
      <div class="flex items-center">
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">
            ลูกค้าใหม่
          </h3>
          <p class="text-2xl font-bold text-gray-900 mt-2">
            {{ data.newCustomers.toLocaleString() }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <div class="bg-purple-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- มูลค่าเฉลี่ยต่อออเดอร์ -->
    <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
      <div class="flex items-center">
        <div class="flex-1">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">
            มูลค่าเฉลี่ยต่อออเดอร์
          </h3>
          <p class="text-2xl font-bold text-gray-900 mt-2">
            {{ formatCurrency(data.averageOrderValue) }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <div class="bg-orange-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ฟังก์ชันสำหรับแปลงตัวเลขเป็นรูปแบบเงิน
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0)
}

export default {
  name: 'KpiCards',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      formatCurrency
    }
  }
}
</script>
