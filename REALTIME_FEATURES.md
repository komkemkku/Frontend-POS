# Real-time Order Management System

## ฟีเจอร์ที่ได้เพิ่มเข้าไป

### 🔄 Real-time Updates
- **WebSocket Connection**: เชื่อมต่อกับเซิร์ฟเวอร์แบบ real-time
- **Auto-refresh**: อัปเดตข้อมูลออเดอร์อัตโนมัติ
- **Connection Status**: แสดงสถานะการเชื่อมต่อแบบ real-time
- **Fallback Polling**: ใช้ polling เป็น backup เมื่อ WebSocket ไม่พร้อมใช้งาน

### 📊 Real-time Order Events
- **Order Created**: แจ้งเตือนเมื่อมีออเดอร์ใหม่
- **Order Updated**: อัปเดตข้อมูลออเดอร์แบบ real-time
- **Status Changes**: เปลี่ยนสถานะออเดอร์ทันที
- **Payment Updates**: อัปเดตสถานะการชำระเงิน
- **Order Deletion**: แจ้งเตือนเมื่อมีการลบออเดอร์

### 🔔 Notification System
- **Toast Notifications**: แจ้งเตือนแบบ popup
- **Progress Indicators**: แสดงความคืบหน้าของการแจ้งเตือน
- **Auto-dismiss**: ปิดการแจ้งเตือนอัตโนมัติ
- **Multiple Types**: success, info, warning, error

### 📈 Real-time Statistics
- **Live Order Count**: จำนวนออเดอร์แบบ real-time
- **Revenue Tracking**: ติดตามยอดขายทันที
- **Status Distribution**: แสดงจำนวนออเดอร์ในแต่ละสถานะ
- **Average Order Value**: คำนวณค่าเฉลี่ยออเดอร์

## การใช้งาน

### 1. Connection Status
- **เขียว + กะพริบ**: เชื่อมต่อแล้ว
- **เหลือง + กะพริบ**: กำลังเชื่อมต่อ
- **แดง**: ไม่ได้เชื่อมต่อ
- **เทา**: ไม่ทราบสถานะ

### 2. Auto-refresh Indicator
- **จุดน้ำเงินกะพริบ**: ระบบ polling ทำงานอยู่
- **Update Counter**: แสดงจำนวนครั้งที่อัปเดต
- **Last Update Time**: เวลาอัปเดตล่าสุด

### 3. Real-time Notifications
- แจ้งเตือนเมื่อมีออเดอร์ใหม่
- แจ้งเตือนเมื่อเปลี่ยนสถานะ
- แจ้งเตือนเมื่ออัปเดตการชำระเงิน
- แจ้งเตือนเมื่อลบออเดอร์

## การทำงานของระบบ

### WebSocket Events
```typescript
// เหตุการณ์ที่รอรับจาก WebSocket
- order_created: ออเดอร์ใหม่ถูกสร้าง
- order_updated: ข้อมูลออเดอร์ถูกอัปเดต
- order_status_changed: สถานะออเดอร์เปลี่ยน
- payment_updated: การชำระเงินถูกอัปเดต
- order_deleted: ออเดอร์ถูกลบ
- stats_updated: สถิติถูกอัปเดต
```

### Fallback System
1. **Primary**: WebSocket connection
2. **Fallback**: HTTP polling ทุก 30 วินาที
3. **Manual**: ปุ่มรีเฟรชด้วยตนเอง

### Data Flow
```
WebSocket Server → WebSocket Service → Composables → Components → UI Updates
                                   ↓
                              Event Listeners → Notifications
```

## ข้อดีของระบบ Real-time

1. **ข้อมูลทันสมัย**: ข้อมูลอัปเดตทันทีไม่ต้องรอ
2. **ประสบการณ์ผู้ใช้ดี**: ไม่ต้องกดรีเฟรชเอง
3. **การทำงานร่วมกัน**: หลายคนใช้งานพร้อมกันได้
4. **แจ้งเตือนทันที**: รู้เหตุการณ์สำคัญทันที
5. **ความน่าเชื่อถือ**: มีระบบ fallback

## การตั้งค่า

### Environment Variables
```env
VITE_WEBSOCKET_URL=ws://localhost:8080/ws
VITE_API_URL=http://localhost:8080/api/v1
```

### WebSocket Server Configuration
```go
// Backend configuration needed
- WebSocket endpoint: /ws
- CORS settings
- Authentication
- Event broadcasting
```

## การ Debug

### Console Logs
- WebSocket connection events
- Real-time data updates
- Error messages
- Performance metrics

### Developer Tools
- Network tab สำหรับ WebSocket
- Console สำหรับ logs
- Vue DevTools สำหรับ state

## การปรับแต่ง

### Notification Duration
```typescript
// ใน NotificationToast.vue
duration: 5000 // 5 วินาที (ปรับได้)
```

### Polling Interval
```typescript
// ใน OrdersView.vue
30000 // 30 วินาที (ปรับได้)
```

### Reconnection Settings
```typescript
// ใน websocket.service.ts
maxReconnectAttempts: 5
reconnectInterval: 5000
```
