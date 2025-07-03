import React, { createContext, useState, useEffect } from 'react';
import { loginApi, getStaffInfoApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { setCookie, removeCookie } from '../utils/cookie';

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
            console.log('กำลังส่ง Login request...', { username, password: '***' });
            const loginResponse = await loginApi(username, password);
            console.log('Login response:', loginResponse);
            
            // รองรับทั้งกรณี token อยู่ใน data.data หรือ data โดยตรง
            let token = null;
            if (loginResponse.data?.data?.token) {
                token = loginResponse.data.data.token;
            } else if (loginResponse.data?.token) {
                token = loginResponse.data.token;
            }
            if (!token) throw new Error('ไม่พบ token จากเซิร์ฟเวอร์');

            console.log('Token ที่ได้:', token);
            localStorage.setItem('token', token);
            setToken(token);
            setCookie('token', token, 1); // เก็บ cookie 1 วัน

            // หลังจากได้ Token ให้ดึงข้อมูลผู้ใช้ทันที
            console.log('กำลังดึงข้อมูลผู้ใช้...');
            const staffInfoResponse = await getStaffInfoApi();
            console.log('Staff info response:', staffInfoResponse);
            setUser(staffInfoResponse.data.data);
        } catch (err) {
            console.error('Login error:', err);
            setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            localStorage.removeItem('token');
            removeCookie('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        removeCookie('token');
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
