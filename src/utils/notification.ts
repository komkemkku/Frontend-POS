// Simple notification system without external dependencies
import { ref, reactive } from 'vue'

export interface NotificationItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

export interface NotificationOptions {
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

// Global state
const notifications = ref<NotificationItem[]>([])
let notificationIdCounter = 0

// Create notification system
export function useNotification() {
  const generateId = () => `notification-${++notificationIdCounter}-${Date.now()}`

  const addNotification = (type: NotificationItem['type'], options: NotificationOptions): string => {
    const id = generateId()
    const duration = options.persistent ? 0 : (options.duration || getDefaultDuration(type))
    
    const notification: NotificationItem = {
      id,
      type,
      title: options.title,
      message: options.message,
      duration,
      persistent: options.persistent
    }

    notifications.value.push(notification)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(notification => notification.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  const success = (options: NotificationOptions | string) => {
    const opts = typeof options === 'string' ? { title: options } : options
    return addNotification('success', opts)
  }

  const error = (options: NotificationOptions | string) => {
    const opts = typeof options === 'string' ? { title: options } : options
    return addNotification('error', { duration: 6000, ...opts })
  }

  const warning = (options: NotificationOptions | string) => {
    const opts = typeof options === 'string' ? { title: options } : options
    return addNotification('warning', { duration: 5000, ...opts })
  }

  const info = (options: NotificationOptions | string) => {
    const opts = typeof options === 'string' ? { title: options } : options
    return addNotification('info', opts)
  }

  const getDefaultDuration = (type: NotificationItem['type']): number => {
    switch (type) {
      case 'success': return 4000
      case 'error': return 6000
      case 'warning': return 5000
      case 'info': return 4000
      default: return 4000
    }
  }

  return {
    notifications: notifications.value,
    success,
    error,
    warning,
    info,
    removeNotification,
    clearAll
  }
}

// Global instance
export const notification = useNotification()
