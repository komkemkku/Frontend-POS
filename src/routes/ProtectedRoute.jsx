import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { token, authLoading } = useAuth();

    // ขณะที่กำลังตรวจสอบสถานะล็อกอิน ให้แสดงข้อความ Loading...
    if (authLoading) {
        return <div>Loading...</div>;
    }

    // ถ้าตรวจสอบเสร็จแล้วและไม่มี token ให้ redirect ไปหน้า login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;