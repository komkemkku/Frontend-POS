import axios from './axios';

// Staff API
export const staffApi = {
    getList: async () => {
        return await axios.get('/staff');
    },
    getById: async (id) => {
        return await axios.get(`/staff/${id}`);
    },
    create: async (staffData) => {
        return await axios.post('/staff/create', staffData);
    },
    update: async (id, staffData) => {
        return await axios.patch(`/staff/${id}`, staffData);
    },
    delete: async (id) => {
        return await axios.delete(`/staff/${id}`);
    }
};

// Categories API
export const categoriesApi = {
    getList: async () => {
        return await axios.get('/categories');
    },
    getById: async (id) => {
        return await axios.get(`/categories/${id}`);
    },
    create: async (categoryData) => {
        return await axios.post('/categories/create', categoryData);
    },
    update: async (id, categoryData) => {
        return await axios.patch(`/categories/${id}`, categoryData);
    },
    delete: async (id) => {
        return await axios.delete(`/categories/${id}`);
    }
};

// Menu Items API
export const menuItemsApi = {
    getList: async () => {
        const response = await axios.get('/menu-items');
        return response.data?.data || response.data || [];
    },
    getById: async (id) => {
        const response = await axios.get(`/menu-items/${id}`);
        return response.data?.data || response.data;
    },
    create: async (menuItemData) => {
        const response = await axios.post('/menu-items/create', menuItemData);
        return response.data?.data || response.data;
    },
    update: async (id, menuItemData) => {
        const response = await axios.patch(`/menu-items/${id}`, menuItemData);
        return response.data?.data || response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/menu-items/${id}`);
        return response.data?.data || response.data;
    }
};

// Orders API
export const ordersApi = {
    getList: async () => {
        const response = await axios.get('/orders');
        return response.data?.data || response.data || [];
    },
    getById: async (id) => {
        const response = await axios.get(`/orders/${id}`);
        return response.data?.data || response.data;
    },
    create: async (orderData) => {
        const response = await axios.post('/orders/create', orderData);
        return response.data?.data || response.data;
    },
    update: async (id, orderData) => {
        const response = await axios.patch(`/orders/${id}`, orderData);
        return response.data?.data || response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/orders/${id}`);
        return response.data?.data || response.data;
    },
    // Staff specific order management
    updateStatus: async (orderId, statusData) => {
        const response = await axios.patch(`/staff/orders/${orderId}/status`, statusData);
        return response.data?.data || response.data;
    },
    clearTable: async (qrCodeIdentifier) => {
        const response = await axios.post(`/staff/orders/clear-table/${qrCodeIdentifier}`);
        return response.data?.data || response.data;
    },
    advancedClearTable: async (qrCodeIdentifier) => {
        const response = await axios.post(`/staff/orders/advanced-clear/${qrCodeIdentifier}`);
        return response.data?.data || response.data;
    },
    cancelOrder: async (orderId, qrCodeIdentifier) => {
        const response = await axios.post(`/staff/orders/cancel/${orderId}/table/${qrCodeIdentifier}`);
        return response.data?.data || response.data;
    }
};

// Order Items API
export const orderItemsApi = {
    getList: async () => {
        return await axios.get('/order-items');
    },
    getById: async (id) => {
        return await axios.get(`/order-items/${id}`);
    },
    create: async (orderItemData) => {
        return await axios.post('/order-items/create', orderItemData);
    },
    update: async (id, orderItemData) => {
        return await axios.patch(`/order-items/${id}`, orderItemData);
    },
    delete: async (id) => {
        return await axios.delete(`/order-items/${id}`);
    }
};

// Payments API
export const paymentsApi = {
    getList: async () => {
        return await axios.get('/payments');
    },
    getById: async (id) => {
        return await axios.get(`/payments/${id}`);
    },
    create: async (paymentData) => {
        return await axios.post('/payments/create', paymentData);
    },
    update: async (id, paymentData) => {
        return await axios.patch(`/payments/${id}`, paymentData);
    },
    delete: async (id) => {
        return await axios.delete(`/payments/${id}`);
    }
};

// Reservations API
export const reservationsApi = {
    getList: async () => {
        return await axios.get('/reservations');
    },
    getById: async (id) => {
        return await axios.get(`/reservations/${id}`);
    },
    create: async (reservationData) => {
        return await axios.post('/reservations/create', reservationData);
    },
    update: async (id, reservationData) => {
        return await axios.patch(`/reservations/${id}`, reservationData);
    },
    delete: async (id) => {
        return await axios.delete(`/reservations/${id}`);
    }
};

// Tables API
export const tablesApi = {
    getList: async () => {
        const response = await axios.get('/tables');
        return response.data?.data || response.data || [];
    },
    getById: async (id) => {
        const response = await axios.get(`/tables/${id}`);
        return response.data?.data || response.data;
    },
    create: async (tableData) => {
        const response = await axios.post('/tables/create', tableData);
        return response.data?.data || response.data;
    },
    update: async (id, tableData) => {
        const response = await axios.patch(`/tables/${id}`, tableData);
        return response.data?.data || response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`/tables/${id}`);
        return response.data?.data || response.data;
    }
};

// Expenses API
export const expensesApi = {
    getList: async () => {
        return await axios.get('/expenses');
    },
    getById: async (id) => {
        return await axios.get(`/expenses/${id}`);
    },
    create: async (expenseData) => {
        return await axios.post('/expenses/create', expenseData);
    },
    update: async (id, expenseData) => {
        return await axios.patch(`/expenses/${id}`, expenseData);
    },
    delete: async (id) => {
        return await axios.delete(`/expenses/${id}`);
    }
};

// Health Check API
export const healthApi = {
    check: async () => {
        return await axios.get('/health');
    },
    ping: async () => {
        return await axios.get('/ping');
    }
};

// Dashboard API
export const dashboardApi = {
    getSummary: async () => {
        return await axios.get('/dashboard/summary');
    }
};

// Main Admin API - สำหรับ backward compatibility
export const adminApi = {
    // Tables
    getTables: async () => {
        return await tablesApi.getList();
    },
    
    // Dashboard
    getDashboardSummary: async () => {
        try {
            const response = await dashboardApi.getSummary();
            return response.data?.data || response.data;
        } catch (error) {
            console.warn('Dashboard summary API not available:', error.message);
            return null;
        }
    },
    
    // User Info
    getUserInfo: async () => {
        try {
            const response = await axios.get('/staff/info');
            return response.data?.data || response.data;
        } catch (error) {
            console.warn('Staff info API not available:', error.message);
            return null;
        }
    },
    
    // Re-export all APIs
    staff: staffApi,
    categories: categoriesApi,
    menuItems: menuItemsApi,
    orders: ordersApi,
    orderItems: orderItemsApi,
    payments: paymentsApi,
    reservations: reservationsApi,
    tables: tablesApi,
    expenses: expensesApi,
    health: healthApi,
    dashboard: dashboardApi
};
