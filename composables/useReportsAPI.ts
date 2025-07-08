import { mockReportData, mockTransactions } from '../src/data/mockReportsData'

// ===== INTERFACES =====

export interface ReportSummary {
  totalSales: number
  totalOrders: number
  newCustomers: number
  averageOrderValue: number
  salesByDay: Array<{
    date: string
    sales: number
    orders: number
    customers: number
  }>
  salesChartData: Array<{
    date: string
    value: number
  }>
  ordersChartData: Array<{
    date: string
    value: number
  }>
  customersChartData: Array<{
    date: string
    value: number
  }>
  topProducts: Array<{
    id: string
    name: string
    quantity: number
    totalSales: number
  }>
  salesByCategory: Array<{
    name: string
    totalSales: number
    quantity: number
  }>
  peakHours: Array<{
    time: string
    orders: number
    percentage: number
  }>
  customerInsights: {
    newCustomers: number
    returningCustomers: number
    averageOrderValue: number
  }
  revenueTrends: {
    monthlyGrowth: number
    weeklyGrowth: number
    monthlyTarget: number
    targetProgress: number
  }
  paymentMethods?: PaymentMethod[]
  staffPerformance?: StaffPerformance[]
  hourlyTrends?: TimeBasedSales[]
  customerSegments?: CustomerSegment[]
}

// ===== TRANSACTION INTERFACE =====

export interface Transaction {
  id: string
  customerName: string
  customerEmail: string
  orderDate: string
  items: Array<{
    sku: string
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: string
}

// ===== PRODUCT & CATEGORY INTERFACES =====

export interface ProductSales {
  sku: string
  name: string
  quantitySold: number
  totalSales: number
}

export interface CategorySales {
  category: string
  totalSales: number
}

// ===== ADDITIONAL REPORT INTERFACES =====

export interface PaymentMethod {
  method: string
  count: number
  totalAmount: number
  percentage: number
}

export interface StaffPerformance {
  staffId: string
  staffName: string
  ordersHandled: number
  totalSales: number
  averageOrderValue: number
}

export interface TimeBasedSales {
  hour: number
  sales: number
  orders: number
  averageOrderValue: number
}

export interface CustomerSegment {
  segment: string
  count: number
  totalSpent: number
  averageOrderValue: number
  frequency: number
}

// ===== DYNAMIC DATA GENERATOR =====

const generateDynamicData = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // กำหนดตัวคูณตามช่วงวันที่
  const getDataMultiplier = (days: number) => {
    if (days <= 7) return 1         // 7 วัน = ข้อมูลปกติ
    if (days <= 30) return 4.3      // 30 วัน = 4.3 เท่า
    if (days <= 60) return 8.6      // 60 วัน = 8.6 เท่า
    return 12.9                     // 90+ วัน = 12.9 เท่า
  }
  
  const multiplier = getDataMultiplier(diffDays)
  
  // ===== GENERATE DAILY DATA =====
  
  // สร้างข้อมูลตามวัน
  const salesChartData: Array<{ date: string; value: number }> = []
  const ordersChartData: Array<{ date: string; value: number }> = []
  const customersChartData: Array<{ date: string; value: number }> = []
  const salesByDay: Array<{ date: string; sales: number; orders: number; customers: number }> = []
  
  for (let i = 0; i < diffDays; i++) {
    const currentDate = new Date(start)
    currentDate.setDate(start.getDate() + i)
    const dateStr = currentDate.toLocaleDateString('th-TH', { 
      day: '2-digit', 
      month: '2-digit' 
    })
    
    // สร้างข้อมูลแบบสุ่มที่สมจริง - ปรับตาม multiplier
    const baseSales = 25000 + (Math.random() * 30000)
    const dayOfWeek = currentDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const weekendMultiplier = isWeekend ? 1.4 : 1.0
    
    // เพิ่มความหลากหลายตามช่วงเวลา
    const seasonalVariation = Math.sin((i / diffDays) * Math.PI * 2) * 0.2 + 1
    const randomVariation = 0.85 + Math.random() * 0.3
    
    const sales = Math.round(baseSales * weekendMultiplier * seasonalVariation * randomVariation)
    const orders = Math.round((sales / 350) + Math.random() * 15)
    const customers = Math.round(orders * (0.75 + Math.random() * 0.15))
    
    salesChartData.push({ date: dateStr, value: sales })
    ordersChartData.push({ date: dateStr, value: orders })
    customersChartData.push({ date: dateStr, value: customers })
    salesByDay.push({ date: dateStr, sales, orders, customers })
  }
  
