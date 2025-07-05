import axios from 'axios'

export const dashboardService = {
  // Get dashboard summary data (requires authentication)
  async getSummary() {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('ไม่พบ token การเข้าสู่ระบบ')
      }

      const response = await axios({
        method: 'GET',
        url: 'https://backend-pos-production.up.railway.app/summary',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Dashboard API Response:', response.data)
      return response.data
    } catch (error) {
      console.error('Dashboard API Error:', error)
      throw error
    }
  }
}
