<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Top Products -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">สินค้าขายดี</h3>
        <div class="p-2 bg-green-100 rounded-lg">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
      <div class="space-y-3">
        <div
          v-for="(product, index) in topProducts"
          :key="product.id"
          class="flex items-center justify-between"
        >
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-600">{{ index + 1 }}</span>
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
              <p class="text-xs text-gray-500">{{ product.quantity }} รายการ</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">฿{{ product.totalSales.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Peak Hours -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">ช่วงเวลาคึกคัก</h3>
        <div class="p-2 bg-blue-100 rounded-lg">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div class="space-y-3">
        <div
          v-for="hour in peakHours"
          :key="hour.time"
          class="flex items-center justify-between"
        >
          <div>
            <p class="text-sm font-medium text-gray-900">{{ hour.time }}</p>
            <p class="text-xs text-gray-500">{{ hour.orders }} ออเดอร์</p>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-16 bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full"
                :style="{ width: `${hour.percentage}%` }"
              ></div>
            </div>
            <span class="text-xs text-gray-500">{{ hour.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Insights -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">ลูกค้า</h3>
        <div class="p-2 bg-purple-100 rounded-lg">
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
      <div class="space-y-4">
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">ลูกค้าใหม่</span>
            <span class="text-sm text-gray-500">{{ customerInsights.newCustomers }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-purple-600 h-2 rounded-full"
              :style="{ width: `${customerInsights.newCustomers}%` }"
            ></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">ลูกค้าประจำ</span>
            <span class="text-sm text-gray-500">{{ customerInsights.returningCustomers }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-green-600 h-2 rounded-full"
              :style="{ width: `${customerInsights.returningCustomers}%` }"
            ></div>
          </div>
        </div>
        <div class="pt-2 border-t">
          <p class="text-xs text-gray-500">ค่าเฉลี่ยต่อบิล</p>
          <p class="text-lg font-semibold text-gray-900">฿{{ customerInsights.averageOrderValue.toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <!-- Revenue Trends -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">แนวโน้มรายได้</h3>
        <div class="p-2 bg-orange-100 rounded-lg">
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
      <div class="space-y-4">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">เมื่อเทียบเดือนที่แล้ว</span>
            <div
              :class="[
                'flex items-center space-x-1 text-sm font-medium',
                revenueTrends.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              ]"
            >
              <svg
                :class="[
                  'w-4 h-4',
                  revenueTrends.monthlyGrowth >= 0 ? 'rotate-0' : 'rotate-180'
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{{ Math.abs(revenueTrends.monthlyGrowth) }}%</span>
            </div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">เมื่อเทียบสัปดาห์ที่แล้ว</span>
            <div
              :class="[
                'flex items-center space-x-1 text-sm font-medium',
                revenueTrends.weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              ]"
            >
              <svg
                :class="[
                  'w-4 h-4',
                  revenueTrends.weeklyGrowth >= 0 ? 'rotate-0' : 'rotate-180'
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{{ Math.abs(revenueTrends.weeklyGrowth) }}%</span>
            </div>
          </div>
        </div>
        <div class="pt-2 border-t">
          <p class="text-xs text-gray-500">เป้าหมายรายเดือน</p>
          <div class="flex items-center justify-between mt-1">
            <p class="text-sm font-semibold text-gray-900">฿{{ revenueTrends.monthlyTarget.toLocaleString() }}</p>
            <span class="text-xs text-gray-500">{{ revenueTrends.targetProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              class="bg-orange-600 h-2 rounded-full"
              :style="{ width: `${Math.min(revenueTrends.targetProgress, 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InsightCards',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    topProducts() {
      return this.data.topProducts || []
    },
    peakHours() {
      return this.data.peakHours || []
    },
    customerInsights() {
      return this.data.customerInsights || {
        newCustomers: 0,
        returningCustomers: 0,
        averageOrderValue: 0
      }
    },
    revenueTrends() {
      return this.data.revenueTrends || {
        monthlyGrowth: 0,
        weeklyGrowth: 0,
        monthlyTarget: 0,
        targetProgress: 0
      }
    }
  }
}
</script>