  // ===== CALCULATE TOTALS =====
  
  // คำนวณ KPI รวม
  const totalSales = salesByDay.reduce((sum, day) => sum + day.sales, 0)
  const totalOrders = salesByDay.reduce((sum, day) => sum + day.orders, 0)
  const totalCustomers = salesByDay.reduce((sum, day) => sum + day.customers, 0)
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0
  
  // ===== GENERATE TOP PRODUCTS =====
  const baseProducts = [
    { id: 'P001', name: 'ข้าวผัดกุ้ง', baseQty: 45, basePrice: 300 },
    { id: 'P002', name: 'ต้มยำกุ้ง', baseQty: 32, basePrice: 400 },
    { id: 'P003', name: 'ผัดไทย', baseQty: 38, basePrice: 280 },
    { id: 'P004', name: 'สมตำ', baseQty: 28, basePrice: 120 },
    { id: 'P005', name: 'ข้าวผัดหมู', baseQty: 35, basePrice: 250 },
    { id: 'P006', name: 'แกงเขียวหวาน', baseQty: 25, basePrice: 320 },
    { id: 'P007', name: 'ลาบหมู', baseQty: 30, basePrice: 180 },
    { id: 'P008', name: 'ข้าวผัดสับปะรด', baseQty: 22, basePrice: 350 },
    { id: 'P009', name: 'ผัดซีอิ๊ว', baseQty: 26, basePrice: 200 },
    { id: 'P010', name: 'ต้มข่าไก่', baseQty: 18, basePrice: 380 }
  ]
  
  const topProducts = baseProducts.map(product => {
    // ใช้ multiplier เดียวกับที่คำนวณไว้
    const seasonalFactor = 0.8 + Math.random() * 0.4 // ความนิยมตามฤดูกาล
    const quantity = Math.round(product.baseQty * multiplier * seasonalFactor)
    
    return {
      id: product.id,
      name: product.name,
      quantity,
      totalSales: quantity * product.basePrice
    }
  }).sort((a, b) => b.totalSales - a.totalSales).slice(0, 5)
  
  // ===== GENERATE CATEGORY SALES =====
  
  // สร้างข้อมูล category ที่สมดุลกับยอดขายรวม
  const salesByCategory = [
    { name: 'อาหารจานหลัก', ratio: 0.45 },
    { name: 'เครื่องดื่ม', ratio: 0.25 },
    { name: 'ของหวาน', ratio: 0.15 },
    { name: 'ของทานเล่น', ratio: 0.10 },
    { name: 'อื่นๆ', ratio: 0.05 }
  ].map(cat => ({
    name: cat.name,
    totalSales: Math.round(totalSales * cat.ratio),
    quantity: Math.round(totalOrders * cat.ratio * 2)
  }))
  
  // ===== GENERATE PEAK HOURS =====
  const basePeakOrders = totalOrders
  const peakHours = [
    { time: '08:00-09:00', percentage: 0.08 },
    { time: '09:00-10:00', percentage: 0.12 },
    { time: '11:00-12:00', percentage: 0.15 },
    { time: '12:00-13:00', percentage: 0.25 },
    { time: '13:00-14:00', percentage: 0.14 },
    { time: '17:00-18:00', percentage: 0.12 },
    { time: '18:00-19:00', percentage: 0.20 },
    { time: '19:00-20:00', percentage: 0.18 },
    { time: '20:00-21:00', percentage: 0.10 }
  ].map(hour => {
    const orders = Math.round(basePeakOrders * hour.percentage)
    return {
      time: hour.time,
      orders,
      percentage: Math.round((orders / Math.max(...salesByDay.map(d => d.orders))) * 100)
    }
  })
  
  // ===== CUSTOMER INSIGHTS =====
  const customerInsights = {
    newCustomers: Math.round(totalCustomers * (0.25 + Math.random() * 0.15)), // 25-40% ลูกค้าใหม่
    returningCustomers: 0,
    averageOrderValue
  }
  customerInsights.returningCustomers = totalCustomers - customerInsights.newCustomers
  
