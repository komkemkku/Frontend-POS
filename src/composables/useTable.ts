import { ref, computed } from 'vue'
import type { 
  Table, 
  TableCreateRequest, 
  TableUpdateRequest,
  TableQueryParams
} from '@/types/table'
import { TableService, type PaginatedResponse } from '@/services/table.service'

// Global state for table management
const tableList = ref<Table[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const pagination = ref({
  page: 1,
  size: 10,
  total: 0
})

// Computed values
const totalPages = computed(() => 
  Math.ceil(pagination.value.total / pagination.value.size)
)

const hasNextPage = computed(() => 
  pagination.value.page < totalPages.value
)

const hasPrevPage = computed(() => 
  pagination.value.page > 1
)

const availableTablesCount = computed(() => 
  tableList.value.filter(table => table.status === '1').length
)

const occupiedTablesCount = computed(() => 
  tableList.value.filter(table => table.status === '2').length
)

const reservedTablesCount = computed(() => 
  tableList.value.filter(table => table.status === '3').length
)

const unavailableTablesCount = computed(() => 
  tableList.value.filter(table => table.status === '4').length
)

export function useTable() {
  // Fetch table list
  const fetchTableList = async (params?: TableQueryParams) => {
    try {
      loading.value = true
      error.value = null
      
      const queryParams = {
        page: pagination.value.page,
        size: pagination.value.size,
        ...params
      }
      
      const response: PaginatedResponse<Table> = await TableService.getTableList(queryParams)
      
      tableList.value = response.items
      pagination.value = {
        page: response.page,
        size: response.size,
        total: response.total
      }
    } catch (err: any) {
      error.value = err.message
      tableList.value = []
    } finally {
      loading.value = false
    }
  }

  // Create new table
  const createTable = async (data: TableCreateRequest) => {
    try {
      loading.value = true
      await TableService.createTable(data)
      // Refresh the list after creating
      await fetchTableList()
    } catch (err: any) {
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update table
  const updateTable = async (id: number, data: TableUpdateRequest) => {
    try {
      loading.value = true
      await TableService.updateTable(id, data)
      // Refresh the list after updating
      await fetchTableList()
    } catch (err: any) {
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete table
  const deleteTable = async (id: number, tableNumber?: number) => {
    try {
      loading.value = true
      await TableService.deleteTable(id, tableNumber)
      // Refresh the list after deleting
      await fetchTableList()
    } catch (err: any) {
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update table status quickly
  const updateTableStatus = async (id: number, status: string) => {
    try {
      await TableService.updateTableStatus(id, status)
      // Update local state immediately for better UX
      const tableIndex = tableList.value.findIndex(table => table.id === id)
      if (tableIndex !== -1) {
        tableList.value[tableIndex].status = status as any
      }
    } catch (err: any) {
      // Refresh on error to ensure consistency
      await fetchTableList()
      throw err
    }
  }

  // Regenerate QR code
  const regenerateQRCode = async (id: number): Promise<string> => {
    try {
      const newIdentifier = await TableService.regenerateQRCode(id)
      // Update local state
      const tableIndex = tableList.value.findIndex(table => table.id === id)
      if (tableIndex !== -1) {
        tableList.value[tableIndex].qr_code_identifier = newIdentifier
      }
      return newIdentifier
    } catch (err: any) {
      throw err
    }
  }

  // Get table by ID
  const getTableById = async (id: number): Promise<Table> => {
    try {
      return await TableService.getTableById(id)
    } catch (err: any) {
      throw err
    }
  }

  // Search tables
  const searchTables = async (searchTerm: string) => {
    await fetchTableList({ search: searchTerm, page: 1 })
  }

  // Pagination
  const nextPage = async () => {
    if (hasNextPage.value) {
      pagination.value.page++
      await fetchTableList()
    }
  }

  const prevPage = async () => {
    if (hasPrevPage.value) {
      pagination.value.page--
      await fetchTableList()
    }
  }

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      pagination.value.page = page
      await fetchTableList()
    }
  }

  // Reset state
  const resetState = () => {
    tableList.value = []
    loading.value = false
    error.value = null
    pagination.value = {
      page: 1,
      size: 10,
      total: 0
    }
  }

  return {
    // State
    tableList,
    loading,
    error,
    pagination,
    
    // Computed
    totalPages,
    hasNextPage,
    hasPrevPage,
    availableTablesCount,
    occupiedTablesCount,
    reservedTablesCount,
    unavailableTablesCount,
    
    // Methods
    fetchTableList,
    createTable,
    updateTable,
    deleteTable,
    updateTableStatus,
    regenerateQRCode,
    getTableById,
    searchTables,
    nextPage,
    prevPage,
    goToPage,
    resetState
  }
}
