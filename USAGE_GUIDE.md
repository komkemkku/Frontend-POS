# 📋 คู่มือการใช้งานระบบ POS ร้านอาหาร

## 🎯 สำหรับพนักงาน/แอดมิน

### 1. เข้าสู่ระบบ
1. เปิดเว็บไซต์ → จะเข้าสู่หน้าเข้าสู่ระบบโดยอัตโนมัติ
2. กรอก username และ password
3. กด "เข้าสู่ระบบ"

### 2. สร้าง QR Code สำหรับลูกค้า
1. ไปที่เมนู "QR Code สำหรับลูกค้า"
2. เลือกโต๊ะที่ต้องการสร้าง QR Code
3. กด "พิมพ์ QR Code" เพื่อพิมพ์
4. วาง QR Code บนโต๊ะลูกค้า

### 3. จัดการเมนู
1. ไปที่ "จัดการเมนู"
2. เพิ่ม/แก้ไข/ลบเมนูอาหาร
3. ตั้งราคาและหมวดหมู่

### 4. จัดการโต๊ะ
1. ไปที่ "จัดการโต๊ะ"
2. เพิ่ม/แก้ไข/ลบโต๊ะ
3. ตั้งสถานะโต๊ะ (ว่าง/มีลูกค้า/จอง)

## 🍽️ สำหรับลูกค้า

### 1. เข้าสู่เมนู
1. สแกน QR Code ที่วางบนโต๊ะ
2. เข้าสู่เมนูอัตโนมัติ (ไม่ต้องเข้าสู่ระบบ)
3. ระบบจะรู้โต๊ะที่คุณนั่งอยู่อัตโนมัติ

### 2. สั่งอาหาร
1. เลือกหมวดหมู่อาหาร
2. เลือกเมนูที่ต้องการ
3. กด "เพิ่มลงตะกร้า"
4. ปรับจำนวนในตะกร้า
5. กด "สั่งอาหาร"

### 3. ดูประวัติการสั่ง
1. กด "ประวัติการสั่ง" ที่มุมบนขวา
2. ดูรายการที่สั่งไปแล้วในวันนั้น
3. ดูสถานะการเตรียมอาหาร

## 🔧 URLs สำคัญ

### สำหรับพนักงาน/แอดมิน
- หน้าแรก: `http://localhost:5173/`
- เข้าสู่ระบบ: `http://localhost:5173/login`
- แดชบอร์ด: `http://localhost:5173/dashboard`
- จัดการเมนู: `http://localhost:5173/admin/menus`
- จัดการโต๊ะ: `http://localhost:5173/admin/tables`
- QR Code: `http://localhost:5173/admin/qrcode`

### สำหรับลูกค้า (ตัวอย่าง)
- โต๊ะ 1: `http://localhost:5173/customer/table/1`
- โต๊ะ 2: `http://localhost:5173/customer/table/2`
- โต๊ะ A: `http://localhost:5173/customer/table/A`

## 🚨 หมายเหตุสำคัญ

1. **ลูกค้าต้องเข้าผ่าน QR Code เท่านั้น** - ไม่มีหน้าลูกค้าแยก
2. **พนักงานต้องเข้าสู่ระบบ** - เพื่อความปลอดภัย
3. **QR Code ระบุโต๊ะอัตโนมัติ** - ลูกค้าไม่ต้องเลือกโต๊ะ
4. **ประวัติการสั่งรายวัน** - แสดงเฉพาะคำสั่งซื้อของวันนั้น

## 💡 Tips การใช้งาน

1. **พิมพ์ QR Code ทุกโต๊ะ** - เพื่อความสะดวกของลูกค้า
2. **ติดบอร์ดหรือลามิเนต** - เพื่อความทนทาน
3. **ตรวจสอบการเชื่อมต่อ** - ให้แน่ใจว่าลูกค้าเข้าถึงได้
4. **อัปเดตเมนูสม่ำเสมอ** - ให้ข้อมูลเป็นปัจจุบัน
