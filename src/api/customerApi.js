import axios from 'axios';
import authAxios from './axios';

// สร้าง public axios instance สำหรับลูกค้า (ไม่ต้องการ token)
const publicAxios = axios.create({
    baseURL: 'https://backend-pos-production.up.railway.app'
});

// Helper function สำหรับการ handle response
const handleResponse = (response) => {
    return response.data?.data || response.data;
};

// API functions สำหรับลูกค้า
export const customerApi = {
    // ดึงข้อมูลโต๊ะผ่าน QR Code
    getTable: async (qrCodeIdentifier) => {
        try {
            const response = await publicAxios.get(`/public/table/summary/${qrCodeIdentifier}`);
            return handleResponse(response);
        } catch (error) {
            console.error('Error getting table info:', error);
            // Fallback data
            return {
                table_id: qrCodeIdentifier,
                table_name: `โต๊ะ ${qrCodeIdentifier}`,
                status: 'available',
                capacity: 4
            };
        }
    },
    
    // ดึงหมวดหมู่ทั้งหมด (ใช้ public menu endpoint)
    getCategories: async () => {
        try {
            const response = await publicAxios.get('/public/categories');
            return handleResponse(response);
        } catch (error) {
            console.error('Error getting categories:', error);
            // Fallback to private endpoint
            try {
                const fallbackResponse = await publicAxios.get('/categories');
                return handleResponse(fallbackResponse);
            } catch (fallbackError) {
                console.error('Fallback categories failed:', fallbackError);
                return [
                    { id: 1, name: 'อาหารจานหลัก', description: 'เมนูหลักของร้าน' },
                    { id: 2, name: 'เครื่องดื่ม', description: 'เครื่องดื่มทุกประเภท' },
                    { id: 3, name: 'ของหวาน', description: 'ขนมหวานและของหวาน' }
                ];
            }
        }
    },
    
    // ดึงเมนูทั้งหมด (สำหรับลูกค้า)
    getMenuItems: async () => {
        try {
            const response = await publicAxios.get('/public/menu');
            const menuData = handleResponse(response);
            
            // Handle different response structures
            if (Array.isArray(menuData)) {
                return menuData;
            } else if (menuData.menu_items) {
                return menuData.menu_items;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error getting menu items:', error);
            // Fallback data
            return [
                {
                    id: 1,
                    name: 'ผัดไทย',
                    description: 'ผัดไทยรสเลิศ',
                    price: 60,
                    category: 'อาหารจานหลัก',
                    image: null,
                    available: true
                },
                {
                    id: 2,
                    name: 'น้ำส้มสด',
                    description: 'น้ำส้มคั้นสด',
                    price: 30,
                    category: 'เครื่องดื่ม',
                    image: null,
                    available: true
                }
            ];
        }
    },

    // ดึงเมนูจาก QR Code ของโต๊ะ
    getMenuByQR: async (qrCodeIdentifier) => {
        try {
            const response = await publicAxios.get(`/public/menu/${qrCodeIdentifier}`);
            const menuData = handleResponse(response);
            
            // Handle different response structures
            if (Array.isArray(menuData)) {
                return menuData;
            } else if (menuData.menu_items) {
                return menuData.menu_items;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error getting menu by QR:', error);
            // Fallback to general menu
            return await customerApi.getMenuItems();
        }
    },
    
    // ดึงประวัติการสั่งของโต๊ะ (เฉพาะที่ยังไม่ชำระเงิน)
    getOrderHistory: async (qrCodeIdentifier) => {
        try {
            const response = await publicAxios.get(`/public/orders/table/${qrCodeIdentifier}`);
            const orderData = handleResponse(response);
            
            // Handle different response structures
            if (Array.isArray(orderData)) {
                return orderData;
            } else if (orderData.orders) {
                return orderData.orders;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error getting order history:', error);
            return [];
        }
    },

    // ดึงประวัติการสั่งทั้งหมด (รวมที่ชำระแล้ว)
    getAllOrderHistory: async (qrCodeIdentifier) => {
        try {
            const response = await publicAxios.get(`/public/orders/history/${qrCodeIdentifier}`);
            const orderData = handleResponse(response);
            
            // Handle different response structures
            if (Array.isArray(orderData)) {
                return orderData;
            } else if (orderData.orders) {
                return orderData.orders;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error getting all order history:', error);
            return [];
        }
    },
    
    // สั่งอาหาร (ลูกค้า)
    createOrder: async (orderData) => {
        try {
            const response = await publicAxios.post('/public/orders/create', orderData);
            return handleResponse(response);
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },
    
    // ดึงสถานะคำสั่งซื้อเฉพาะ
    getOrderStatus: async (orderId, qrCodeIdentifier) => {
        try {
            const response = await publicAxios.get(`/public/orders/${orderId}/table/${qrCodeIdentifier}`);
            return handleResponse(response);
        } catch (error) {
            console.error('Error getting order status:', error);
            // Fallback status
            return {
                id: orderId,
                status: 'pending',
                total_amount: 0,
                items: []
            };
        }
    },

    // เพิ่ม method สำหรับตรวจสอบสถานะโต๊ะแบบ real-time
    getTableStatus: async (qrCodeIdentifier) => {
        try {
            const response = await publicAxios.get(`/public/table/status/${qrCodeIdentifier}`);
            return handleResponse(response);
        } catch (error) {
            console.error('Error getting table status:', error);
            return {
                table_id: qrCodeIdentifier,
                status: 'available',
                current_orders: 0,
                total_amount: 0
            };
        }
    },

    // เพิ่ม method สำหรับขอความช่วยเหลือ
    requestHelp: async (qrCodeIdentifier, message) => {
        try {
            const response = await publicAxios.post(`/public/help/request`, {
                table_id: qrCodeIdentifier,
                message: message
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error requesting help:', error);
            throw error;
        }
    }
};

// API สำหรับโต๊ะ (ใช้ใน QRCodeManagePage - ต้องการ authentication)
export const tablesApi = {
    getTables: async () => {
        return await authAxios.get('/tables');
    }
};

export default publicAxios;
