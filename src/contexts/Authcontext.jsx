import React, { createContext, useState, useEffect } from 'react';
import { loginApi, getStaffInfoApi } from '../api/authApi';
import { setCookie, removeCookie } from '../utils/cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const savedToken = localStorage.getItem('token');
                if (savedToken) {
                    setToken(savedToken);
                    const response = await getStaffInfoApi();
                    setUser(response.data);
                }
            } catch (err) {
                localStorage.removeItem('token');
                removeCookie('token');
                setToken(null);
                setUser(null);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await loginApi(username, password);
            
            const { token, user } = response.data;
            
            if (!token || !user) {
                throw new Error('ข้อมูลการเข้าสู่ระบบไม่ครบถ้วน');
            }
            
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            setCookie('token', token, 1);
            
            return { success: true };
        } catch (err) {
            // ใช้ error message จาก API authApi.js ที่ปรับปรุงแล้ว
            const errorMessage = err.message || 'เข้าสู่ระบบไม่สำเร็จ';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        removeCookie('token');
        setToken(null);
        setUser(null);
        setError(null);
    };

    const value = {
        user,
        token,
        loading,
        error,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