  // ===== REVENUE TRENDS =====
  
  // Revenue trends ที่แตกต่างกันตามช่วงเวลา
  let monthlyGrowth, weeklyGrowth
  
  if (diffDays >= 60) {
    // ข้อมูล 60+ วัน: แนวโน้มระยะยาว
    monthlyGrowth = 2 + Math.random() * 18  // 2-20% growth
    weeklyGrowth = monthlyGrowth * 0.25     // สัดส่วนรายสัปดาห์
  } else if (diffDays >= 30) {
    // ข้อมูล 30 วัน: แนวโน้มระยะกลาง
    monthlyGrowth = -2 + Math.random() * 22 // -2% ถึง +20%
    weeklyGrowth = monthlyGrowth * 0.25
  } else {
    // ข้อมูล 7-30 วัน: แนวโน้มระยะสั้น
    weeklyGrowth = -5 + Math.random() * 20  // -5% ถึง +15%
    monthlyGrowth = weeklyGrowth * 4        // ประมาณค่ารายเดือน
  }
  
  const revenueTrends = {
    monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
    weeklyGrowth: Math.round(weeklyGrowth * 10) / 10,
    monthlyTarget: Math.round(totalSales * 1.15), // เป้าหมาย +15%
    targetProgress: Math.round((totalSales / (totalSales * 1.15)) * 100)
  }
  
  // ===== PAYMENT METHODS DATA =====
  
  const paymentMethods: PaymentMethod[] = [
    { method: 'เงินสด', count: Math.round(totalOrders * 0.45), totalAmount: Math.round(totalSales * 0.40), percentage: 40 },
    { method: 'โอนผ่านธนาคาร', count: Math.round(totalOrders * 0.30), totalAmount: Math.round(totalSales * 0.35), percentage: 35 },
    { method: 'บัตรเครดิต', count: Math.round(totalOrders * 0.20), totalAmount: Math.round(totalSales * 0.20), percentage: 20 },
    { method: 'QR Code', count: Math.round(totalOrders * 0.05), totalAmount: Math.round(totalSales * 0.05), percentage: 5 }
  ]
  
  // ===== STAFF PERFORMANCE DATA =====
  
  const staffPerformance: StaffPerformance[] = [
    { 
      staffId: 'S001', 
      staffName: 'พนักงานA', 
      ordersHandled: Math.round(totalOrders * 0.35), 
      totalSales: Math.round(totalSales * 0.35), 
      averageOrderValue: Math.round((totalSales * 0.35) / (totalOrders * 0.35))
    },
    { 
      staffId: 'S002', 
      staffName: 'พนักงานB', 
      ordersHandled: Math.round(totalOrders * 0.30), 
      totalSales: Math.round(totalSales * 0.30), 
      averageOrderValue: Math.round((totalSales * 0.30) / (totalOrders * 0.30))
    },
    { 
      staffId: 'S003', 
      staffName: 'พนักงานC', 
      ordersHandled: Math.round(totalOrders * 0.25), 
      totalSales: Math.round(totalSales * 0.25), 
      averageOrderValue: Math.round((totalSales * 0.25) / (totalOrders * 0.25))
    },
    { 
      staffId: 'S004', 
      staffName: 'พนักงานD', 
      ordersHandled: Math.round(totalOrders * 0.10), 
      totalSales: Math.round(totalSales * 0.10), 
      averageOrderValue: Math.round((totalSales * 0.10) / (totalOrders * 0.10))
    }
  ]
  
  // ===== HOURLY TRENDS DATA =====
  
