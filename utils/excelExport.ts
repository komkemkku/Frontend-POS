import * as XLSX from 'xlsx'

export const exportToExcel = (data: any, startDate: string, endDate: string) => {
  const workbook = XLSX.utils.book_new()

  // ชีตที่ 1: สรุปภาพรวม
  const summaryData = [
    ['ตัวชี้วัด', 'ค่า'],
    ['ยอดขายรวม (บาท)', data.summary.totalSales.toLocaleString()],
    ['จำนวนออเดอร์', data.summary.totalOrders.toLocaleString()],
    ['ลูกค้าใหม่', data.summary.newCustomers.toLocaleString()],
    ['มูลค่าเฉลี่ยต่อออเดอร์ (บาท)', data.summary.averageOrderValue.toLocaleString()]
  ]
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'สรุปภาพรวม')

  // ชีตที่ 2: รายการขายทั้งหมด
  const transactionHeaders = [
    'ID คำสั่งซื้อ',
    'ชื่อลูกค้า',
    'อีเมลลูกค้า',
    'วันที่สั่งซื้อ',
    'รายการสินค้า',
    'ยอดรวม (บาท)',
    'สถานะ'
  ]
  
  const transactionData = data.transactions.map(transaction => [
    transaction.id,
    transaction.customerName,
    transaction.customerEmail,
    new Date(transaction.orderDate).toLocaleDateString('th-TH'),
    transaction.items?.map(item => `${item.name} (${item.quantity})`).join(', ') || '',
    transaction.totalAmount.toLocaleString(),
    transaction.status
  ])
  
  const transactionSheet = XLSX.utils.aoa_to_sheet([transactionHeaders, ...transactionData])
  XLSX.utils.book_append_sheet(workbook, transactionSheet, 'รายการขายทั้งหมด')

  // ชีตที่ 3: ยอดขายตามสินค้า
  const productHeaders = [
    'รหัสสินค้า (SKU)',
    'ชื่อสินค้า',
    'จำนวนที่ขายได้',
    'ยอดขายรวม (บาท)'
  ]
  
  const productData = data.productSales.map(product => [
    product.sku,
    product.name,
    product.quantitySold.toLocaleString(),
    product.totalSales.toLocaleString()
  ])
  
  const productSheet = XLSX.utils.aoa_to_sheet([productHeaders, ...productData])
  XLSX.utils.book_append_sheet(workbook, productSheet, 'ยอดขายตามสินค้า')

  // ชีตที่ 4: ยอดขายตามหมวดหมู่
  const categoryHeaders = [
    'ชื่อหมวดหมู่',
    'ยอดขายรวม (บาท)'
  ]
  
  const categoryData = data.categorySales.map(category => [
    category.category,
    category.totalSales.toLocaleString()
  ])
  
  const categorySheet = XLSX.utils.aoa_to_sheet([categoryHeaders, ...categoryData])
  XLSX.utils.book_append_sheet(workbook, categorySheet, 'ยอดขายตามหมวดหมู่')

  // ส่งออกไฟล์
  const fileName = `รายงานการขาย-${startDate}-${endDate}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(amount)
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// ฟังก์ชันส่งออกข้อมูล transaction ดิบที่มีรายละเอียดเป็นรายการ
export const exportTransactionDetails = (transactions: any[], startDate: string, endDate: string) => {
  const workbook = XLSX.utils.book_new()

  // ชีตที่ 1: ข้อมูลการขายรายละเอียด (แยกเป็นรายการสินค้า)
  const detailHeaders = [
    'ID ออเดอร์',
    'วันที่',
    'เวลา',
    'ชื่อลูกค้า',
    'อีเมลลูกค้า',
    'รหัสสินค้า',
    'ชื่อสินค้า',
    'จำนวน',
    'ราคาต่อหน่วย (บาท)',
    'ราคารวม (บาท)',
    'ยอดรวมออเดอร์ (บาท)',
    'สถานะ'
  ]

  const detailData = []
  transactions.forEach(transaction => {
    const orderDate = new Date(transaction.orderDate)
    const dateStr = orderDate.toLocaleDateString('th-TH')
    const timeStr = orderDate.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })

    if (transaction.items && transaction.items.length > 0) {
      transaction.items.forEach(item => {
        detailData.push([
          transaction.id,
          dateStr,
          timeStr,
          transaction.customerName,
          transaction.customerEmail,
          item.sku,
          item.name,
          item.quantity,
          item.price,
          item.quantity * item.price,
          transaction.totalAmount,
          transaction.status === 'completed' ? 'สำเร็จ' : 
          transaction.status === 'pending' ? 'รอดำเนินการ' : 'ยกเลิก'
        ])
      })
    } else {
      // ถ้าไม่มี items ให้แสดงข้อมูลระดับ order
      detailData.push([
        transaction.id,
        dateStr,
        timeStr,
        transaction.customerName,
        transaction.customerEmail,
        '-',
        '-',
        '-',
        '-',
        '-',
        transaction.totalAmount,
        transaction.status === 'completed' ? 'สำเร็จ' : 
        transaction.status === 'pending' ? 'รอดำเนินการ' : 'ยกเลิก'
      ])
    }
  })

  const detailSheet = XLSX.utils.aoa_to_sheet([detailHeaders, ...detailData])
  
  // ปรับความกว้างของคอลัมน์
  const colWidths = [
    { wch: 12 }, // ID ออเดอร์
    { wch: 12 }, // วันที่
    { wch: 8 },  // เวลา
    { wch: 15 }, // ชื่อลูกค้า
    { wch: 20 }, // อีเมลลูกค้า
    { wch: 10 }, // รหัสสินค้า
    { wch: 20 }, // ชื่อสินค้า
    { wch: 8 },  // จำนวน
    { wch: 12 }, // ราคาต่อหน่วย
    { wch: 12 }, // ราคารวม
    { wch: 15 }, // ยอดรวมออเดอร์
    { wch: 12 }  // สถานะ
  ]
  detailSheet['!cols'] = colWidths

  XLSX.utils.book_append_sheet(workbook, detailSheet, 'รายละเอียดการขาย')

  // ชีตที่ 2: สรุปยอดขายรายวัน
  const dailySummary = {}
  transactions.forEach(transaction => {
    const orderDate = new Date(transaction.orderDate)
    const dateStr = orderDate.toLocaleDateString('th-TH')
    
    if (!dailySummary[dateStr]) {
      dailySummary[dateStr] = {
        date: dateStr,
        totalSales: 0,
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        customers: new Set()
      }
    }
    
    dailySummary[dateStr].totalSales += transaction.totalAmount
    dailySummary[dateStr].totalOrders += 1
    dailySummary[dateStr].customers.add(transaction.customerEmail)
    
    if (transaction.status === 'completed') {
      dailySummary[dateStr].completedOrders += 1
    } else if (transaction.status === 'pending') {
      dailySummary[dateStr].pendingOrders += 1
    }
  })

  const dailyHeaders = [
    'วันที่',
    'ยอดขายรวม (บาท)',
    'จำนวนออเดอร์',
    'ออเดอร์สำเร็จ',
    'ออเดอร์รอดำเนินการ',
    'จำนวนลูกค้า',
    'ยอดเฉลี่ยต่อออเดอร์ (บาท)'
  ]

  const dailyData = Object.values(dailySummary)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(day => [
      day.date,
      day.totalSales.toLocaleString(),
      day.totalOrders,
      day.completedOrders,
      day.pendingOrders,
      day.customers.size,
      day.totalOrders > 0 ? Math.round(day.totalSales / day.totalOrders).toLocaleString() : 0
    ])

  const dailySheet = XLSX.utils.aoa_to_sheet([dailyHeaders, ...dailyData])
  XLSX.utils.book_append_sheet(workbook, dailySheet, 'สรุปรายวัน')

  // ชีตที่ 3: สรุปตามลูกค้า
  const customerSummary = {}
  transactions.forEach(transaction => {
    const customerKey = transaction.customerEmail
    
    if (!customerSummary[customerKey]) {
      customerSummary[customerKey] = {
        name: transaction.customerName,
        email: transaction.customerEmail,
        totalSpent: 0,
        totalOrders: 0,
        completedOrders: 0,
        lastOrderDate: transaction.orderDate
      }
    }
    
    customerSummary[customerKey].totalSpent += transaction.totalAmount
    customerSummary[customerKey].totalOrders += 1
    
    if (transaction.status === 'completed') {
      customerSummary[customerKey].completedOrders += 1
    }
    
    // เก็บวันที่ล่าสุด
    if (new Date(transaction.orderDate) > new Date(customerSummary[customerKey].lastOrderDate)) {
      customerSummary[customerKey].lastOrderDate = transaction.orderDate
    }
  })

  const customerHeaders = [
    'ชื่อลูกค้า',
    'อีเมล',
    'ยอดซื้อรวม (บาท)',
    'จำนวนออเดอร์',
    'ออเดอร์สำเร็จ',
    'ยอดเฉลี่ยต่อออเดอร์ (บาท)',
    'วันที่สั่งซื้อล่าสุด'
  ]

  const customerData = Object.values(customerSummary)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .map(customer => [
      customer.name,
      customer.email,
      customer.totalSpent.toLocaleString(),
      customer.totalOrders,
      customer.completedOrders,
      customer.totalOrders > 0 ? Math.round(customer.totalSpent / customer.totalOrders).toLocaleString() : 0,
      new Date(customer.lastOrderDate).toLocaleDateString('th-TH')
    ])

  const customerSheet = XLSX.utils.aoa_to_sheet([customerHeaders, ...customerData])
  XLSX.utils.book_append_sheet(workbook, customerSheet, 'สรุปตามลูกค้า')

  // ส่งออกไฟล์
  const fileName = `ข้อมูลการขายรายละเอียด-${startDate}-${endDate}.xlsx`
  XLSX.writeFile(workbook, fileName)
}

// ฟังก์ชันส่งออกข้อมูลเฉพาะรายการสินค้าที่ขายได้
export const exportProductSalesData = (transactions: any[], startDate: string, endDate: string) => {
  const workbook = XLSX.utils.book_new()

  // รวบรวมข้อมูลสินค้า
  const productSummary = {}
  
  transactions.forEach(transaction => {
    if (transaction.items && transaction.status === 'completed') {
      transaction.items.forEach(item => {
        const productKey = item.sku
        
        if (!productSummary[productKey]) {
          productSummary[productKey] = {
            sku: item.sku,
            name: item.name,
            totalQuantity: 0,
            totalRevenue: 0,
            orderCount: 0,
            avgPrice: item.price
          }
        }
        
        productSummary[productKey].totalQuantity += item.quantity
        productSummary[productKey].totalRevenue += (item.quantity * item.price)
        productSummary[productKey].orderCount += 1
      })
    }
  })

  const productHeaders = [
    'รหัสสินค้า',
    'ชื่อสินค้า',
    'จำนวนที่ขายได้',
    'ยอดขายรวม (บาท)',
    'จำนวนออเดอร์ที่มีสินค้านี้',
    'ราคาเฉลี่ย (บาท)',
    'สัดส่วนยอดขาย (%)'
  ]

  const totalRevenue = Object.values(productSummary).reduce((sum, product) => sum + product.totalRevenue, 0)
  
  const productData = Object.values(productSummary)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .map(product => [
      product.sku,
      product.name,
      product.totalQuantity,
      product.totalRevenue.toLocaleString(),
      product.orderCount,
      Math.round(product.avgPrice).toLocaleString(),
      totalRevenue > 0 ? ((product.totalRevenue / totalRevenue) * 100).toFixed(2) + '%' : '0%'
    ])

  const productSheet = XLSX.utils.aoa_to_sheet([productHeaders, ...productData])
  XLSX.utils.book_append_sheet(workbook, productSheet, 'ยอดขายตามสินค้า')

  // ส่งออกไฟล์
  const fileName = `ยอดขายสินค้า-${startDate}-${endDate}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
