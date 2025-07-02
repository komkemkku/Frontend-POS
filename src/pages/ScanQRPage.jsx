import React from 'react';

function ScanQRPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 16px #0001', padding: 32, minWidth: 320, textAlign: 'center' }}>
        <h2>สแกน QR ที่โต๊ะเพื่อดูเมนู</h2>
        <p>กรุณาใช้กล้องมือถือหรือแอปสแกน QR เพื่อเปิดหน้าเมนูอาหาร</p>
        <img src="/qr-demo.png" alt="QR Demo" style={{ width: 180, margin: '18px auto' }} />
        <p>หรือ <b>คลิกที่นี่</b> เพื่อดูเมนู (สำหรับทดสอบ)</p>
        <a href="/menu" style={{ color: '#1890ff', textDecoration: 'underline' }}>ไปที่เมนูอาหาร</a>
      </div>
    </div>
  );
}

export default ScanQRPage;
