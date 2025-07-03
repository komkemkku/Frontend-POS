import axios from './axios';


// ส่ง password_hash เป็น plain text ตามหลังบ้าน (ไม่ hash)
export const loginApi = (username, password) => {
    console.log('Sending login request to:', '/auth/login');
    console.log('Request body:', { username, password_hash: password });
    return axios.post('/auth/login', { username, password_hash: password });
};

export const getStaffInfoApi = () => {
    return axios.get('/staff/info');
};
