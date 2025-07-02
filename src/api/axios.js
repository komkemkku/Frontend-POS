import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://172.20.10.3:8080'
});

// เพิ่ม Token ในทุก Request โดยอัตโนมัติ
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;