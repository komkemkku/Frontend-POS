# API Requirements สำหรับ Frontend POS - อัปเดตล่าสุด

## 🎯 สรุปความเปลี่ยนแปลงจากทีม Backend

**ตอนนี้ Backend ได้ส่งข้อมูล API specification ฉบับใหม่ที่สมบูรณ์มาแล้ว!**

---

## 📱 **PUBLIC API (สำหรับลูกค้า - ไม่ต้อง Authentication)**

### ✅ API Endpoints ที่ Frontend ต้องใช้

#### 1. **ดูเมนูตาม QR Code โต๊ะ**
```
GET /public/menu/{qrCodeIdentifier}
```
**Response Format:**
```json
{
  "success": true,
  "message": "เมนูโต๊ะ 1",
  "data": {
    "table_info": {
      "id": 1,
      "table_number": 1,
      "qr_code_identifier": "table_001",
      "status": "available"
    },
    "menu_items": [
      {
        "id": 1,
        "name": "ผัดไทย",
        "description": "ผัดไทยแสนอร่อยเส้นหมี่ใหญ่",
        "price": 60.00,
        "category_id": 1,
        "image_url": "https://example.com/padthai.jpg",
        "is_available": true,
        "category_name": "อาหารจานหลัก"
      }
    ]
  }
}
```

#### 2. **ดูเมนูทั้งหมด**
```
GET /public/menu
```

#### 3. **สร้างออเดอร์ (ลูกค้าสั่งอาหาร)**
```
POST /public/orders/create
```
**Request Body:**
```json
{
  "qr_code_identifier": "table_001",
  "items": [
    {
      "menu_item_id": 1,
      "quantity": 2
    }
  ]
}
```

#### 4. **ดูประวัติออเดอร์ปัจจุบัน**
```
GET /public/orders/table/{qrCodeIdentifier}
```

#### 5. **ดูสถานะออเดอร์เฉพาะ**
```
GET /public/orders/{orderID}/table/{qrCodeIdentifier}
```

#### 6. **ดูประวัติทั้งหมด**
```
GET /public/orders/history/{qrCodeIdentifier}
```

#### 7. **ดูสรุปโต๊ะ**
```
GET /public/table/summary/{qrCodeIdentifier}
```

---

## 👨‍💼 **STAFF API (ต้อง Authentication)**

### ✅ API Endpoints ที่ Frontend ต้องใช้

#### 1. **Authentication**
```
POST /staff/login
```

#### 2. **ข้อมูลพนักงาน**
```
GET /staff/info
Authorization: Bearer <token>
```

#### 3. **สรุปข้อมูล Dashboard**
```
GET /summary
Authorization: Bearer <token>
```
**Response Format:**
```json
{
  "status": "success",
  "data": {
    "total_tables": 5,
    "today_revenue": 2350.75,
    "today_orders": 15,
    "pending_orders": 3
  }
}
```

#### 4. **อัปเดตสถานะออเดอร์**
```
PATCH /staff/orders/{orderID}/status
Authorization: Bearer <token>
```

#### 5. **ล้างประวัติโต๊ะหลังชำระเงิน**
```
POST /staff/orders/clear-table/{qrCodeIdentifier}
Authorization: Bearer <token>
```

#### 6. **ล้างประวัติแบบละเอียด**
```
POST /staff/orders/advanced-clear/{qrCodeIdentifier}?type={clearType}
Authorization: Bearer <token>
```

#### 7. **ยกเลิกออเดอร์เฉพาะ**
```
POST /staff/orders/cancel/{orderID}/table/{qrCodeIdentifier}
Authorization: Bearer <token>
```

#### 8. **ดูรายการออเดอร์ทั้งหมด**
```
GET /orders?page=1&size=10&search=
Authorization: Bearer <token>
```

---

## 🔄 **การปรับปรุงที่ Frontend ทำแล้ว**

