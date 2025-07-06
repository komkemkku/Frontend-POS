# วิธีการทดสอบระบบจัดการพนักงาน

## 🚀 การเริ่มต้น

### 1. ติดตั้ง Dependencies
```bash
cd Frontend-POS
npm install
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ในโฟลเดอร์ `Frontend-POS`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. เริ่มต้น Development Server
```bash
npm run dev
```

### 4. เข้าสู่หน้าจัดการพนักงาน
เปิดเบราว์เซอร์และไปที่:
```
http://localhost:3000/staff
```

## 🧪 การทดสอบ API

### 1. ทดสอบผ่านหน้าเว็บ
เปิด: `http://localhost:3000/staff-api-test.html`

### 2. ทดสอบด้วย curl

#### Get All Staff
```bash
curl -X GET "http://localhost:8080/api/staff" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### Create Staff
```bash
curl -X POST "http://localhost:8080/api/staff" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "password_hash": "password123",
    "full_name": "ผู้ทดสอบ ระบบ",
    "role": "cashier"
  }'
```

#### Update Staff
```bash
curl -X PUT "http://localhost:8080/api/staff/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "username": "test_user_updated",
    "full_name": "ผู้ทดสอบ ระบบ แก้ไขแล้ว",
    "role": "manager"
  }'
```

#### Delete Staff
```bash
curl -X DELETE "http://localhost:8080/api/staff/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 การทดสอบฟีเจอร์

### 1. การเพิ่มพนักงาน ✅
- [x] คลิกปุ่ม "เพิ่มพนักงาน"
- [x] กรอกข้อมูลครบถ้วน
- [x] เลือกตำแหน่ง
- [x] บันทึกสำเร็จ
- [x] แสดง toast notification

### 2. การแก้ไขพนักงาน ✅
- [x] คลิกไอคอน "แก้ไข"
- [x] แก้ไขข้อมูล
- [x] บันทึกการแก้ไข
- [x] อัพเดตในรายการ

### 3. การลบพนักงาน ✅
- [x] คลิกไอคอน "ลบ"
- [x] ยืนยันการลบ
- [x] ลบออกจากรายการ
- [x] แสดงข้อความยืนยัน

### 4. การค้นหา ✅
- [x] พิมพ์ในช่องค้นหา
- [x] ค้นหาจากชื่อ
- [x] ค้นหาจากชื่อผู้ใช้
- [x] ค้นหาจากตำแหน่ง

### 5. การแสดงผล ✅
- [x] แสดงรายการพนักงาน
- [x] Badge สีตามตำแหน่ง
- [x] วันที่สร้าง
- [x] Avatar initials

### 6. Pagination ✅
- [x] แสดงจำนวนรายการ
- [x] ปุ่มหน้าก่อน/หน้าถัดไป
- [x] แสดงหมายเลขหน้า

## 🐛 การแก้ไขปัญหา

### 1. CORS Error
หากเจอ CORS error ให้ตรวจสอบ backend config:
```go
// ใน main.go
r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{"http://localhost:3000"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    AllowCredentials: true,
}))
```

### 2. 401 Unauthorized
ตรวจสอบ token ใน localStorage:
```javascript
console.log(localStorage.getItem('auth_token'))
```

### 3. Network Error
ตรวจสอบ API base URL ใน `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. Empty Response
ตรวจสอบ response format ใน browser dev tools

## 📊 ข้อมูลตัวอย่างสำหรับทดสอบ

```json
{
  "admin": {
    "username": "admin",
    "password_hash": "admin123",
    "full_name": "ผู้ดูแลระบบ หลัก",
    "role": "admin"
  },
  "manager": {
    "username": "manager01",
    "password_hash": "manager123",
    "full_name": "สมชาย ใจดี",
    "role": "manager"
  },
  "cashier": {
    "username": "cashier01", 
    "password_hash": "cashier123",
    "full_name": "สมหญิง รักงาน",
    "role": "cashier"
  }
}
```

## 🎨 สีสันของ Role Badge

- 🔴 **Admin**: `text-red-600 bg-red-50`
- 🟣 **Manager**: `text-purple-600 bg-purple-50`
- 🔵 **Cashier**: `text-blue-600 bg-blue-50`
- 🟢 **Waiter**: `text-green-600 bg-green-50`
- 🟠 **Kitchen**: `text-orange-600 bg-orange-50`

## ✅ Checklist การทดสอบ

- [ ] Backend API running
- [ ] Frontend development server running
- [ ] Authentication working
- [ ] Staff list loading
- [ ] Create staff working
- [ ] Update staff working
- [ ] Delete staff working
- [ ] Search functionality
- [ ] Pagination working
- [ ] Error handling
- [ ] Loading states
- [ ] Success notifications
- [ ] Responsive design
- [ ] Role-based colors
