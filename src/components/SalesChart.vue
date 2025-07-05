<template>
  <div class="relative w-full h-full">
    <canvas ref="chartCanvas" class="w-full h-full"></canvas>
    <div v-if="!chartLoaded" class="absolute inset-0 flex items-center justify-center">
      <div class="text-gray-500 text-sm">กำลังโหลดกราฟ...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  period: {
    type: String,
    default: '7d'
  }
})

const chartCanvas = ref(null)
let chartInstance = null
const chartLoaded = ref(false)
let Chart = null

// Dynamic import Chart.js
const loadChart = async () => {
  try {
    const ChartJS = await import('chart.js/auto')
    Chart = ChartJS.default
    console.log('Chart.js loaded successfully')
    return true
  } catch (error) {
    console.error('Failed to load Chart.js:', error)
    return false
  }
}

// Mock data สำหรับ chart ตามช่วงเวลา
const getChartData = (period) => {
  const data = {
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
  return data[period] || data['7d']
}

const createChart = async () => {
  if (!chartCanvas.value) {
    console.log('Chart canvas not ready')
    return
  }

  if (!Chart) {
    console.log('Chart.js not loaded, loading now...')
    const loaded = await loadChart()
    if (!loaded) return
  }

  try {
    const ctx = chartCanvas.value.getContext('2d')
    const chartData = getChartData(props.period)
    
    console.log('Creating chart with data:', chartData)
    
    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy()
    }

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'ยอดขาย (บาท)',
          data: chartData.data,
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
      },
      options: {
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
      }
    })
    
    chartLoaded.value = true
    console.log('Chart created successfully')
  } catch (error) {
    console.error('Error creating chart:', error)
    chartLoaded.value = false
  }
}

onMounted(async () => {
  console.log('SalesChart mounted')
  await loadChart()
  nextTick(() => {
    setTimeout(() => {
      createChart()
    }, 100)
  })
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

watch(() => props.period, () => {
  console.log('Period changed to:', props.period)
  chartLoaded.value = false
  setTimeout(async () => {
    await createChart()
  }, 50)
})
</script>
