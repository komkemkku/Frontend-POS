import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '500px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          margin: '0 0 20px 0',
          color: '#333',
          fontWeight: '700'
        }}>
          🍽️ ระบบ POS ร้านอาหาร
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          margin: '0 0 30px 0',
          lineHeight: '1.6'
        }}>
          ยินดีต้อนรับสู่ระบบสั่งอาหาร<br />
          สแกน QR Code หรือเลือกโต๊ะเพื่อสั่งอาหาร
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link 
            to="/menu?table=A1" 
            style={{
              background: 'linear-gradient(135deg, #52c41a, #389e0d)',
              color: 'white',
              padding: '15px 25px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'block'
            }}
          >
            🍽️ เลือกเมนูอาหาร (โต๊ะ A1)
          </Link>
          
          <Link 
            to="/scan-qr" 
            style={{
              background: 'linear-gradient(135deg, #1890ff, #0050b3)',
              color: 'white',
              padding: '15px 25px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'block'
            }}
          >
            📱 สแกน QR Code
          </Link>
          
          <Link 
            to="/reserve" 
            style={{
              background: 'linear-gradient(135deg, #fa8c16, #d46b08)',
              color: 'white',
              padding: '15px 25px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'block'
            }}
          >
            📅 จองโต๊ะ
          </Link>
          
          <Link 
            to="/login" 
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              display: 'block',
              marginTop: '20px'
            }}
          >
            👨‍💼 เข้าสู่ระบบสำหรับพนักงาน
          </Link>
        </div>
        
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#f6ffed',
          borderRadius: '10px',
          border: '1px solid #b7eb8f'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#52c41a' }}>
            📝 วิธีใช้งาน
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '0.9rem', 
            color: '#389e0d',
            lineHeight: '1.5'
          }}>
            1. สแกน QR Code บนโต๊ะ หรือเลือกโต๊ะ<br />
            2. เลือกเมนูอาหารที่ต้องการ<br />
            3. กดส่งออเดอร์<br />
            4. รอรับอาหารตามเวลาที่แจ้ง
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
