import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import DashboardPage from '../pages/DashboardPage';
import OrderManagePage from '../pages/OrderManagePage';
import PaymentPage from '../pages/PaymentPage';
import AdminLayout from '../admin/AdminLayout';
import AdminMenuPage from '../admin/MenuPage';

import AdminTablePage from '../admin/TablePage';
import AdminReservationPage from '../admin/ReservationPage';
import AdminStaffPage from '../admin/StaffPage';
import AdminReportPage from '../admin/ReportPage';
import CategoryPage from '../admin/CategoryPage';
import QRCodeManagePage from '../admin/QRCodeManagePage';

import MenuPage from '../pages/MenuPage';
import CustomerMenuPage from '../pages/CustomerMenuPage';

function AppRoutes() {
    return (
        <Routes>
            {/* Default Route - เริ่มต้นที่หน้าเข้าสู่ระบบ */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Customer Routes - ไม่ต้อง login (เข้าผ่าน QR Code) */}
            <Route path="/customer/table/:tableId" element={<CustomerMenuPage />} />
            <Route path="/customer/table/:tableId/menu" element={<CustomerMenuPage />} />
            
            {/* Staff/Admin Routes - ต้อง login */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <OrderManagePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/orders"
                element={
                    <ProtectedRoute>
                        <OrderManagePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/payment"
                element={
                    <ProtectedRoute>
                        <PaymentPage />
                    </ProtectedRoute>
                }
            />
            {/* Admin Panel */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route path="menus" element={<AdminMenuPage />} />
                <Route path="categories" element={<CategoryPage />} />
                <Route path="tables" element={<AdminTablePage />} />
                <Route path="qrcode" element={<QRCodeManagePage />} />
                <Route path="reservations" element={<AdminReservationPage />} />
                <Route path="staffs" element={<AdminStaffPage />} />
                <Route path="reports" element={<AdminReportPage />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;