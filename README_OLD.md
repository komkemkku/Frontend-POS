# POS Admin Frontend

Frontend สำหรับระบบ Point of Sale (POS) ร้านอาหาร - Admin Panel

## 🔗 Related Repository
- **Backend**: [Backend-POS](https://github.com/komkemkku/Backend-POS.git)
- **Frontend**: [Frontend-POS](https://github.com/komkemkku/Frontend-POS.git) (this repository)

## 🛠️ Technology Stack
- **Vue.js 3** - Progressive Framework
- **Tailwind CSS** - Utility-first CSS
- **Vite** - Build tool
- **Pinia** - State Management
- **Vue Router** - Routing
- **Axios** - HTTP Client
- **Heroicons** - Icon Library

## 🎨 Design System
- **Color Scheme**: White, Blue, Professional
- **Typography**: Inter Font
- **Components**: Modern, Clean, Responsive
- **Icons**: Heroicons Outline

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running on port 8080

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Features Implemented

### ✅ Completed
- 🔐 **Login System** - JWT Authentication
- 🏠 **Dashboard** - Overview with stats and charts
- 📊 **Admin Layout** - Sidebar navigation and responsive design
- 🍽️ **Menu Management** - View, filter, and basic CRUD operations

### 🚧 In Development
- 📝 **Menu Form** - Add/Edit menu items
- 🏷️ **Categories Management** - CRUD for food categories
- 🪑 **Table Management** - Table and QR code management
- 📋 **Order Management** - Real-time order tracking
- 📅 **Reservation System** - Booking management
- 👥 **Staff Management** - Employee management
- 📈 **Reports & Analytics** - Sales reports and charts

## 🔄 API Integration
- **Base URL**: `/api` (proxied to localhost:8080)
- **Authentication**: Bearer Token
- **Auto-redirect**: On 401 unauthorized

## 🎨 UI Components
- **Buttons**: Primary, Secondary, Danger, Success
- **Cards**: Clean white cards with shadow
- **Forms**: Input fields with focus states
- **Tables**: Responsive with hover effects
- **Sidebar**: Collapsible navigation
- **Loading States**: Spinners and skeletons

## 📱 Responsive Design
- **Mobile First**: Optimized for all screen sizes
- **Sidebar**: Collapsible on mobile
- **Tables**: Horizontal scroll on small screens
- **Grid**: Responsive grid layouts

## 🚦 Development Strategy
Frontend จะพัฒนาทีละฟีเจอร์และ commit เมื่อเสร็จสมบูรณ์

### Current Status
```
🟢 Login System (100%)
🟢 Dashboard (100%)
🟢 Menu List (100%)
🟡 Menu Form (0%)
🟡 Categories (0%)
🟡 Tables (0%)
🟡 Orders (0%)
🟡 Reservations (0%)
🟡 Staff (0%)
🟡 Reports (0%)
```

---
**Note**: Frontend deploys only when features are complete
