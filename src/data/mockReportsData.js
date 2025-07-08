// ข้อมูลจำลองสำหรับการทดสอบ (ใช้ก่อนที่ Backend จะพร้อม)
export const mockReportData = {
  totalSales: 1250000,
  totalOrders: 150,
  newCustomers: 25,
  averageOrderValue: 8333,
  salesByDay: [
    { date: '01/01', sales: 45000, orders: 15, customers: 12 },
    { date: '01/02', sales: 52000, orders: 18, customers: 15 },
    { date: '01/03', sales: 48000, orders: 16, customers: 13 },
    { date: '01/04', sales: 61000, orders: 22, customers: 18 },
    { date: '01/05', sales: 55000, orders: 19, customers: 16 },
    { date: '01/06', sales: 58000, orders: 20, customers: 17 },
    { date: '01/07', sales: 63000, orders: 23, customers: 19 },
    { date: '01/08', sales: 59000, orders: 21, customers: 18 },
    { date: '01/09', sales: 67000, orders: 25, customers: 21 }
  ],
  salesChartData: [
    { date: '01/01', value: 45000 },
    { date: '01/02', value: 52000 },
    { date: '01/03', value: 48000 },
    { date: '01/04', value: 61000 },
    { date: '01/05', value: 55000 },
    { date: '01/06', value: 58000 },
    { date: '01/07', value: 63000 },
    { date: '01/08', value: 59000 },
    { date: '01/09', value: 67000 }
  ],
  ordersChartData: [
    { date: '01/01', value: 15 },
    { date: '01/02', value: 18 },
    { date: '01/03', value: 16 },
    { date: '01/04', value: 22 },
    { date: '01/05', value: 19 },
    { date: '01/06', value: 20 },
    { date: '01/07', value: 23 },
    { date: '01/08', value: 21 },
    { date: '01/09', value: 25 }
  ],
  customersChartData: [
    { date: '01/01', value: 12 },
    { date: '01/02', value: 15 },
    { date: '01/03', value: 13 },
    { date: '01/04', value: 18 },
    { date: '01/05', value: 16 },
    { date: '01/06', value: 17 },
    { date: '01/07', value: 19 },
    { date: '01/08', value: 18 },
    { date: '01/09', value: 21 }
  ],
  topProducts: [
    { id: 'P001', name: 'ข้าวผัดกุ้ง', quantity: 45, totalSales: 13500 },
    { id: 'P002', name: 'ต้มยำกุ้ง', quantity: 32, totalSales: 12800 },
    { id: 'P003', name: 'ผัดไทย', quantity: 38, totalSales: 11400 },
    { id: 'P004', name: 'สมตำ', quantity: 28, totalSales: 8400 },
    { id: 'P005', name: 'ข้าวผัดหมู', quantity: 35, totalSales: 10500 }
  ],
  salesByCategory: [
    { name: 'อาหารจานหลัก', totalSales: 650000, quantity: 450 },
    { name: 'เครื่องดื่ม', totalSales: 350000, quantity: 580 },
    { name: 'ของหวาน', totalSales: 250000, quantity: 320 },
    { name: 'ของทานเล่น', totalSales: 180000, quantity: 250 },
    { name: 'อื่นๆ', totalSales: 120000, quantity: 180 }
  ],
  peakHours: [
    { time: '11:00-12:00', orders: 25, percentage: 85 },
    { time: '12:00-13:00', orders: 35, percentage: 100 },
    { time: '18:00-19:00', orders: 30, percentage: 95 },
    { time: '19:00-20:00', orders: 28, percentage: 80 }
  ],
  customerInsights: {
    newCustomers: 35,
    returningCustomers: 65,
    averageOrderValue: 8333
  },
  revenueTrends: {
    monthlyGrowth: 12.5,
    weeklyGrowth: 8.2,
    monthlyTarget: 1500000,
    targetProgress: 83
  }
}

export const mockTransactions = [
  {
    id: 'ORD-001',
    customerName: 'สมชาย ใจดี',
    customerEmail: 'somchai@email.com',
    orderDate: '2025-01-09T12:30:00Z',
    items: [
      { sku: 'P001', name: 'ข้าวผัดกุ้ง', quantity: 2, price: 300 },
      { sku: 'D001', name: 'น้ำส้ม', quantity: 2, price: 60 }
    ],
    totalAmount: 720,
    status: 'completed'
  },
  {
    id: 'ORD-002',
    customerName: 'สมหญิง รักดี',
    customerEmail: 'somying@email.com',
    orderDate: '2025-01-09T11:45:00Z',
    items: [
      { sku: 'P002', name: 'ต้มยำกุ้ง', quantity: 1, price: 400 }
    ],
    totalAmount: 400,
    status: 'pending'
  },
  {
    id: 'ORD-003',
    customerName: 'วิชัย สมบูรณ์',
    customerEmail: 'wichai@email.com',
    orderDate: '2025-01-09T10:15:00Z',
    items: [
      { sku: 'P003', name: 'ผัดไทย', quantity: 1, price: 300 },
      { sku: 'D002', name: 'ชาไทย', quantity: 1, price: 80 }
    ],
    totalAmount: 380,
    status: 'completed'
  }
]

export const mockProductSales = [
  { sku: 'P001', name: 'ข้าวผัดกุ้ง', quantitySold: 45, totalSales: 13500 },
  { sku: 'P002', name: 'ต้มยำกุ้ง', quantitySold: 32, totalSales: 12800 },
  { sku: 'P003', name: 'ผัดไทย', quantitySold: 38, totalSales: 11400 },
  { sku: 'D001', name: 'น้ำส้ม', quantitySold: 65, totalSales: 3900 },
  { sku: 'D002', name: 'ชาไทย', quantitySold: 42, totalSales: 3360 }
]

export const mockCategorySales = [
  { category: 'อาหารจานหลัก', totalSales: 650000 },
  { category: 'เครื่องดื่ม', totalSales: 350000 },
  { category: 'ของหวาน', totalSales: 250000 }
]
