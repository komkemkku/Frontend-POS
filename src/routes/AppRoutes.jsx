import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';
import DashboardPage from '../pages/DashboardPage';
import OrderManagePage from '../pages/OrderManagePage';
import PaymentPage from '../pages/PaymentPage';





import HomePage from '../pages/HomePage';
import ReserveTablePage from '../pages/ReserveTablePage';
import MenuPage from '../pages/MenuPage';
import ScanQRPage from '../pages/ScanQRPage';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
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
                path="/payment"
                element={
                    <ProtectedRoute>
                        <PaymentPage />
                    </ProtectedRoute>
                }
            />
            {/* Customer Facing */}
            <Route path="/reserve" element={<ReserveTablePage />} />
            <Route path="/scan-qr" element={<ScanQRPage />} />
            <Route path="/menu" element={<MenuPage />} />
            {/* Route หน้าแรก */}
            <Route path="/" element={<HomePage />} />
        </Routes>
    );
}

export default AppRoutes;