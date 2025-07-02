import React from 'react';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
  const { user } = useAuth();
  return (
    <div style={{ padding: '32px', textAlign: 'center' }}>
      <h1>หน้าแรกของ DEV POS</h1>
      {user ? (
        <p>สวัสดีคุณ <b>{user.full_name || user.username}</b>!</p>
      ) : (
        <p>กรุณาเข้าสู่ระบบเพื่อใช้งานระบบ POS</p>
      )}
    </div>
  );
}

export default HomePage;
