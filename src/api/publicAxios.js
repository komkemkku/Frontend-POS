import axios from 'axios';

// API instance สำหรับลูกค้า (ไม่ต้อง authentication)
const publicAxios = axios.create({
    baseURL: 'https://backend-pos-production.up.railway.app'
});

export default publicAxios;