  const hourlyTrends: TimeBasedSales[] = [
    { hour: 8, sales: Math.round(totalSales * 0.05), orders: Math.round(totalOrders * 0.05), averageOrderValue: 0 },
    { hour: 9, sales: Math.round(totalSales * 0.08), orders: Math.round(totalOrders * 0.08), averageOrderValue: 0 },
    { hour: 10, sales: Math.round(totalSales * 0.10), orders: Math.round(totalOrders * 0.10), averageOrderValue: 0 },
    { hour: 11, sales: Math.round(totalSales * 0.15), orders: Math.round(totalOrders * 0.15), averageOrderValue: 0 },
    { hour: 12, sales: Math.round(totalSales * 0.20), orders: Math.round(totalOrders * 0.20), averageOrderValue: 0 },
    { hour: 13, sales: Math.round(totalSales * 0.12), orders: Math.round(totalOrders * 0.12), averageOrderValue: 0 },
    { hour: 17, sales: Math.round(totalSales * 0.10), orders: Math.round(totalOrders * 0.10), averageOrderValue: 0 },
    { hour: 18, sales: Math.round(totalSales * 0.15), orders: Math.round(totalOrders * 0.15), averageOrderValue: 0 },
    { hour: 19, sales: Math.round(totalSales * 0.05), orders: Math.round(totalOrders * 0.05), averageOrderValue: 0 }
  ].map(trend => ({
    ...trend,
    averageOrderValue: trend.orders > 0 ? Math.round(trend.sales / trend.orders) : 0
  }))
  
  // ===== CUSTOMER SEGMENTS DATA =====
  
  const customerSegments: CustomerSegment[] = [
    { 
      segment: 'ลูกค้าใหม่', 
      count: customerInsights.newCustomers, 
      totalSpent: Math.round(totalSales * 0.25), 
      averageOrderValue: Math.round((totalSales * 0.25) / customerInsights.newCustomers),
      frequency: 1
    },
    { 
      segment: 'ลูกค้าประจำ', 
      count: Math.round(customerInsights.returningCustomers * 0.7), 
      totalSpent: Math.round(totalSales * 0.50), 
      averageOrderValue: Math.round((totalSales * 0.50) / Math.round(customerInsights.returningCustomers * 0.7)),
      frequency: 3
    },
    { 
      segment: 'ลูกค้า VIP', 
      count: Math.round(customerInsights.returningCustomers * 0.3), 
      totalSpent: Math.round(totalSales * 0.25), 
      averageOrderValue: Math.round((totalSales * 0.25) / Math.round(customerInsights.returningCustomers * 0.3)),
      frequency: 8
    }
  ]
  
  // ===== RETURN COMPLETE DATA =====
  
  return {
    totalSales,
    totalOrders,
    newCustomers: customerInsights.newCustomers,
    averageOrderValue,
    salesByDay,
    salesChartData,
    ordersChartData,
    customersChartData,
    topProducts,
    salesByCategory,
    peakHours,
    customerInsights,
    revenueTrends,
    paymentMethods,
    staffPerformance,
    hourlyTrends,
    customerSegments
  }
}

// ===== REPORTS API COMPOSABLE =====

