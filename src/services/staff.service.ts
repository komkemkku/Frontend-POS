import api from '@/utils/apiClient'
import type { 
  Staff, 
  StaffCreateRequest, 
  StaffUpdateRequest,
  StaffQueryParams,
  StaffResponse,
  PaginatedResponse
} from '@/types'
import { notification } from '@/utils/notification'

export class StaffService {
  // Get all staff with pagination and search
  static async getStaffList(params: StaffQueryParams = {}): Promise<PaginatedResponse<Staff>> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.size) queryParams.append('size', params.size.toString())
      if (params.search) queryParams.append('search', params.search)
      
      const url = queryParams.toString() ? `/staff?${queryParams}` : '/staff'
      const response = await api.get(url)
      
      console.log('Staff API Response:', response.data) // Debug log
      
      // Backend response format: { status: {...}, data: Staff[], paginate: {...} }
      if (response.data.status?.code === 200 && response.data.data) {
        const pagination = response.data.paginate || response.data.pagination
        return {
          items: Array.isArray(response.data.data) ? response.data.data : [],
          total: pagination?.Total || 0,
          page: pagination?.Page || 1,
          size: pagination?.Size || 10,
          totalPages: Math.ceil((pagination?.Total || 0) / (pagination?.Size || 10))
        }
      } else {
        console.warn('Unexpected API response format:', response.data)
        return {
          items: [],
          total: 0,
          page: 1,
          size: 10,
          totalPages: 1
        }
      }
    } catch (error: any) {
      console.error('Staff API Error:', error)
      const errorMessage = error.response?.data?.status?.message || error.message || 'ไม่สามารถโหลดข้อมูลพนักงานได้'
      notification.error({
        title: 'เกิดข้อผิดพลาด',
        message: errorMessage,
        duration: 5000
      })
      throw new Error(errorMessage)
    }
  }

  // Get staff by ID
  static async getStaffById(id: number): Promise<Staff> {
    try {
      const response = await api.get(`/staff/${id}`)
      // Backend response format: { status: {...}, data: Staff }
      if (response.data.status?.code === 200 && response.data.data) {
        return response.data.data
      }
      throw new Error('ไม่พบข้อมูลพนักงาน')
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลพนักงานได้')
    }
  }

  // Create new staff
  static async createStaff(data: StaffCreateRequest): Promise<void> {
    try {
      console.log('Creating staff:', data) // Debug log
      
      // Backend endpoint: POST /staff/create
      const response = await api.post('/staff/create', data)
      
      console.log('Create staff response:', response.data) // Debug log
      
      if (response.data.status?.code !== 200) {
        throw new Error(response.data.status?.message || 'ไม่สามารถสร้างพนักงานได้')
      }
      
      notification.success({
        title: 'สร้างพนักงานสำเร็จ! 🎉',
        message: `เพิ่มพนักงาน ${data.full_name} เรียบร้อยแล้ว`
      })
    } catch (error: any) {
      console.error('Create staff error:', error)
      const errorMessage = error.response?.data?.status?.message || error.message || 'ไม่สามารถสร้างพนักงานได้'
      notification.error({
        title: 'เกิดข้อผิดพลาด!',
        message: errorMessage,
        duration: 6000
      })
      throw new Error(errorMessage)
    }
  }

  // Update staff
  static async updateStaff(id: number, data: StaffUpdateRequest): Promise<void> {
    try {
      console.log('Updating staff:', { id, data }) // Debug log
      
      // Backend endpoint: PATCH /staff/:id
      const response = await api.patch(`/staff/${id}`, data)
      
      console.log('Update staff response:', response.data) // Debug log
      
      if (response.data.status?.code !== 200) {
        throw new Error(response.data.status?.message || 'ไม่สามารถแก้ไขข้อมูลพนักงานได้')
      }
      
      notification.success({
        title: 'แก้ไขข้อมูลสำเร็จ! ✅',
        message: `อัปเดตข้อมูลพนักงาน ${data.full_name} เรียบร้อยแล้ว`
      })
    } catch (error: any) {
      console.error('Update staff error:', error)
      const errorMessage = error.response?.data?.status?.message || error.message || 'ไม่สามารถแก้ไขข้อมูลพนักงานได้'
      notification.error({
        title: 'เกิดข้อผิดพลาด!',
        message: errorMessage,
        duration: 6000
      })
      throw new Error(errorMessage)
    }
  }

  // Delete staff with beautiful modal confirmation
  static async deleteStaff(id: number, staffName?: string, staffRole?: string): Promise<void> {
    try {
      console.log('Requesting delete confirmation for staff:', { id, staffName, staffRole }) // Debug log
      
      // Import the global confirm instance
      const { globalConfirm } = await import('@/composables/useConfirm')
      
      // Show beautiful confirmation modal
      const confirmed = await globalConfirm.confirmDelete(staffName, staffRole)
      
      if (!confirmed) {
        notification.info({
          title: '✋ ยกเลิกการลบ',
          message: 'การลบพนักงานถูกยกเลิกแล้ว'
        })
        return
      }

      console.log('Deleting staff:', { id, staffName, staffRole }) // Debug log
      
      const response = await api.delete(`/staff/${id}`)
      
      console.log('Delete staff response:', response.data) // Debug log
      
      if (response.data.status?.code !== 200) {
        throw new Error(response.data.status?.message || 'ไม่สามารถลบพนักงานได้')
      }
      
      notification.success({
        title: '🎉 ลบพนักงานสำเร็จ!',
        message: staffName 
          ? `ลบพนักงาน "${staffName}" ออกจากระบบเรียบร้อยแล้ว`
          : 'ข้อมูลพนักงานถูกลบออกจากระบบแล้ว'
      })
    } catch (error: any) {
      console.error('Delete staff error:', error)
      const errorMessage = error.response?.data?.status?.message || error.message || 'ไม่สามารถลบพนักงานได้'
      notification.error({
        title: '❌ เกิดข้อผิดพลาด!',
        message: errorMessage,
        duration: 6000
      })
      throw new Error(errorMessage)
    }
  }

  // Get current staff info
  static async getCurrentStaffInfo(): Promise<Staff> {
    try {
      const response = await api.get('/staff/info')
      // Backend response format: { status: {...}, data: Staff }
      if (response.data.status?.code === 200 && response.data.data) {
        return response.data.data
      }
      throw new Error('ไม่พบข้อมูลพนักงานปัจจุบัน')
    } catch (error: any) {
      throw new Error(error.response?.data?.status?.message || 'ไม่สามารถโหลดข้อมูลพนักงานปัจจุบันได้')
    }
  }
}

// Create a singleton instance
export const staffService = new StaffService()

// Default export
export default StaffService
