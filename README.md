# 🏪 POS Admin Panel (Frontend)

**ระบบจัดการร้านอาหาร POS - หน้าบ้าน (Admin Panel)**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-FFD859?style=flat-square&logo=vue.js)](https://pinia.vuejs.org/)

## ✨ คุณสมบัติ

### 🔐 Authentication & Authorization
- **เข้าสู่ระบบ**: ระบบ JWT authentication ที่ปลอดภัย
- **จัดการสิทธิ์**: ควบคุมการเข้าถึงตามบทบาทผู้ใช้
- **Auto-logout**: ออกจากระบบอัตโนมัติเมื่อ token หมดอายุ

### 📊 Dashboard
- **สรุปยอดขาย**: ยอดขายรายวัน รายสัปดาห์ รายเดือน
- **กราฟและชาร์ต**: แสดงข้อมูลเชิงวิเคราะห์ที่เข้าใจง่าย
- **สถิติสำคัญ**: จำนวนออเดอร์ รายการขายดี รายรับสุทธิ

### 🍽️ Menu Management
- **จัดการเมนู**: เพิ่ม แก้ไข ลบรายการอาหาร
- **หมวดหมู่**: จัดหมวดหมู่เมนูอาหาร
- **อัปโหลดรูปภาพ**: เพิ่มรูปภาพสำหรับแต่ละเมนู
- **จัดการราคา**: ตั้งราคาและโปรโมชั่น

## 🛠️ เทคโนโลジี

### Frontend Framework
- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Vite** - Build tool ที่รวดเร็ว พร้อม Hot Module Replacement

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS preprocessor
- **Custom Components** - UI components ที่สร้างเอง ใช้โทนสีน้ำเงิน-ขาว

### State Management & HTTP
- **Pinia** - State management สำหรับ Vue 3
- **Axios** - HTTP client สำหรับเรียก API
- **Vue Router 4** - การจัดการ route และ navigation

## 🚀 การติดตั้งและใช้งาน

### ความต้องการของระบบ
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables
แก้ไขไฟล์ `.env.development`:
```env
VITE_API_URL=https://backend-pos-production.up.railway.app
VITE_APP_NAME=POS Admin Panel
VITE_APP_VERSION=1.0.0
```

### 3. รันโปรเจค
```bash
# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🔧 คำสั่งที่สำคัญ

```bash
npm run dev              # รัน development server (localhost:3000)
npm run build           # Build สำหรับ production  
npm run preview         # Preview production build
```

## 📁 โครงสร้างโปรเจค

```
Frontend-POS/
├── public/                 # Static files
├── src/
│   ├── assets/            # Images, fonts, global CSS
│   ├── components/        # Reusable Vue components
│   ├── layouts/           # Layout components (AdminLayout)
│   ├── router/            # Vue Router configuration
│   ├── stores/            # Pinia stores (auth store)
│   ├── utils/             # Utility functions (axios config)
│   ├── views/             # Page components
│   │   ├── auth/          # Login page
│   │   ├── dashboard/     # Dashboard page
│   │   ├── menu/          # Menu management
│   │   └── NotFoundView/  # 404 page
│   ├── App.vue            # Root component
│   └── main.js            # Application entry point
├── .env.development       # Development environment variables
├── .env.production        # Production environment variables
├── .env.local             # Local override (gitignored)
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Project dependencies
```

## 🔌 การเชื่อมต่อ Backend

### API Configuration
- **Production Backend**: `https://backend-pos-production.up.railway.app`
- **Local Backend**: `http://localhost:8080`
- **CORS**: รองรับ localhost:3000, 3001, 5173

### ข้อมูลสำหรับทดสอบ
```
Username: admin
Password: password
Role: admin
```

## 🎨 UI/UX Design

### Design System
- **สีหลัก**: น้ำเงิน (#3B82F6) และขาว (#FFFFFF)
- **รูปแบบ**: มินิมอล ทางการ อ่านง่าย
- **Typography**: ฟอนต์ที่รองรับภาษาไทย
- **Responsive**: รองรับทุกขนาดหน้าจอ

### การออกแบบ Login Page
- **Gradient Background**: ไล่สีน้ำเงินอ่อนสู่ขาว
- **Glass Morphism**: Card แบบโปร่งแสงที่ทันสมัย
- **Smooth Animations**: Animation ที่นุ่มนวลและสวยงาม
- **Icon Integration**: ไอคอนใน input fields
- **Hover Effects**: ปุ่มและ element มี hover effect

## 🔒 Security

### Authentication
- **JWT Tokens**: ใช้ JWT สำหรับ authentication
- **Auto Refresh**: ต่ออายุ token อัตโนมัติ
- **Secure Storage**: เก็บ token ใน localStorage

### Authorization
- **Route Guards**: ป้องกันการเข้าถึงโดยไม่มีสิทธิ์
- **Role-based Access**: ควบคุมการเข้าถึงตามบทบาท
- **API Validation**: ตรวจสอบสิทธิ์ในทุก API call

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Features
- **Mobile-first**: ออกแบบสำหรับมือถือก่อน
- **Touch Friendly**: ปุ่มและ element ที่เหมาะกับการสัมผัส
- **Performance**: โหลดเร็วในทุกอุปกรณ์

## 🚢 Deployment

### Vercel (แนะนำ)
```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Build
```bash
npm run build
# อัปโหลดโฟลเดอร์ dist/ ไป hosting service
```

## 🔗 Related Repositories

- **Backend**: [Backend-POS](https://github.com/komkemkku/Backend-POS) - Go + Gin API Server
- **Frontend**: [Frontend-POS](https://github.com/komkemkku/Frontend-POS) - Vue.js Admin Panel

## 📋 Current Status

### ✅ Completed Features
- ✅ Project setup (Vue 3 + Vite + Tailwind + Pinia)
- ✅ Authentication system (Login/Logout)
- ✅ API integration with Railway backend
- ✅ Responsive login page with modern UI
- ✅ Route protection and navigation guards
- ✅ Environment configuration
- ✅ CORS setup for development

### 🚧 In Progress
- 🔄 Dashboard implementation
- 🔄 Menu management CRUD
- 🔄 Table management
- 🔄 Staff management
- 🔄 Reports and analytics

### 📋 Todo
- ⏳ Reservation system
- ⏳ Order management
- ⏳ Real-time updates
- ⏳ Print functionality
- ⏳ Mobile app version

## 🤝 Contributing

### การพัฒนา
1. Fork repository
2. สร้าง feature branch: `git checkout -b feature/new-feature`
3. Commit การเปลี่ยนแปลง: `git commit -m 'Add new feature'`
4. Push ไป branch: `git push origin feature/new-feature`
5. สร้าง Pull Request

### Code Style
- ใช้ **ESLint** และ **Prettier**
- ตั้งชื่อ component ด้วย PascalCase
- ใช้ Composition API สำหรับ logic
- เขียน comment เป็นภาษาไทย

## 📞 ติดต่อ

- **Repository**: [Frontend-POS](https://github.com/komkemkku/Frontend-POS)
- **Backend**: [Backend-POS](https://github.com/komkemkku/Backend-POS)
- **Demo**: [POS Admin Panel](http://localhost:3000) (Local Development)

---

**© 2025 POS Restaurant Management System. All rights reserved.**
