# Dashboard API Requirements

## สำหรับหน้า Dashboard ที่ปรับปรุงแล้ว

### API Endpoint ที่ต้องการ: `GET /summary`

ข้อมูลที่ควรส่งกลับมาจาก API `/summary` สำหรับแสดงใน Dashboard:

```json
{
  "status": "success",
  "data": {
    // สถิติโต๊ะ
    "total_tables": 20,
    "occupied_tables": 12,
    "available_tables": 6,
    "reserved_tables": 2,
    "maintenance_tables": 0,
    
    // สถิติออเดอร์วันนี้
    "today_orders": 45,
    "today_revenue": 12500.50,
    "pending_orders": 8,
    "completed_orders": 35,
    "cancelled_orders": 2,
    
    // สถิติเมนู
    "total_menu_items": 120,
    "available_menu_items": 115,
    "unavailable_menu_items": 5,
    
    // สถิติพนักงาน (เพิ่มเติม)
    "total_staff": 12,
    "active_staff": 8,
    
    // ข้อมูลช่วงเวลา Peak Hour (เพิ่มเติม)
    "peak_hour_info": {
      "current_hour": 12,
      "is_peak_hour": true,
      "avg_orders_per_hour": 6.5
    },
    
    // สรุปการชำระเงิน (เพิ่มเติม)
    "payment_summary": {
      "cash_payments": 8500.00,
      "card_payments": 4000.50,
      "online_payments": 0.00
    },
    
    // เมนูที่นิยม (เพิ่มเติม)
    "popular_items": [
      {
        "menu_id": 1,
        "name": "ผัดไทย",
        "orders_count": 12,
        "revenue": 1440.00
      },
      {
        "menu_id": 5,
        "name": "ต้มยำกุ้ง",
        "orders_count": 8,
        "revenue": 1440.00
      }
    ]
  }
}
```

### การทำงานของ Frontend

1. **หากมี API `/summary`**: จะใช้ข้อมูลจาก API
2. **หากไม่มี API**: จะคำนวณจากข้อมูลที่ดึงมาจาก API อื่นๆ (tables, orders, menu)

### ข้อมูลพื้นฐานที่จำเป็น (มีอยู่แล้ว)

- `GET /tables` - ข้อมูลโต๊ะทั้งหมด
- `GET /orders` - ข้อมูลออเดอร์ทั้งหมด
- `GET /menu` - ข้อมูลเมนูทั้งหมด
- `GET /staff/info` - ข้อมูลผู้ใช้ปัจจุบัน

### การอัปเดตข้อมูล

- ข้อมูลจะถูกรีเฟรชทุก 30 วินาทีอัตโนมัติ
- ผู้ใช้สามารถกดปุ่มรีเฟรชได้ด้วยตนเอง

### การแจ้งเตือน

Dashboard จะแสดงการแจ้งเตือนในกรณี:
- มีออเดอร์รอดำเนินการ
- โต๊ะเต็มทั้งหมด
- มีเมนูที่ไม่พร้อมขาย

### สีและธีม

- หลัก: สีขาว (#ffffff) และน้ำเงิน (#3b82f6)
- สำเร็จ: เขียว (#10b981)
- เตือน: เหลือง (#f59e0b)  
- อันตราย: แดง (#ef4444)
- ข้อมูล: น้ำเงิน (#3b82f6)
