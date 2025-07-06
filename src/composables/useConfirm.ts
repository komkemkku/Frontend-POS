import { ref, reactive } from 'vue'
import { notification } from '@/utils/notification'

interface ConfirmOptions {
  title?: string
  message?: string
  staffInfo?: {
    name: string
    role: string
  }
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

interface ConfirmState {
  isVisible: boolean
  loading: boolean
  options: ConfirmOptions
  resolve?: (value: boolean) => void
}

const confirmState = reactive<ConfirmState>({
  isVisible: false,
  loading: false,
  options: {},
  resolve: undefined
})

export function useConfirm() {
  
  const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmState.isVisible = true
      confirmState.loading = false
      confirmState.options = options
      confirmState.resolve = resolve
    })
  }

  const handleConfirm = async () => {
    if (confirmState.resolve) {
      confirmState.loading = true
      confirmState.resolve(true)
      confirmState.loading = false
      hideConfirm()
    }
  }

  const handleCancel = () => {
    if (confirmState.resolve) {
      confirmState.resolve(false)
      hideConfirm()
    }
  }

  const hideConfirm = () => {
    confirmState.isVisible = false
    confirmState.loading = false
    confirmState.options = {}
    confirmState.resolve = undefined
  }

  // Helper method for delete confirmation
  const confirmDelete = async (staffName?: string, staffRole?: string): Promise<boolean> => {
    const staffInfo = staffName && staffRole ? {
      name: staffName,
      role: staffRole
    } : undefined

    const message = staffName 
      ? `คุณต้องการลบพนักงาน "${staffName}" ออกจากระบบหรือไม่?`
      : 'คุณต้องการลบพนักงานคนนี้ออกจากระบบหรือไม่?'

    return await showConfirm({
      title: 'ยืนยันการลบพนักงาน',
      message,
      staffInfo,
      type: 'danger'
    })
  }

  // Helper method for general confirmation
  const confirmAction = async (
    title: string, 
    message: string, 
    type: 'danger' | 'warning' | 'info' = 'warning'
  ): Promise<boolean> => {
    return await showConfirm({
      title,
      message,
      type
    })
  }

  return {
    // State
    confirmState,
    
    // Methods
    showConfirm,
    handleConfirm,
    handleCancel,
    hideConfirm,
    
    // Helpers
    confirmDelete,
    confirmAction
  }
}

// Global instance
export const globalConfirm = useConfirm()
