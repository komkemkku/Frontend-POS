<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Transition
        v-for="notification in notifications"
        :key="notification.id"
        name="notification"
        appear
      >
        <div
          :class="[
            'max-w-sm w-full bg-white shadow-md rounded-lg pointer-events-auto ring-1 overflow-hidden',
            getNotificationClass(notification.type)
          ]"
        >
          <div class="p-3">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component 
                  :is="getNotificationIcon(notification.type)" 
                  :class="[
                    'h-5 w-5',
                    getIconClass(notification.type)
                  ]"
                />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-800">
                  {{ notification.title }}
                </p>
                <p class="mt-0.5 text-sm text-gray-600">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeNotification(notification.id)"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Progress bar -->
          <div class="h-0.5 bg-gray-100">
            <div
              :class="[
                'h-full transition-all ease-linear',
                getProgressClass(notification.type)
              ]"
              :style="{ width: `${notification.progress}%` }"
            ></div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  duration: number
  progress: number
}

const notifications = ref<Notification[]>([])
let notificationId = 0

const addNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', duration: number = 5000) => {
  const id = `notification-${++notificationId}`
  const notification: Notification = {
    id,
    title,
    message,
    type,
    duration,
    progress: 100
  }
  
  notifications.value.push(notification)
  
  // Auto remove after duration
  const interval = setInterval(() => {
    notification.progress -= (100 / duration) * 100
    if (notification.progress <= 0) {
      removeNotification(id)
      clearInterval(interval)
    }
  }, 100)
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const getNotificationClass = (type: string) => {
  const classes = {
    'success': 'border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white',
    'info': 'border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white',
    'warning': 'border-l-4 border-yellow-500 bg-gradient-to-r from-yellow-50 to-white',
    'error': 'border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-white'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getNotificationIcon = (type: string) => {
  const icons = {
    'success': CheckCircleIcon,
    'info': InformationCircleIcon,
    'warning': ExclamationTriangleIcon,
    'error': XCircleIcon
  }
  return icons[type as keyof typeof icons] || icons.info
}

const getIconClass = (type: string) => {
  const classes = {
    'success': 'text-green-500',
    'info': 'text-blue-500',
    'warning': 'text-yellow-500',
    'error': 'text-red-500'
  }
  return classes[type as keyof typeof classes] || classes.info
}

const getProgressClass = (type: string) => {
  const classes = {
    'success': 'bg-green-500',
    'info': 'bg-blue-500',
    'warning': 'bg-yellow-500',
    'error': 'bg-red-500'
  }
  return classes[type as keyof typeof classes] || classes.info
}

// Listen for notification events
const handleNotification = (event: any) => {
  const { title, message, type, duration } = event.detail
  addNotification(title, message, type, duration)
}

onMounted(() => {
  window.addEventListener('showNotification', handleNotification)
})

onUnmounted(() => {
  window.removeEventListener('showNotification', handleNotification)
})

// Expose addNotification for programmatic use
defineExpose({
  addNotification,
  removeNotification
})
</script>

<script lang="ts">
export default {
  name: 'NotificationToast'
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
