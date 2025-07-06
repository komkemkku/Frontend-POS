import { ref, computed, reactive } from 'vue'
import { StaffService } from '@/services/staff.service'
import { notification } from '@/utils/notification'
import type { 
  Staff, 
  StaffCreateRequest, 
  StaffUpdateRequest, 
  StaffQueryParams,
  PaginatedResponse 
} from '@/types'

// Global state for staff management
const staffList = ref<Staff[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

export function useStaff() {
  // Computed properties
  const totalPages = computed(() => Math.ceil(pagination.total / pagination.size))
  const hasNextPage = computed(() => pagination.page < totalPages.value)
  const hasPrevPage = computed(() => pagination.page > 1)

  // Reset error
  const clearError = () => {
    error.value = null
  }

  // Fetch staff list
  const fetchStaffList = async (params: StaffQueryParams = {}) => {
    try {
      loading.value = true
      clearError()
      
      const queryParams = {
        page: params.page || pagination.page,
        size: params.size || pagination.size,
        search: params.search
      }

      const response: PaginatedResponse<Staff> = await StaffService.getStaffList(queryParams)
      
      staffList.value = response.items || []
      pagination.page = response.page
      pagination.size = response.size
      pagination.total = response.total
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลพนักงาน'
      notification.error({
        title: 'ไม่สามารถโหลดข้อมูลได้',
        message: error.value
      })
      console.error('Error fetching staff:', err)
    } finally {
      loading.value = false
    }
  }

  // Get staff by ID
  const getStaffById = async (id: number): Promise<Staff | null> => {
    try {
      loading.value = true
      clearError()
      
      const staff = await StaffService.getStaffById(id)
      return staff
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูลพนักงาน'
      notification.warning({
        title: 'ไม่พบข้อมูลพนักงาน',
        message: error.value
      })
      console.error('Error fetching staff by ID:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Create new staff
  const createStaff = async (staffData: StaffCreateRequest): Promise<boolean> => {
    try {
      loading.value = true
      clearError()
      
      await StaffService.createStaff(staffData)
      
      // Refresh staff list
      await fetchStaffList()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการสร้างพนักงาน'
      console.error('Error creating staff:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Update staff
  const updateStaff = async (id: number, staffData: StaffUpdateRequest): Promise<boolean> => {
    try {
      loading.value = true
      clearError()
      
      await StaffService.updateStaff(id, staffData)
      
      // Refresh staff list
      await fetchStaffList()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลพนักงาน'
      console.error('Error updating staff:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete staff with confirmation
  const deleteStaff = async (id: number, staffName?: string, staffRole?: string): Promise<boolean> => {
    try {
      loading.value = true
      clearError()
      
      await StaffService.deleteStaff(id, staffName, staffRole)
      
      // Refresh staff list
      await fetchStaffList()
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบพนักงาน'
      console.error('Error deleting staff:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Search staff
  const searchStaff = async (searchTerm: string) => {
    pagination.page = 1 // Reset to first page when searching
    await fetchStaffList({ search: searchTerm })
  }

  // Change page
  const changePage = async (page: number) => {
    if (page < 1 || page > totalPages.value) return
    pagination.page = page
    await fetchStaffList()
  }

  // Next page
  const nextPage = async () => {
    if (hasNextPage.value) {
      await changePage(pagination.page + 1)
    }
  }

  // Previous page
  const prevPage = async () => {
    if (hasPrevPage.value) {
      await changePage(pagination.page - 1)
    }
  }

  return {
    // State
    staffList: computed(() => staffList.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    pagination: computed(() => pagination),
    
    // Computed
    totalPages,
    hasNextPage,
    hasPrevPage,
    
    // Actions
    fetchStaffList,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    searchStaff,
    changePage,
    nextPage,
    prevPage,
    clearError
  }
}
