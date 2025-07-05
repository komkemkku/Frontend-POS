import axios from 'axios';
import authAxios from './axios';

// สร้าง public axios instance สำหรับลูกค้า (ไม่ต้องการ token)
const publicAxios = axios.create({
    baseURL: 'https://backend-pos-production.up.railway.app'
});

// API functions สำหรับลูกค้า
export const customerApi = {
    // ดึงข้อมูลโต๊ะผ่าน QR Code
    getTable: async (qrCodeIdentifier) => {
        return await publicAxios.get(`/public/table/summary/${qrCodeIdentifier}`);
    },
    
    // ดึงหมวดหมู่ทั้งหมด (ใช้ public menu endpoint)
    getCategories: async () => {
        return await publicAxios.get('/categories');
    },
    
    // ดึงเมนูทั้งหมด (สำหรับลูกค้า)
    getMenuItems: async () => {
        return await publicAxios.get('/public/menu');
    },

    // ดึงเมนูจาก QR Code ของโต๊ะ
    getMenuByQR: async (qrCodeIdentifier) => {
        return await publicAxios.get(`/public/menu/${qrCodeIdentifier}`);
    },
    
    // ดึงประวัติการสั่งของโต๊ะ (เฉพาะที่ยังไม่ชำระเงิน)
    getOrderHistory: async (qrCodeIdentifier) => {
        return await publicAxios.get(`/public/orders/table/${qrCodeIdentifier}`);
    },

    // ดึงประวัติการสั่งทั้งหมด (รวมที่ชำระแล้ว)
    getAllOrderHistory: async (qrCodeIdentifier) => {
        return await publicAxios.get(`/public/orders/history/${qrCodeIdentifier}`);
    },
    
    // สั่งอาหาร (ลูกค้า)
    createOrder: async (orderData) => {
        return await publicAxios.post('/public/orders/create', orderData);
    },
    
    // ดึงสถานะคำสั่งซื้อเฉพาะ
    getOrderStatus: async (orderId, qrCodeIdentifier) => {
        return await publicAxios.get(`/public/orders/${orderId}/table/${qrCodeIdentifier}`);
    }
};

// API สำหรับโต๊ะ (ใช้ใน QRCodeManagePage - ต้องการ authentication)
export const tablesApi = {
    getTables: async () => {
        return await authAxios.get('/tables');
    }
};

export default publicAxios;
