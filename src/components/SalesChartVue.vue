<template>
  <div class="relative w-full h-full">
    <Line
      v-if="chartLoaded"
      :data="chartData"
      :options="chartOptions"
      :key="chartKey"
    />
    <div v-else class="absolute inset-0 flex items-center justify-center">
      <div class="text-gray-500 text-sm">กำลังโหลดกราฟ...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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

// Register Chart.js components
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

const props = defineProps({
  period: {
    type: String,
    default: '7d'
  },
  chartData: {
    type: Object,
    default: () => ({})
  }
})

const chartLoaded = ref(false)
const chartKey = ref(0)

// Chart data สำหรับ chart ตามข้อมูลจาก props หรือ mock data
const getChartData = (period) => {
  // ใช้ข้อมูลจาก props ก่อน แล้วค่อย fallback ไป mock data
  if (props.chartData && props.chartData[period]) {
    return props.chartData[period]
  }
  
  // Fallback mock data
  const mockData = {
    '7d': {
      labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
      data: [12000, 15000, 18000, 22000, 25000, 28000, 20000]
    },
    '30d': {
      labels: ['สัปดาห์ 1', 'สัปดาห์ 2', 'สัปดาห์ 3', 'สัปดาห์ 4'],
      data: [85000, 92000, 105000, 98000]
    },
    '90d': {
      labels: ['เดือน 1', 'เดือน 2', 'เดือน 3'],
      data: [350000, 380000, 420000]
    }
  }
  return mockData[period] || mockData['7d']
}

const chartData = computed(() => {
  const data = getChartData(props.period)
  console.log('Chart data computed:', data)
  
  return {
    labels: data.labels,
    datasets: [{
      label: 'ยอดขาย (บาท)',
      data: data.data,
      borderColor: 'rgb(37, 99, 235)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(37, 99, 235)',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgb(37, 99, 235)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context) {
          return `ยอดขาย: ฿${context.parsed.y.toLocaleString()}`
        }
      }
    },
    legend: {
      display: false
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 12
        }
      }
    },
    y: {
      display: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        borderDash: [5, 5]
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 12
        },
        callback: function(value) {
          return '฿' + value.toLocaleString()
        }
      }
    }
  },
  elements: {
    point: {
      hoverBackgroundColor: 'rgb(37, 99, 235)'
    }
  }
}))

onMounted(() => {
  console.log('SalesChart (vue-chartjs) mounted')
  setTimeout(() => {
    chartLoaded.value = true
    console.log('Chart loaded')
  }, 100)
})

watch(() => props.period, () => {
  console.log('Period changed to:', props.period)
  chartKey.value++ // Force re-render
})
</script>
