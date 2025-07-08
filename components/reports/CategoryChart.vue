<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500">ระยะเวลา:</span>
        <select
          v-model="selectedMetric"
          class="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="sales">ยอดขาย</option>
          <option value="quantity">จำนวน</option>
        </select>
      </div>
    </div>
    
    <div class="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
      <!-- Chart -->
      <div class="h-64 w-64 mx-auto lg:mx-0">
        <Doughnut
          :data="chartData"
          :options="chartOptions"
          :key="selectedMetric"
        />
      </div>
      
      <!-- Legend -->
      <div class="mt-6 lg:mt-0 lg:flex-1">
        <div class="space-y-3">
          <div
            v-for="item in legendData"
            :key="item.name"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: item.color }"
              ></div>
              <span class="font-medium text-gray-900">{{ item.name }}</span>
            </div>
            <div class="text-right">
              <div class="font-semibold text-gray-900">{{ item.value }}</div>
              <div class="text-sm text-gray-500">{{ item.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'CategoryChart',
  components: {
    Doughnut
  },
  props: {
    title: {
      type: String,
      default: 'ยอดขายตามหมวดหมู่'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const selectedMetric = ref('sales')
    
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ]

    const chartData = computed(() => {
      const data = props.data || []
      const values = data.map(item => 
        selectedMetric.value === 'sales' ? item.totalSales : item.quantity
      )
      
      return {
        labels: data.map(item => item.name),
        datasets: [
          {
            data: values,
            backgroundColor: colors.slice(0, data.length),
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 4
          }
        ]
      }
    })

    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              const label = context.label || ''
              const value = selectedMetric.value === 'sales' 
                ? `฿${context.parsed.toLocaleString()}`
                : `${context.parsed.toLocaleString()} รายการ`
              return `${label}: ${value}`
            }
          }
        }
      },
      cutout: '60%'
    }))

    const legendData = computed(() => {
      const data = props.data || []
      const total = data.reduce((sum, item) => 
        sum + (selectedMetric.value === 'sales' ? item.totalSales : item.quantity), 0
      )
      
      return data.map((item, index) => {
        const value = selectedMetric.value === 'sales' ? item.totalSales : item.quantity
        const percentage = total > 0 ? Math.round((value / total) * 100) : 0
        
        return {
          name: item.name,
          value: selectedMetric.value === 'sales' 
            ? `฿${value.toLocaleString()}`
            : `${value.toLocaleString()} รายการ`,
          percentage,
          color: colors[index]
        }
      })
    })

    return {
      selectedMetric,
      chartData,
      chartOptions,
      legendData
    }
  }
}
</script>
