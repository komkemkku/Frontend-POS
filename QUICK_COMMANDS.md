# Frontend Quick Commands

## 🚀 Auto-Deploy Commands

### วิธีใช้ Auto-Deploy
```powershell
# Windows
npm run deploy
# หรือ
powershell -ExecutionPolicy Bypass -File ./auto-deploy.ps1
# หรือ
./deploy.bat
```

### Build และ Deploy พร้อมกัน
```powershell
npm run build:deploy
```

## 🧹 Cleanup Commands

### ลบไฟล์ที่ไม่จำเป็น
```powershell
npm run cleanup
# หรือ
powershell -ExecutionPolicy Bypass -File ./cleanup.ps1
```

## 🔧 Development Commands

### รันเซิร์ฟเวอร์ development
```bash
npm run dev
```

### Build โปรเจค
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

### ตรวจสอบและแก้ไข code style
```bash
npm run lint
```

## 🚨 สิ่งสำคัญ

1. **Auto-Deploy** จะทำการ commit และ push อัตโนมัติ
2. **Cleanup** จะลบไฟล์ที่ไม่จำเป็นก่อนทำการ deploy
3. **.gitignore** ได้ปรับปรุงแล้วเพื่อไม่ให้อัปโหลดไฟล์ที่ไม่จำเป็น
4. **Build** จะสร้างไฟล์ใน `/dist` directory

## 🌍 Environment Variables

ตรวจสอบไฟล์ environment:
- `.env.development` - สำหรับ development
- `.env.production` - สำหรับ production  
- `.env.local` - สำหรับ local override
