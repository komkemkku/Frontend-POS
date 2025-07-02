import axios from './axios';


// ส่ง password_hash เป็น plain text ตามหลังบ้าน (ไม่ hash)
export const loginApi = (username, password) => {
    return axios.post('/auth/login', { username, password_hash: password });
};

export const getStaffInfoApi = () => {
    return axios.get('/staff/info');
};
