# 🍽️ POS Frontend System

Modern Point of Sale (POS) Frontend built with React and Vite for restaurant management

## 🌟 Features

### 📊 Admin Dashboard
- Real-time sales analytics and reporting
- Order statistics with visual charts
- Revenue tracking and trends
- Daily/Monthly business insights

### � Order Management System
- Real-time order tracking with auto-refresh
- Order status flow: Pending → Preparing → Ready → Served → Completed
- Advanced filtering by status, table, and customer
- Detailed order items display with pricing
- Time tracking with relative timestamps
- Search functionality across orders

### 💳 Payment Processing
- Multiple payment methods: Cash, Credit Card, Bank Transfer, QR Code, E-Wallet
- Smart discount calculation
- Automatic change calculation for cash payments
- Digital receipt generation and printing
- Real-time payment status updates
- Integration with backend payment API

### 🎨 Modern UI/UX Design
- Clean white-blue professional color scheme
- Fully responsive design for all devices
- Modern card-based layouts with shadows
- Smooth animations and micro-interactions
- Intuitive navigation and user experience

### 👥 Customer Experience
- QR Code-based menu access (no login required)
- Real-time menu browsing
- Direct order placement from tables
- Order history tracking

## 🚀 Technology Stack

- **React 18** - Modern frontend framework
- **Vite** - Fast build tool and dev server
- **CSS3** - Advanced styling with flexbox/grid
- **Axios** - HTTP client for API integration
- **React Router** - Client-side routing
- **Context API** - Global state management

## 🛠️ Quick Start

```bash
# Clone the repository
git clone https://github.com/komkemkku/Frontend-POS.git
cd Frontend-POS

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Environment Configuration

Create `.env` file in root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=POS Restaurant System
```

## 📱 Deployment

Optimized for **Vercel** deployment:

```bash
# Deploy to production
vercel --prod
```

**Live Demo**: https://frontend-pos.vercel.app

## 🔗 Related Projects

- **Backend API**: [Backend-POS](https://github.com/komkemkku/Backend-POS) - Go Gin REST API

## 🎯 Application Routes

| Route | Description | Access |
|-------|-------------|---------|
| `/` | Dashboard & Analytics | Admin |
| `/orders` | Order Management | Admin |
| `/payment` | Payment Processing | Admin |
| `/menu` | Menu Management | Admin |
| `/staff` | Staff Management | Admin |
| `/tables` | Table Management | Admin |
| `/customer-menu` | Customer Menu (QR) | Public |

## 🏗️ Development

```bash
# Development mode with hot reload
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview

# Code linting
npm run lint
```

## 📱 Mobile Responsive

- **Desktop**: Full dashboard experience
- **Tablet**: Optimized admin interface
- **Mobile**: Touch-friendly customer menu

## 🔧 API Integration

Seamless integration with Go backend for:

- **Orders**: CRUD operations, status updates
- **Payments**: Transaction processing, receipts
- **Menu**: Items, categories, pricing
- **Staff**: Authentication, management
- **Tables**: QR generation, management
- **Analytics**: Sales data, reports

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones (#007bff family)
- **Secondary**: White and light grays
- **Success**: Green for completed actions
- **Warning**: Orange for pending states
- **Error**: Red for alerts

### Typography
- **Headers**: Clean, modern fonts
- **Body**: Readable, accessible text
- **Monospace**: For codes and numbers

## 🏆 Production Features

✅ **Performance Optimized**  
✅ **SEO Ready**  
✅ **PWA Capable**  
✅ **Error Boundaries**  
✅ **Loading States**  
✅ **Offline Support**  
✅ **Real-time Updates**  
✅ **Security Headers**  
✅ **API Error Handling**  
✅ **Responsive Design**  

---

**Built with ❤️ for modern restaurant operations**
- `/` - หน้าเข้าสู่ระบบ
- `/login` - หน้าเข้าสู่ระบบ
- `/dashboard` - แดชบอร์ดภาพรวมโต๊ะ
- `/admin/menus` - จัดการเมนู
- `/admin/tables` - จัดการโต๊ะ
- `/admin/qrcode` - จัดการ QR Code
- `/admin/staffs` - จัดการพนักงาน
- `/admin/reports` - รายงาน

### สำหรับลูกค้า (เข้าผ่าน QR Code)
- `/customer/table/:tableId` - เมนูสำหรับลูกค้า (ระบุโต๊ะ)

## 🎯 การเปลี่ยนแปลงสำคัญ

1. **หน้าแรกเป็นหน้าเข้าสู่ระบบ** - เพื่อความปลอดภัยและความเป็นระเบียบ
2. **ลูกค้าเข้าผ่าน QR Code เท่านั้น** - ไม่มีหน้าลูกค้าแยก
3. **พนักงานจัดการ QR Code** - สร้าง พิมพ์ และจัดการได้ง่าย
4. **ระบุโต๊ะอัตโนมัติ** - ลูกค้าไม่ต้องเลือกโต๊ะ
5. **ประวัติการสั่งรายวัน** - ลูกค้าดูประวัติการสั่งของโต๊ะได้

## 🔧 Technology Stack

- **Frontend**: React + Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **QR Code**: qrcode.react
- **Styling**: CSS3 + Flexbox/Grid
- **Icons**: Emoji + CSS
