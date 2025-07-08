<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <div class="flex space-x-2">
        <button
          v-for="period in periods"
          :key="period.value"
          @click="selectedPeriod = period.value"
          :class="[
            'px-3 py-1 text-sm font-medium rounded-md transition-colors',
            selectedPeriod === period.value
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>
    
    <div class="h-80">
      <Line
        :data="chartData"
        :options="chartOptions"
        :key="selectedPeriod"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default {
  name: 'SalesChart',
  components: {
    Line
  },
  props: {
    title: {
      type: String,
      default: 'ยอดขายรายวัน'
    },
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'sales' // sales, orders, customers
    }
  },
  setup(props) {
    const selectedPeriod = ref('7d')
    
    const periods = [
      { value: '7d', label: '7 วัน' },
      { value: '30d', label: '30 วัน' },
      { value: '90d', label: '90 วัน' }
    ]

    const chartData = computed(() => {
      const filteredData = getFilteredData(props.data, selectedPeriod.value)
      
      return {
        labels: filteredData.map(item => item.date),
        datasets: [
          {
            label: getDatasetLabel(props.type),
            data: filteredData.map(item => item.value),
            borderColor: getChartColor(props.type),
            backgroundColor: getChartColor(props.type, 0.1),
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: getChartColor(props.type),
            pointBorderColor: '#fff',
            pointBorderWidth: 2
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
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 8,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || ''
              const value = formatValue(context.parsed.y, props.type)
              return `${label}: ${value}`
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            color: '#6B7280'
          }
        },
        y: {
          display: true,
          grid: {
            color: '#F3F4F6'
          },
          ticks: {
            color: '#6B7280',
            callback: (value) => formatValue(value, props.type)
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }))

    const getFilteredData = (data, period) => {
      if (!data || data.length === 0) return []
      
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      return data.slice(-days)
    }

    const getDatasetLabel = (type) => {
      switch (type) {
        case 'sales': return 'ยอดขาย (บาท)'
        case 'orders': return 'จำนวนออเดอร์'
        case 'customers': return 'ลูกค้า'
        default: return 'ข้อมูล'
      }
    }

    const getChartColor = (type, alpha = 1) => {
      const colors = {
        sales: alpha === 1 ? '#3B82F6' : `rgba(59, 130, 246, ${alpha})`,
        orders: alpha === 1 ? '#10B981' : `rgba(16, 185, 129, ${alpha})`,
        customers: alpha === 1 ? '#F59E0B' : `rgba(245, 158, 11, ${alpha})`
      }
      return colors[type] || colors.sales
    }

    const formatValue = (value, type) => {
      if (type === 'sales') {
        return `฿${value.toLocaleString()}`
      }
      return value.toLocaleString()
    }

    return {
      selectedPeriod,
      periods,
      chartData,
      chartOptions
    }
  }
}
</script>
