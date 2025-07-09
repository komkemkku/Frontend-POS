import type { 
  Reservation, 
  ReservationCreateRequest, 
  ReservationUpdateRequest, 
  ReservationQueryParams,
  ReservationStats,
  TimeSlot,
  ReservationCalendar
} from '../types'

class ReservationService {
  private baseUrl = '/api/reservations'

  // Get all reservations
  async getReservations(params?: ReservationQueryParams): Promise<{
    data: Reservation[]
    total: number
    page: number
    limit: number
  }> {
    try {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(`${this.baseUrl}?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reservations')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching reservations:', error)
      throw error
    }
  }

  // Get reservation by ID
  async getReservation(id: number): Promise<Reservation> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reservation')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching reservation:', error)
      throw error
    }
  }

  // Create new reservation
  async createReservation(data: ReservationCreateRequest): Promise<Reservation> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create reservation')
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating reservation:', error)
      throw error
    }
  }

  // Update reservation
  async updateReservation(id: number, data: ReservationUpdateRequest): Promise<Reservation> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update reservation')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating reservation:', error)
      throw error
    }
  }

  // Delete reservation
  async deleteReservation(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete reservation')
      }
    } catch (error) {
      console.error('Error deleting reservation:', error)
      throw error
    }
  }

  // Check-in reservation
  async checkInReservation(id: number): Promise<Reservation> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/checkin`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to check-in reservation')
      }
      return await response.json()
    } catch (error) {
      console.error('Error checking in reservation:', error)
      throw error
    }
  }

  // Mark as no-show
  async markNoShow(id: number): Promise<Reservation> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/no-show`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Failed to mark as no-show')
      }
      return await response.json()
    } catch (error) {
      console.error('Error marking as no-show:', error)
      throw error
    }
  }

  // Update deposit status
  async updateDeposit(id: number, data: {
    deposit_paid: boolean
    deposit_method?: string
    deposit_reference?: string
  }): Promise<Reservation> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/deposit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update deposit')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating deposit:', error)
      throw error
    }
  }

  // Get reservation statistics
  async getStats(date?: string): Promise<ReservationStats> {
    try {
      const url = date ? `${this.baseUrl}/stats?date=${date}` : `${this.baseUrl}/stats`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch reservation stats')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching reservation stats:', error)
      throw error
    }
  }

  // Get available time slots for a date
  async getAvailableTimeSlots(date: string, tableId?: number): Promise<TimeSlot[]> {
    try {
      const params = new URLSearchParams({ date })
      if (tableId) {
        params.append('table_id', tableId.toString())
      }
      
      const response = await fetch(`${this.baseUrl}/available-slots?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch available time slots')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching available time slots:', error)
      throw error
    }
  }

  // Get reservation calendar for a month
  async getReservationCalendar(year: number, month: number): Promise<ReservationCalendar[]> {
    try {
      const response = await fetch(`${this.baseUrl}/calendar?year=${year}&month=${month}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reservation calendar')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching reservation calendar:', error)
      throw error
    }
  }

  // Send confirmation SMS/Email
  async sendConfirmation(id: number, method: 'sms' | 'email'): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send confirmation')
      }
    } catch (error) {
      console.error('Error sending confirmation:', error)
      throw error
    }
  }

  // Generate mock data for development
  getMockReservations(): Reservation[] {
    const now = new Date()
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    return [
      {
        id: 1,
        table_id: 1,
        table: { id: 1, table_number: '1', capacity: 4, status: 'reserved' },
        customer_name: 'คุณสมชาย ใจดี',
        customer_phone: '081-234-5678',
        customer_email: 'somchai@email.com',
        reservation_time: `${today} 18:00:00`,
        number_of_guests: 4,
        status: 'confirmed',
        notes: 'วันเกิด ขอเค้กพิเศษ',
        special_requests: 'โต๊ะใกล้หน้าต่าง',
        deposit_amount: 500,
        deposit_paid: true,
        deposit_method: 'promptpay',
        deposit_reference: 'TXN123456789',
        total_estimated_cost: 2000,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        table_id: 3,
        table: { id: 3, table_number: '3', capacity: 2, status: 'reserved' },
        customer_name: 'คุณสมหญิง รักสะอาด',
        customer_phone: '082-345-6789',
        customer_email: 'somying@email.com',
        reservation_time: `${today} 19:30:00`,
        number_of_guests: 2,
        status: 'deposit_pending',
        notes: 'ไม่ทานเผ็ด',
        special_requests: 'โต๊ะเงียบๆ',
        deposit_amount: 300,
        deposit_paid: false,
        total_estimated_cost: 1200,
        created_at: new Date(Date.now() - 1800000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        table_id: 5,
        table: { id: 5, table_number: '5', capacity: 6, status: 'reserved' },
        customer_name: 'คุณวิชัย ธุรกิจดี',
        customer_phone: '083-456-7890',
        reservation_time: `${tomorrow} 12:00:00`,
        number_of_guests: 6,
        status: 'pending',
        notes: 'มีเด็กเล็ก 2 คน',
        special_requests: 'ต้องการเก้าอี้เด็ก',
        deposit_amount: 800,
        deposit_paid: false,
        total_estimated_cost: 3200,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        table_id: 2,
        table: { id: 2, table_number: '2', capacity: 4, status: 'reserved' },
        customer_name: 'คุณมานี มากมาย',
        customer_phone: '084-567-8901',
        reservation_time: `${tomorrow} 20:00:00`,
        number_of_guests: 4,
        status: 'deposit_paid',
        notes: 'ครบรอบแต่งงาน',
        special_requests: 'ขอดอกไม้ประดับโต๊ะ',
        deposit_amount: 600,
        deposit_paid: true,
        deposit_method: 'credit_card',
        deposit_reference: 'CC987654321',
        total_estimated_cost: 2400,
        created_at: new Date(Date.now() - 10800000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }

  // Generate mock stats
  getMockStats(): ReservationStats {
    return {
      total_reservations: 24,
      today_reservations: 8,
      pending_confirmations: 3,
      deposit_pending: 2,
      checked_in: 4,
      completed_today: 6,
      cancelled_today: 1,
      no_shows_today: 0,
      total_deposit_amount: 12500,
      average_party_size: 3.8
    }
  }
}

export const reservationService = new ReservationService()
