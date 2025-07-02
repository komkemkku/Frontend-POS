import React, { createContext, useState, useEffect } from 'react';
import { loginApi, getStaffInfoApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false); // สำหรับ Loading ตอนกดปุ่ม Login
    const [authLoading, setAuthLoading] = useState(true); // สำหรับ Loading ตอนเปิดแอปครั้งแรก
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await getStaffInfoApi();
                    setUser(response.data.data);
                    setToken(storedToken);
                } catch (err) {
                    console.error("Token ไม่ถูกต้อง, กำลังลบ Token...", err);
                    localStorage.removeItem('token');
                }
            }
            setAuthLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const loginResponse = await loginApi(username, password);
            // รองรับทั้งกรณี token อยู่ใน data.data หรือ data โดยตรง
            let token = null;
            if (loginResponse.data?.data?.token) {
                token = loginResponse.data.data.token;
            } else if (loginResponse.data?.token) {
                token = loginResponse.data.token;
            }
            if (!token) throw new Error('ไม่พบ token จากเซิร์ฟเวอร์');

            localStorage.setItem('token', token);
            setToken(token);

            // หลังจากได้ Token ให้ดึงข้อมูลผู้ใช้ทันที
            const staffInfoResponse = await getStaffInfoApi();
            setUser(staffInfoResponse.data.data);
        } catch (err) {
            setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, error, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
