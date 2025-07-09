import { ref, onMounted, onUnmounted } from 'vue'
import { websocketService } from '../services/websocket.service'
import type { Order, OrderStatus, PaymentStatus } from '../types'

// Real-time orders composable
export function useRealTimeOrders() {
  const isConnected = ref(false)
  const connectionStatus = ref<string>('disconnected')
  const lastUpdate = ref<Date | null>(null)
  const updateCount = ref(0)

  // Connection status tracking
  const updateConnectionStatus = () => {
    isConnected.value = websocketService.isConnected
    connectionStatus.value = websocketService.connectionState
  }

  // Event handlers
  const handleOrderCreated = (order: Order) => {
    console.log('New order created:', order)
    lastUpdate.value = new Date()
    updateCount.value++
    // Emit custom event for components to listen
    window.dispatchEvent(new CustomEvent('orderCreated', { detail: order }))
  }

  const handleOrderUpdated = (order: Order) => {
    console.log('Order updated:', order)
    lastUpdate.value = new Date()
    updateCount.value++
    window.dispatchEvent(new CustomEvent('orderUpdated', { detail: order }))
  }

  const handleOrderStatusChanged = (data: { orderId: number, status: OrderStatus, updatedAt: string }) => {
    console.log('Order status changed:', data)
    lastUpdate.value = new Date()
    updateCount.value++
    window.dispatchEvent(new CustomEvent('orderStatusChanged', { detail: data }))
  }

  const handlePaymentUpdated = (data: { orderId: number, paymentStatus: PaymentStatus, paymentMethod?: string, updatedAt: string }) => {
    console.log('Payment updated:', data)
    lastUpdate.value = new Date()
    updateCount.value++
    window.dispatchEvent(new CustomEvent('paymentUpdated', { detail: data }))
  }

  const handleOrderDeleted = (data: { orderId: number, deletedAt: string }) => {
    console.log('Order deleted:', data)
    lastUpdate.value = new Date()
    updateCount.value++
    window.dispatchEvent(new CustomEvent('orderDeleted', { detail: data }))
  }

  const handleStatsUpdated = (stats: any) => {
    console.log('Stats updated:', stats)
    lastUpdate.value = new Date()
    updateCount.value++
    window.dispatchEvent(new CustomEvent('statsUpdated', { detail: stats }))
  }

  const handleConnected = () => {
    updateConnectionStatus()
    console.log('WebSocket connected')
    
    // Subscribe to order events
    websocketService.send({
      type: 'subscribe',
      channels: ['orders', 'payments', 'stats']
    })
  }

  const handleDisconnected = () => {
    updateConnectionStatus()
    console.log('WebSocket disconnected')
  }

  const handleError = (error: any) => {
    updateConnectionStatus()
    console.error('WebSocket error:', error)
  }

  // Connect and setup event listeners
  const connect = async () => {
    try {
      await websocketService.connect()
      
      // Subscribe to WebSocket events
      websocketService.subscribe('connected', handleConnected)
      websocketService.subscribe('disconnected', handleDisconnected)
      websocketService.subscribe('error', handleError)
      websocketService.subscribe('orderCreated', handleOrderCreated)
      websocketService.subscribe('orderUpdated', handleOrderUpdated)
      websocketService.subscribe('orderStatusChanged', handleOrderStatusChanged)
      websocketService.subscribe('paymentUpdated', handlePaymentUpdated)
      websocketService.subscribe('orderDeleted', handleOrderDeleted)
      websocketService.subscribe('statsUpdated', handleStatsUpdated)
      
      updateConnectionStatus()
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }

  // Disconnect and cleanup
  const disconnect = () => {
    websocketService.unsubscribe('connected', handleConnected)
    websocketService.unsubscribe('disconnected', handleDisconnected)
    websocketService.unsubscribe('error', handleError)
    websocketService.unsubscribe('orderCreated', handleOrderCreated)
    websocketService.unsubscribe('orderUpdated', handleOrderUpdated)
    websocketService.unsubscribe('orderStatusChanged', handleOrderStatusChanged)
    websocketService.unsubscribe('paymentUpdated', handlePaymentUpdated)
    websocketService.unsubscribe('orderDeleted', handleOrderDeleted)
    websocketService.unsubscribe('statsUpdated', handleStatsUpdated)
    
    websocketService.disconnect()
    updateConnectionStatus()
  }

  // Manual reconnect
  const reconnect = async () => {
    disconnect()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await connect()
  }

  return {
    isConnected,
    connectionStatus,
    lastUpdate,
    updateCount,
    connect,
    disconnect,
    reconnect
  }
}

// Real-time stats composable
export function useRealTimeStats() {
  const stats = ref({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeOrders: 0,
    averageOrderValue: 0
  })

  const updateStats = (newStats: any) => {
    stats.value = { ...stats.value, ...newStats }
  }

  onMounted(() => {
    window.addEventListener('statsUpdated', (event: any) => {
      updateStats(event.detail)
    })
  })

  onUnmounted(() => {
    window.removeEventListener('statsUpdated', updateStats)
  })

  return {
    stats,
    updateStats
  }
}

// Polling fallback composable
export function usePolling(callback: Function, interval: number = 30000) {
  const isPolling = ref(false)
  let pollingInterval: NodeJS.Timeout | null = null

  const startPolling = () => {
    if (isPolling.value) return
    
    isPolling.value = true
    pollingInterval = setInterval(() => {
      callback()
    }, interval)
  }

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
    isPolling.value = false
  }

  const restartPolling = () => {
    stopPolling()
    startPolling()
  }

  onUnmounted(() => {
    stopPolling()
  })

  return {
    isPolling,
    startPolling,
    stopPolling,
    restartPolling
  }
}