export const useReportsAPI = () => {
  const baseURL = '/api'
  const useMockData = true // เปลี่ยนเป็น false เมื่อ Backend พร้อม

  // ===== REPORT SUMMARY API =====

  const getReportSummary = async (startDate: string, endDate: string): Promise<ReportSummary> => {
    if (useMockData) {
      // จำลองการหน่วงเวลา API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // สร้างข้อมูลแบบไดนามิกตามช่วงวันที่เลือก
      const dynamicData = generateDynamicData(startDate, endDate)
      return dynamicData as ReportSummary
    }
    
    const response = await fetch(`${baseURL}/reports/summary?startDate=${startDate}&endDate=${endDate}`)
    if (!response.ok) throw new Error('Failed to fetch report summary')
    const result = await response.json()
    return result.data
  }

  // ===== TRANSACTIONS API =====

  const getTransactions = async (startDate: string, endDate: string): Promise<Transaction[]> => {
    if (useMockData) {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // สร้างข้อมูลธุรกรรมแบบไดนามิก
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      const transactions = []
      const customers = [
        'สมชาย ใจดี', 'สมหญิง รักดี', 'นายบุญ ดีใจ', 'นางสาววิมล สุขใส', 
        'คุณรัตน์ เก่งมาก', 'นายจิรา มั่นใจ', 'คุณปภา สดใส', 'นายสมศักดิ์ รุ่งเรือง',
        'คุณนันท์ ใสใส', 'นางอุมา ดีงาม', 'คุณปรีชา ฉลาด', 'นายวิชัย มั่นคง'
      ]
      const items = [
        { sku: 'P001', name: 'ข้าวผัดกุ้ง', price: 300 },
        { sku: 'P002', name: 'ต้มยำกุ้ง', price: 400 },
        { sku: 'P003', name: 'ผัดไทย', price: 280 },
        { sku: 'P004', name: 'สมตำ', price: 120 },
        { sku: 'P005', name: 'ข้าวผัดหมู', price: 250 },
        { sku: 'P006', name: 'แกงเขียวหวาน', price: 320 },
        { sku: 'P007', name: 'ลาบหมู', price: 180 },
        { sku: 'P008', name: 'ข้าวผัดสับปะรด', price: 350 },
        { sku: 'D001', name: 'น้ำส้ม', price: 60 },
        { sku: 'D002', name: 'ชาไทย', price: 80 },
        { sku: 'D003', name: 'กาแฟเย็น', price: 90 },
        { sku: 'D004', name: 'น้ำมะนาว', price: 50 },
        { sku: 'S001', name: 'ไอศกรีมกะทิ', price: 70 },
        { sku: 'S002', name: 'ข้าวเหนียวมะม่วง', price: 150 }
      ]
      
      const numberOfTransactions = Math.min(diffDays * (3 + Math.floor(Math.random() * 2)), 100) // สูงสุด 100 รายการ
      
      for (let i = 0; i < numberOfTransactions; i++) {
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
        const customer = customers[Math.floor(Math.random() * customers.length)]
        const numItems = 1 + Math.floor(Math.random() * 3)
        const transactionItems = []
        let totalAmount = 0
        
        for (let j = 0; j < numItems; j++) {
          const item = items[Math.floor(Math.random() * items.length)]
          const quantity = 1 + Math.floor(Math.random() * 2)
          transactionItems.push({
            sku: item.sku,
            name: item.name,
            quantity,
            price: item.price
          })
          totalAmount += item.price * quantity
        }
        
        const statuses = ['completed', 'completed', 'completed', 'completed', 'pending', 'cancelled'] // 66% completed, 17% pending, 17% cancelled
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        
        transactions.push({
          id: `ORD-${String(i + 1).padStart(3, '0')}`,
          customerName: customer,
          customerEmail: `${customer.split(' ')[0].toLowerCase()}@email.com`,
          orderDate: randomDate.toISOString(),
          items: transactionItems,
          totalAmount,
          status
        })
      }
      
      // เรียงลำดับตามวันที่ใหม่สุดก่อน
      transactions.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      
      return transactions
    }
    
    const response = await fetch(`${baseURL}/transactions?startDate=${startDate}&endDate=${endDate}`)
    if (!response.ok) throw new Error('Failed to fetch transactions')
    const result = await response.json()
    return result.data
  }

  // ===== PRODUCT SALES API =====

  const getProductSales = async (startDate: string, endDate: string): Promise<ProductSales[]> => {
    if (useMockData) {
      await new Promise(resolve => setTimeout(resolve, 200))
      const dynamicData = generateDynamicData(startDate, endDate)
      return dynamicData.topProducts.map((product: any) => ({
        sku: product.id,
        name: product.name,
        quantitySold: product.quantity,
        totalSales: product.totalSales
      }))
    }
    
    const response = await fetch(`${baseURL}/products/sales?startDate=${startDate}&endDate=${endDate}`)
    if (!response.ok) throw new Error('Failed to fetch product sales')
    const result = await response.json()
    return result.data
  }

  // ===== CATEGORY SALES API =====

  const getCategorySales = async (startDate: string, endDate: string): Promise<CategorySales[]> => {
    if (useMockData) {
      await new Promise(resolve => setTimeout(resolve, 200))
      const dynamicData = generateDynamicData(startDate, endDate)
      return dynamicData.salesByCategory.map((category: any) => ({
        category: category.name,
        totalSales: category.totalSales
      }))
    }
    
    const response = await fetch(`${baseURL}/categories/sales?startDate=${startDate}&endDate=${endDate}`)
    if (!response.ok) throw new Error('Failed to fetch category sales')
    const result = await response.json()
    return result.data
  }

  // ===== RETURN API FUNCTIONS =====

  return {
    getReportSummary,
    getTransactions,
    getProductSales,
    getCategorySales
  }
}
