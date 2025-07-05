import axios from './axios';

// Helper function สำหรับการ handle response
const handleResponse = (response) => {
    return response.data?.data || response.data;
};

// Helper function สำหรับการ handle error
const handleError = (error, fallbackData = null) => {
    console.error('API Error:', error);
    if (fallbackData !== null) {
        return fallbackData;
    }
    throw error;
};

// Staff API
export const staffApi = {
    getList: async () => {
        try {
            const response = await axios.get('/staff');
            return handleResponse(response);
        } catch (error) {
            return handleError(error, []);
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`/staff/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    create: async (staffData) => {
        try {
            const response = await axios.post('/staff/create', staffData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    update: async (id, staffData) => {
        try {
            const response = await axios.patch(`/staff/${id}`, staffData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`/staff/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
};

// Categories API
export const categoriesApi = {
    getList: async () => {
        try {
            const response = await axios.get('/categories');
            return handleResponse(response);
        } catch (error) {
            return handleError(error, []);
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`/categories/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    create: async (categoryData) => {
        try {
            const response = await axios.post('/categories/create', categoryData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    update: async (id, categoryData) => {
        try {
            const response = await axios.patch(`/categories/${id}`, categoryData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`/categories/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
};

// Menu Items API
export const menuItemsApi = {
    getList: async () => {
        try {
            const response = await axios.get('/menu-items');
            return handleResponse(response);
        } catch (error) {
            return handleError(error, []);
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`/menu-items/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    create: async (menuItemData) => {
        try {
            const response = await axios.post('/menu-items/create', menuItemData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    update: async (id, menuItemData) => {
        try {
            const response = await axios.patch(`/menu-items/${id}`, menuItemData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`/menu-items/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
};

// Orders API
export const ordersApi = {
    getList: async () => {
        try {
            const response = await axios.get('/orders');
            return handleResponse(response);
        } catch (error) {
            return handleError(error, []);
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`/orders/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    create: async (orderData) => {
        try {
            const response = await axios.post('/orders/create', orderData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    update: async (id, orderData) => {
        try {
            const response = await axios.patch(`/orders/${id}`, orderData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`/orders/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    // Staff specific order management
    updateStatus: async (orderId, statusData) => {
        try {
            const response = await axios.patch(`/staff/orders/${orderId}/status`, statusData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    clearTable: async (qrCodeIdentifier) => {
        try {
            const response = await axios.post(`/staff/orders/clear-table/${qrCodeIdentifier}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    advancedClearTable: async (qrCodeIdentifier) => {
        try {
            const response = await axios.post(`/staff/orders/advanced-clear/${qrCodeIdentifier}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    cancelOrder: async (orderId, qrCodeIdentifier) => {
        try {
            const response = await axios.post(`/staff/orders/cancel/${orderId}/table/${qrCodeIdentifier}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
};

// Order Items API
export const orderItemsApi = {
    getList: async () => {
        try {
            const response = await axios.get('/order-items');
            return handleResponse(response);
        } catch (error) {
            return handleError(error, []);
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`/order-items/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    create: async (orderItemData) => {
        try {
            const response = await axios.post('/order-items/create', orderItemData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    update: async (id, orderItemData) => {
        try {
            const response = await axios.patch(`/order-items/${id}`, orderItemData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`/order-items/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
};

// Payments API
export const paymentsApi = {
    getList: async () => {
        try {
            const response = await axios.get('/payments');
            return handleResponse(response);
        } catch (error) {
            return handleError(error, []);
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`/payments/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    create: async (paymentData) => {
        try {
            const response = await axios.post('/payments/create', paymentData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    update: async (id, paymentData) => {
        try {
            const response = await axios.patch(`/payments/${id}`, paymentData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`/payments/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
};

// Reservations API
export const reservationsApi = {
    getList: async () => {
        try {
            const response = await axios.get('/reservations');
            return handleResponse(response);
        } catch (error) {
            return handleError(error, []);
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`/reservations/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    create: async (reservationData) => {
        try {
            const response = await axios.post('/reservations/create', reservationData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    update: async (id, reservationData) => {
        try {
            const response = await axios.patch(`/reservations/${id}`, reservationData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`/reservations/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
};

// Tables API
export const tablesApi = {
    getList: async () => {
        try {
            const response = await axios.get('/tables');
            return handleResponse(response);
        } catch (error) {
            return handleError(error, []);
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`/tables/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    create: async (tableData) => {
        try {
            const response = await axios.post('/tables/create', tableData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    update: async (id, tableData) => {
        try {
            const response = await axios.patch(`/tables/${id}`, tableData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`/tables/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
};

// Expenses API
export const expensesApi = {
    getList: async () => {
        try {
            const response = await axios.get('/expenses');
            return handleResponse(response);
        } catch (error) {
            return handleError(error, []);
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`/expenses/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    create: async (expenseData) => {
        try {
            const response = await axios.post('/expenses/create', expenseData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    update: async (id, expenseData) => {
        try {
            const response = await axios.patch(`/expenses/${id}`, expenseData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`/expenses/${id}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
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
            const response = await axios.get('/summary');
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
