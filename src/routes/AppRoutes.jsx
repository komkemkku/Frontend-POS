import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

// สร้างหน้า Dashboard จำลอง
const DashboardPage = () => {
    const { user, logout } = useAuth();
    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to Dashboard!</h1>
            {user ? (
                <div>
                    <p><strong>Full Name:</strong> {user.full_name}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
            <button onClick={logout} style={{ marginTop: '20px' }}>Logout</button>
        </div>
    );
};


import HomePage from '../pages/HomePage';

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
            {/* Route หน้าแรก */}
            <Route path="/" element={<HomePage />} />
        </Routes>
    );
}

export default AppRoutes;