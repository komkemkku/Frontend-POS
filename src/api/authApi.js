import axios from './axios';

export const loginApi = async (username, password) => {
    try {
        // ส่ง plain text password ไปให้ backend
        const response = await axios.post('/staff/login', { 
            username: username.trim(),
            password: password // ส่งเป็น plain text ให้ backend hash เอง
        });
        
        // ปรับ response structure ให้ตรงกับที่ AuthContext expect
        if (response.data && response.data.data) {
            const { staff, token } = response.data.data;
            return {
                data: {
                    user: staff, // เปลี่ยนจาก staff เป็น user
                    token: token
                }
            };
        }
        
        return response;
    } catch (error) {
        // จัดการ error ให้ดีขึ้น
        console.error('Login API Error:', error);
        
        if (error.response) {
            // Backend ตอบกลับมาแต่มี error status
            const status = error.response.status;
            const message = error.response.data?.message || error.response.data?.error;
            
            if (status === 401) {
                throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
            } else if (status === 404) {
                throw new Error('ไม่พบผู้ใช้ในระบบ');
            } else if (status >= 500) {
                throw new Error('เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง');
            } else {
                throw new Error(message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            }
        } else if (error.request) {
            // ไม่สามารถเชื่อมต่อกับ server ได้
            throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
        } else {
            // Error อื่นๆ
            throw new Error('เกิดข้อผิดพลาดที่ไม่คาดคิด');
        }
    }
};

export const getStaffInfoApi = async () => {
    try {
        const response = await axios.get('/staff/info');
        
        // ปรับ response structure ให้สอดคล้องกัน
        if (response.data && response.data.data) {
            return {
                data: response.data.data
            };
        }
        
        return response;
    } catch (error) {
        console.error('Get Staff Info API Error:', error);
        
        if (error.response?.status === 401) {
            throw new Error('กรุณาเข้าสู่ระบบใหม่');
        } else if (error.response?.status >= 500) {
            throw new Error('เกิดข้อผิดพลาดของเซิร์ฟเวอร์');
        } else {
            throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        }
    }
};
