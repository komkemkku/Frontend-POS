import { ref, reactive } from 'vue'

export interface ToastItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    handler: () => void
  }
}

export interface ToastOptions {
  title: string
  message?: string
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    handler: () => void
  }
}

const toasts = ref<ToastItem[]>([])

let toastIdCounter = 0

export function useToast() {
  const generateId = () => `toast-${++toastIdCounter}-${Date.now()}`

  const addToast = (type: ToastItem['type'], options: ToastOptions): string => {
    const id = generateId()
    const duration = options.persistent ? 0 : (options.duration || getDefaultDuration(type))
    
    const toast: ToastItem = {
      id,
      type,
      title: options.title,
      message: options.message,
      duration,
      persistent: options.persistent,
      action: options.action
    }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    toasts.value = []
  }

  const success = (options: ToastOptions | string) => {
    const opts = typeof options === 'string' ? { title: options } : options
    return addToast('success', opts)
  }

  const error = (options: ToastOptions | string) => {
    const opts = typeof options === 'string' ? { title: options } : options
    return addToast('error', { duration: 6000, ...opts })
  }

  const warning = (options: ToastOptions | string) => {
    const opts = typeof options === 'string' ? { title: options } : options
    return addToast('warning', { duration: 5000, ...opts })
  }

  const info = (options: ToastOptions | string) => {
    const opts = typeof options === 'string' ? { title: options } : options
    return addToast('info', opts)
  }

  const getDefaultDuration = (type: ToastItem['type']): number => {
    switch (type) {
      case 'success': return 4000
      case 'error': return 6000
      case 'warning': return 5000
      case 'info': return 4000
      default: return 4000
    }
  }

  return {
    toasts: toasts.value,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll
  }
}

// Global toast instance
export const toast = useToast()
