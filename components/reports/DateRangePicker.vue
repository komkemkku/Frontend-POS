<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <div class="flex flex-wrap items-center gap-4">
      <h3 class="text-lg font-semibold text-gray-900">ตัวกรองข้อมูล</h3>
      
      <div class="flex items-center gap-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
            วันที่เริ่มต้น
          </label>
          <input
            id="startDate"
            v-model="localStartDate"
            type="date"
            class="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @change="updateDateRange"
          />
        </div>
        
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
            วันที่สิ้นสุด
          </label>
          <input
            id="endDate"
            v-model="localEndDate"
            type="date"
            class="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            @change="updateDateRange"
          />
        </div>
        
        <div class="flex gap-2 mt-6">
          <button
            @click="setQuickDate('today')"
            class="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            วันนี้
          </button>
          <button
            @click="setQuickDate('thisWeek')"
            class="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            สัปดาห์นี้
          </button>
          <button
            @click="setQuickDate('thisMonth')"
            class="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            เดือนนี้
          </button>
          <button
            @click="setQuickDate('lastMonth')"
            class="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            เดือนที่แล้ว
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'DateRangePicker',
  props: {
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    }
  },
  emits: ['update:startDate', 'update:endDate'],
  setup(props, { emit }) {
    const localStartDate = ref(props.startDate)
    const localEndDate = ref(props.endDate)

    const updateDateRange = () => {
      emit('update:startDate', localStartDate.value)
      emit('update:endDate', localEndDate.value)
    }

    const formatDateToInput = (date) => {
      return date.toISOString().split('T')[0]
    }

    const setQuickDate = (period) => {
      const today = new Date()
      let startDate
      let endDate = today

      switch (period) {
        case 'today':
          startDate = today
          break
        case 'thisWeek':
          startDate = new Date(today.setDate(today.getDate() - today.getDay()))
          endDate = new Date()
          break
        case 'thisMonth':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1)
          endDate = new Date()
          break
        case 'lastMonth':
          const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
          startDate = lastMonth
          endDate = new Date(today.getFullYear(), today.getMonth(), 0)
          break
        default:
          return
      }

      localStartDate.value = formatDateToInput(startDate)
      localEndDate.value = formatDateToInput(endDate)
      updateDateRange()
    }

    // Watch for prop changes
    watch(() => props.startDate, (newVal) => {
      localStartDate.value = newVal
    })

    watch(() => props.endDate, (newVal) => {
      localEndDate.value = newVal
    })

    return {
      localStartDate,
      localEndDate,
      updateDateRange,
      setQuickDate
    }
  }
}
</script>
