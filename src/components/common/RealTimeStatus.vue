<template>
  <div class="flex items-center space-x-4 text-sm">
    <!-- Connection Status -->
    <div class="flex items-center space-x-2">
      <div class="flex items-center space-x-1">
        <div 
          :class="[
            'w-3 h-3 rounded-full transition-colors',
            getConnectionStatusClass()
          ]"
        ></div>
        <span class="text-gray-600">
          {{ getConnectionStatusText() }}
        </span>
      </div>
      
      <button
        v-if="!isConnected"
        @click="handleReconnect"
        class="text-blue-600 hover:text-blue-800 font-medium"
        :disabled="isReconnecting"
      >
        {{ isReconnecting ? 'กำลังเชื่อมต่อ...' : 'เชื่อมต่อใหม่' }}
      </button>
    </div>
    
    <!-- Update Info -->
    <div v-if="lastUpdate" class="flex items-center space-x-2 text-gray-500">
      <ClockIcon class="w-4 h-4" />
      <span>
        อัปเดตล่าสุด: {{ formatDateTime(lastUpdate.toISOString()) }}
      </span>
    </div>
    
    <!-- Update Counter -->
    <div v-if="updateCount > 0" class="flex items-center space-x-1 text-gray-500">
      <ArrowPathIcon class="w-4 h-4" />
      <span>{{ updateCount }} การอัปเดต</span>
    </div>
    
    <!-- Auto-refresh indicator -->
    <div v-if="isPolling" class="flex items-center space-x-1 text-blue-600">
      <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
      <span>Auto-refresh</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { ClockIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

interface Props {
  isConnected: boolean
  connectionStatus: string
  lastUpdate: Date | null
  updateCount: number
  isPolling: boolean
  onReconnect: () => Promise<void>
}

interface Emits {
  (e: 'reconnect'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isReconnecting = ref(false)

const getConnectionStatusClass = () => {
  switch (props.connectionStatus) {
    case 'connected':
      return 'bg-green-500 animate-pulse'
    case 'connecting':
      return 'bg-yellow-500 animate-pulse'
    case 'disconnected':
      return 'bg-red-500'
    case 'closing':
      return 'bg-orange-500'
    default:
      return 'bg-gray-500'
  }
}

const getConnectionStatusText = () => {
  switch (props.connectionStatus) {
    case 'connected':
      return 'เชื่อมต่อแล้ว'
    case 'connecting':
      return 'กำลังเชื่อมต่อ'
    case 'disconnected':
      return 'ไม่ได้เชื่อมต่อ'
    case 'closing':
      return 'กำลังปิดการเชื่อมต่อ'
    default:
      return 'ไม่ทราบสถานะ'
  }
}

const handleReconnect = async () => {
  isReconnecting.value = true
  try {
    await props.onReconnect()
  } catch (error) {
    console.error('Reconnection failed:', error)
  } finally {
    isReconnecting.value = false
  }
}

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'HH:mm:ss', { locale: th })
}
</script>

<script lang="ts">
export default {
  name: 'RealTimeStatus'
}
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
