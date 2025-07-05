# API Requirements สำหรับ Frontend POS

## ✅ API Endpoints ที่ใช้งานอยู่แล้ว

### 1. Tables API
- `GET /tables` - ดึงข้อมูลโต๊ะทั้งหมด ✅ (มีข้อมูลแล้ว)

### 2. Orders API  
- `GET /orders` - ดึงข้อมูลออเดอร์ทั้งหมด ✅ (มีข้อมูลแล้ว)

### 3. Menu Items API
- `GET /menu-items` - ดึงข้อมูลเมนูทั้งหมด ✅ (มีข้อมูลแล้ว)

## 🔄 API Endpoints ที่ Frontend กำลังเรียกใช้

### 4. Staff Info API
- `GET /staff/info` - ดึงข้อมูลพนักงานปัจจุบัน
- **สถานะ:** ✅ API endpoint พร้อมใช้งาน (r.GET("/staff/info", md, staff.GetInfoStaff))
- **ข้อมูลที่ต้องการ:**
```json
{
  "success": true,
  "data": {
    "full_name": "ชื่อเต็มของพนักงาน",
    "role": "ตำแหน่ง/บทบาท",
    "username": "username",
    "first_name": "ชื่อ",
    "last_name": "นามสกุล",
    "position": "ตำแหน่ง"
  }
}
```

### 5. Dashboard Summary API
- `GET /summary` หรือ `GET /dashboard/summary` - ดึงข้อมูลสรุปแดชบอร์ด
- **สถานะ:** Frontend ได้เรียกใช้แล้ว และมี fallback calculation
- **ข้อมูลที่ต้องการ:**
```json
{
  "success": true,
  "data": {
    "total_tables": 0,
    "occupied_tables": 0,
    "available_tables": 0,
    "reserved_tables": 0,
    "maintenance_tables": 0,
    "today_orders": 0,
    "today_revenue": 0,
    "pending_orders": 0,
    "completed_orders": 0,
    "total_menu_items": 0,
    "available_menu_items": 0
  }
}
```

## 📝 หมายเหตุสำหรับทีมหลังบ้าน

### สิ่งที่ Frontend ทำอยู่ในตอนนี้:
1. **ข้อมูล Tables, Orders, Menu Items:** ดึงจาก API จริงและแสดงผลได้ปกติ
2. **ข้อมูล Staff Info:** เรียก `/staff/info` และถ้าไม่มีข้อมูลจะใช้ fallback เป็น "คุณ Admin, ผู้จัดการ"
3. **ข้อมูล Summary:** เรียก `/summary` และถ้าไม่มีข้อมูลจะคำนวณจากข้อมูลที่มี

### สิ่งที่ต้องการให้ทีมหลังบ้านเพิ่ม:
1. **API `/staff/info`** - ✅ มี endpoint แล้ว (r.GET("/staff/info", md, staff.GetInfoStaff))
2. **API `/summary`** - เพื่อแสดงสถิติที่แม่นยำจากฐานข้อมูล

### โครงสร้าง Response ที่ Frontend รองรับ:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```
หรือ
```json
{ ... } // ข้อมูลโดยตรง
```

Frontend จะ handle ทั้งสองรูปแบบได้

## 🎯 สถานะปัจจุบัน
- ✅ **UI/UX:** เสร็จสมบูรณ์และสวยงาม
- ✅ **การแสดงข้อมูล:** ทำงานได้ปกติด้วย fallback data
### 🔄 **รอ API `/staff/info`:** ✅ มี endpoint แล้ว - รอ response data
- 🔄 **รอ API `/summary`:** เพื่อแสดงสถิติที่แม่นยำ

**URL Production ล่าสุด:** https://frontend-7t7jmbu4p-komkems-projects.vercel.app

---

## 🔄 สิ่งที่รอทีมหลังบ้าน:

1. **API `/summary`** - เพื่อแสดงสถิติแดชบอร์ดที่แม่นยำ:
   ```json
   {
     "success": true,
     "data": {
       "total_tables": 5,
       "occupied_tables": 2,
       "available_tables": 3,
       "reserved_tables": 0,
       "maintenance_tables": 0,
       "today_orders": 15,
       "today_revenue": 2350,
       "pending_orders": 3,
       "completed_orders": 12,
       "total_menu_items": 25,
       "available_menu_items": 22
     }
   }
   ```
