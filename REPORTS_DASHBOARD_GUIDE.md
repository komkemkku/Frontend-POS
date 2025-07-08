# หน้ารายงานสรุปผล (Reports Dashboard)

## 📋 ภาพรวม

หน้ารายงานสรุปผลที่สร้างขึ้นนี้เป็นระบบ Dashboard ที่ครบครันสำหรับการติดตามและวิเคราะห์ประสิทธิภาพการขายของธุรกิจร้านอาหาร โดยมีความสามารถในการ:

- ✅ แสดงผล KPI (Key Performance Indicators) ที่สำคัญ
- ✅ กรองข้อมูลตามช่วงเวลาที่เลือก
- ✅ แสดงรายการขายล่าสุด
- ✅ ส่งออกรายงานเป็นไฟล์ Excel (.xlsx)
- ✅ ใช้ข้อมูลจำลองสำหรับทดสอบ

## 🎯 ฟีเจอร์หลัก

### 1. **KPI Cards**
แสดงตัวชี้วัดสำคัญ 4 ตัว:
- **ยอดขายรวม**: ยอดขายทั้งหมดในช่วงเวลาที่เลือก
- **จำนวนออเดอร์**: จำนวนคำสั่งซื้อทั้งหมด
- **ลูกค้าใหม่**: จำนวนลูกค้าใหม่ที่เข้ามาในช่วงเวลาที่เลือก
- **มูลค่าเฉลี่ยต่อออเดอร์**: ค่าเฉลี่ยของยอดขายต่อคำสั่งซื้อ

### 2. **Date Range Filter**
- เลือกช่วงเวลาด้วย Date Picker
- ปุ่มลัด: วันนี้, สัปดาห์นี้, เดือนนี้, เดือนที่แล้ว
- อัพเดทข้อมูลแบบ Real-time เมื่อเปลี่ยนวันที่

### 3. **Transaction Table**
- แสดงรายการขายล่าสุด
- คอลัมน์: ID, ชื่อลูกค้า, วันที่, ยอดรวม, สถานะ
- Status Badge พร้อมสีที่แตกต่างกัน

### 4. **Excel Export**
ส่งออกรายงาน 4 ชีต:
- **ชีต 1**: สรุปภาพรวม (KPI)
- **ชีต 2**: รายการขายทั้งหมด
- **ชีต 3**: ยอดขายตามสินค้า
- **ชีต 4**: ยอดขายตามหมวดหมู่

## 🗂️ โครงสร้างไฟล์

```
Frontend-POS/
├── src/
│   ├── views/reports/
│   │   └── ReportsViewNew.vue          # หน้าหลัก
│   └── data/
│       └── mockReportsData.js          # ข้อมูลจำลอง
├── components/reports/
│   ├── KpiCards.vue                    # การ์ด KPI
│   ├── DateRangePicker.vue             # เลือกช่วงเวลา
│   └── TransactionTable.vue            # ตารางรายการขาย
├── composables/
│   └── useReportsAPI.ts                # API calls
└── utils/
    └── excelExport.ts                  # ส่งออก Excel
```

## 🚀 การใช้งาน

### 1. **เข้าถึงหน้ารายงาน**
```
http://localhost:3000/reports
```

### 2. **การเปลี่ยนจากข้อมูลจำลองเป็น API จริง**
ใน `composables/useReportsAPI.ts` เปลี่ยนค่า:
```javascript
const useMockData = false // เปลี่ยนจาก true เป็น false
```

### 3. **API Endpoints ที่ Backend ต้องจัดทำ**
```
GET /api/reports/summary?startDate=2025-01-01&endDate=2025-01-31
GET /api/reports/transactions?startDate=2025-01-01&endDate=2025-01-31
GET /api/reports/products?startDate=2025-01-01&endDate=2025-01-31
GET /api/reports/categories?startDate=2025-01-01&endDate=2025-01-31
```

## 📊 รูปแบบข้อมูล API

### Report Summary Response
```json
{
  "data": {
    "totalSales": 1250000,
    "totalOrders": 150,
    "newCustomers": 25,
    "averageOrderValue": 8333,
    "salesByDay": [
      { "date": "2025-01-01", "sales": 45000 }
    ]
  }
}
```

### Transactions Response
```json
{
  "data": [
    {
      "id": "ORD-001",
      "customerName": "สมชาย ใจดี",
      "customerEmail": "somchai@email.com",
      "orderDate": "2025-01-09T12:30:00Z",
      "items": [
        { "sku": "P001", "name": "ข้าวผัดกุ้ง", "quantity": 2, "price": 300 }
      ],
      "totalAmount": 720,
      "status": "completed"
    }
  ]
}
```

## 🛠️ การปรับแต่ง

### 1. **เปลี่ยนสีธีม**
ใน Tailwind CSS classes:
- `bg-blue-600` → `bg-green-600` (เปลี่ยนสีหลัก)
- `text-blue-600` → `text-green-600`

### 2. **เพิ่ม KPI ใหม่**
แก้ไขใน `KpiCards.vue` และเพิ่มข้อมูลใน API response

### 3. **ปรับแต่งการส่งออก Excel**
แก้ไขใน `utils/excelExport.ts` เพื่อเพิ่มชีตหรือข้อมูลใหม่

## 🔧 Dependencies

```json
{
  "xlsx": "^0.18.5",
  "@headlessui/vue": "^1.7.0",
  "@heroicons/vue": "^2.0.0",
  "chart.js": "^4.4.0",
  "vue-chartjs": "^5.3.0"
}
```

## 📝 หมายเหตุ

1. **ข้อมูลจำลอง**: ปัจจุบันใช้ข้อมูลจำลองสำหรับทดสอบ
2. **การเชื่อมต่อ API**: ต้องปรับแต่งใน `useReportsAPI.ts`
3. **การปรับแต่งรูปแบบ**: ใช้ Tailwind CSS
4. **ภาษา**: รองรับภาษาไทยในการแสดงผลและส่งออก Excel

---

✨ **หน้ารายงานพร้อมใช้งาน!** สามารถทดสอบได้ทันทีด้วยข้อมูลจำลอง และเมื่อ Backend พร้อมแล้วก็สามารถเปลี่ยนไปใช้ข้อมูลจริงได้ง่ายๆ