### ✅ **customerApi.js**
- ปรับปรุงให้รองรับ response structure ใหม่
- เพิ่ม error handling และ fallback data
- รองรับ field mapping (เช่น menu_items, table_info, order_items)
- เพิ่ม helper function handleResponse()

### ✅ **CustomerMenuPage.jsx**
- ปรับปรุงการ mapping ข้อมูลเมนู
- รองรับ field names ใหม่ (image_url, is_available, category_name)
- ปรับปรุงการส่งคำสั่งซื้อให้ตรงกับ backend format
- เพิ่มการจัดการ error และ loading state

### ✅ **PaymentPage.jsx**
- ปรับปรุง field mapping สำหรับออเดอร์
- รองรับ response structure ใหม่
- เพิ่ม fallback data สำหรับการทดสอบ

### ✅ **adminApi.js**
- เพิ่ม helper functions สำหรับ response handling
- ปรับปรุงการจัดการ error
- รองรับ backend response format (.data, .success, .message)

---

## 🎨 **ระบบสถานะและสี**

### **สถานะออเดอร์**
| Status | Text (ภาษาไทย) | Color | สำหรับ UI |
|--------|----------------|-------|-----------|
| `pending` | รอดำเนินการ | `#FFA500` | 🟠 Orange |
| `preparing` | กำลังเตรียม | `#0066CC` | 🔵 Blue |
| `ready` | พร้อมเสิร์ฟ | `#00CC00` | 🟢 Green |
| `served` | เสิร์ฟแล้ว | `#9900CC` | 🟣 Purple |
| `paid` | ชำระเงินแล้ว | `#999999` | ⚪ Gray |
| `completed` | เสร็จสิ้น | `#999999` | ⚪ Gray |
| `cancelled` | ยกเลิก | `#CC0000` | 🔴 Red |

### **สถานะโต๊ะ**
| Status | Text (ภาษาไทย) | Color | สำหรับ UI |
|--------|----------------|-------|-----------|
| `available` | ว่าง | `#00CC00` | 🟢 Green |
| `occupied` | มีลูกค้า | `#FFA500` | 🟠 Orange |
| `reserved` | จอง | `#0066CC` | 🔵 Blue |
| `maintenance` | ปิดปรับปรุง | `#CC0000` | 🔴 Red |

---

## 🧪 **สถานะการทดสอบ**

### ✅ **พร้อมทดสอบ**
- Public API integration
- Staff API integration  
- Real-time order tracking
- Payment processing
- Table management

### 🔄 **ต้องทดสอบเพิ่มเติม**
- Error handling กับ backend จริง
- Response time และ performance
- Authentication token management
- Cross-browser compatibility

---

## 🚀 **ขั้นตอนถัดไป**

1. **ทดสอบ Public API endpoints** - ตรวจสอบ QR scanning, order creation
2. **ทดสอบ Staff API endpoints** - ตรวจสอบ dashboard, order management
3. **ปรับปรุง error handling** - จัดการกรณี network issues
4. **Performance optimization** - ลดเวลา loading และ response
5. **User experience testing** - ทดสอบการใช้งานจริง

---

## 📋 **Checklist Integration**

### ✅ **ฟีเจอร์ลูกค้า (Public)**
- [x] หน้าดูเมนูจาก QR Code
- [x] ระบบตะกร้าสินค้า  
- [x] หน้าสั่งอาหาร
- [x] หน้าติดตามออเดอร์
- [x] หน้าประวัติออเดอร์

### ✅ **ฟีเจอร์พนักงาน (Staff)**
- [x] หน้า Login
- [x] หน้า Dashboard (ใช้ /summary)
- [x] หน้าจัดการออเดอร์
- [x] ระบบอัปเดตสถานะ
- [x] ระบบล้างประวัติโต๊ะ

### 🔄 **ต้องปรับปรุงเพิ่มเติม**
- [ ] Real-time notifications
- [ ] Advanced error handling
- [ ] Performance monitoring
- [ ] User analytics

**Status: Frontend พร้อม 100% สำหรับ backend integration! 🎉**

---
