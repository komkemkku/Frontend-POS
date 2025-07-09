import axios from 'axios'
import type { 
  Order, 
  OrderCreateRequest, 
  OrderUpdateRequest, 
  OrderItem,
  OrderItemRequest,
  OrderStatus,
  PaymentStatus
} from '../types'

export class OrderService {
  private readonly baseURL = 'http://localhost:8080/api/v1'

  // Get all orders with pagination and filters
  async getOrders(params?: {
    page?: number
    limit?: number
    status?: OrderStatus
    payment_status?: PaymentStatus
    table_id?: number
    start_date?: string
    end_date?: string
  }) {
    const response = await axios.get(`${this.baseURL}/orders`, { 
      params,
      headers: this.getAuthHeaders() 
    })
    return response.data
  }

  // Get order by ID
  async getOrder(id: number): Promise<Order> {
    const response = await axios.get(`${this.baseURL}/orders/${id}`, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Create new order
  async createOrder(orderData: OrderCreateRequest): Promise<Order> {
    const response = await axios.post(`${this.baseURL}/orders`, orderData, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Update order
  async updateOrder(id: number, orderData: OrderUpdateRequest): Promise<Order> {
    const response = await axios.put(`${this.baseURL}/orders/${id}`, orderData, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Delete order
  async deleteOrder(id: number): Promise<void> {
    await axios.delete(`${this.baseURL}/orders/${id}`, {
      headers: this.getAuthHeaders()
    })
  }

  // Add item to order
  async addOrderItem(orderId: number, item: OrderItemRequest): Promise<OrderItem> {
    const response = await axios.post(`${this.baseURL}/orders/${orderId}/items`, item, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Update order item
  async updateOrderItem(orderId: number, itemId: number, item: Partial<OrderItemRequest>): Promise<OrderItem> {
    const response = await axios.put(`${this.baseURL}/orders/${orderId}/items/${itemId}`, item, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Remove item from order
  async removeOrderItem(orderId: number, itemId: number): Promise<void> {
    await axios.delete(`${this.baseURL}/orders/${orderId}/items/${itemId}`, {
      headers: this.getAuthHeaders()
    })
  }

  // Update order status
  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    const response = await axios.patch(`${this.baseURL}/orders/${id}/status`, { status }, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Update payment status
  async updatePaymentStatus(id: number, payment_status: PaymentStatus, payment_method?: string): Promise<Order> {
    const response = await axios.patch(`${this.baseURL}/orders/${id}/payment`, { 
      payment_status, 
      payment_method 
    }, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Get order statistics
  async getOrderStats(params?: {
    start_date?: string
    end_date?: string
    table_id?: number
  }) {
    const response = await axios.get(`${this.baseURL}/orders/stats`, { 
      params,
      headers: this.getAuthHeaders() 
    })
    return response.data.data
  }

  // Get recent orders
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    const response = await axios.get(`${this.baseURL}/orders/recent`, {
      params: { limit },
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}

// Create and export service instance
export const orderService = new OrderService()
export default OrderService
