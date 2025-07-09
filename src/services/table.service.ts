import axios from 'axios'
import type { Table, TableStatus, TableCreateRequest, TableUpdateRequest } from '../types'

export class TableService {
  private readonly baseURL = 'http://localhost:8080/api/v1'

  // Get all tables
  async getTables(params?: {
    page?: number
    limit?: number
    status?: TableStatus
    is_active?: boolean
  }) {
    const response = await axios.get(`${this.baseURL}/tables`, { 
      params,
      headers: this.getAuthHeaders() 
    })
    return response.data
  }

  // Get table by ID
  async getTable(id: number): Promise<Table> {
    const response = await axios.get(`${this.baseURL}/tables/${id}`, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Create new table
  async createTable(tableData: TableCreateRequest): Promise<Table> {
    const response = await axios.post(`${this.baseURL}/tables`, tableData, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Update table
  async updateTable(id: number, tableData: TableUpdateRequest): Promise<Table> {
    const response = await axios.put(`${this.baseURL}/tables/${id}`, tableData, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Delete table
  async deleteTable(id: number): Promise<void> {
    await axios.delete(`${this.baseURL}/tables/${id}`, {
      headers: this.getAuthHeaders()
    })
  }

  // Update table status
  async updateTableStatus(id: number, status: TableStatus): Promise<Table> {
    const response = await axios.patch(`${this.baseURL}/tables/${id}/status`, { status }, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Get available tables
  async getAvailableTables(): Promise<Table[]> {
    const response = await axios.get(`${this.baseURL}/tables/available`, {
      headers: this.getAuthHeaders()
    })
    return response.data.data
  }

  // Mock data methods for development
  getMockTables(): Table[] {
    return [
      {
        id: 1,
        table_number: 'T01',
        capacity: 4,
        status: 'available',
        location: 'indoor',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        table_number: 'T02',
        capacity: 2,
        status: 'occupied',
        location: 'indoor',
        is_active: true,
        current_order_id: 1001,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        table_number: 'T03',
        capacity: 6,
        status: 'reserved',
        location: 'outdoor',
        is_active: true,
        current_reservation_id: 501,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 4,
        table_number: 'VIP01',
        capacity: 8,
        status: 'maintenance',
        location: 'private',
        is_active: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 5,
        table_number: 'T04',
        capacity: 4,
        status: 'available',
        location: 'terrace',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 6,
        table_number: 'T05',
        capacity: 2,
        status: 'available',
        location: 'indoor',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ]
  }

  getMockStats() {
    const tables = this.getMockTables()
    return {
      total: tables.length,
      available: tables.filter(t => t.status === 'available' && t.is_active).length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      maintenance: tables.filter(t => t.status === 'maintenance' || !t.is_active).length
    }
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}

// Create and export service instance
export const tableService = new TableService()
export default TableService
