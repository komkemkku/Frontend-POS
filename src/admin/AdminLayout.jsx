import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { removeCookie } from '../utils/cookie';
import { useAuth } from '../hooks/useAuth';
import '../styles/modern.css';

const menu = [
  { path: '/dashboard', label: 'ภาพรวม (Dashboard)', icon: '📊' },
  { path: '/admin/menus', label: 'จัดการเมนู', icon: '🍽️' },
  { path: '/admin/categories', label: 'จัดการประเภทเมนู', icon: '📂' },
  { path: '/admin/tables', label: 'จัดการโต๊ะ', icon: '🪑' },
  { path: '/admin/staffs', label: 'จัดการพนักงาน', icon: '👥' },
  { path: '/admin/reservations', label: 'จัดการการจอง', icon: '📅' },
  { path: '/admin/qrcode', label: 'QR Code สำหรับลูกค้า', icon: '📱' },
  { path: '/admin/reports', label: 'รายงาน', icon: '📈' },
  { path: '/orders', label: 'จัดการออเดอร์', icon: '📋' },
  { path: '/payment', label: 'ชำระเงิน', icon: '💳' }
];

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
        color: 'white',
        transition: 'all 0.3s ease',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        transform: window.innerWidth <= 768 && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '2rem 1.5rem', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
        }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🍽️ POS Admin
          </h1>
          <p style={{ 
            fontSize: '0.875rem', 
            opacity: '0.9', 
            margin: '0.5rem 0 0 0' 
          }}>
            ระบบจัดการร้านอาหาร
          </p>
        </div>

        {/* User Info */}
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              {user?.full_name?.charAt(0) || user?.username?.charAt(0) || '👤'}
            </div>
            <div>
              <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                {user?.full_name || user?.username || 'ผู้ใช้'}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: '0.75' }}>
                {user?.role || 'พนักงาน'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '1rem 0', flex: 1, overflowY: 'auto' }}>
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1.5rem',
                color: 'white',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                borderRadius: '0.5rem',
                margin: '0.25rem 1rem',
                background: isActive(item.path) ? 'rgba(255,255,255,0.15)' : 'transparent',
                borderLeft: isActive(item.path) ? '3px solid #6366f1' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            className="btn"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            🚪 ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        marginLeft: '280px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Top Bar */}
        <header style={{
          background: 'white',
          padding: '1rem 2rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: '600',
            color: '#1e293b'
          }}>
            ระบบจัดการร้านอาหาร
          </h2>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            <span>📅 {new Date().toLocaleDateString('th-TH')}</span>
            <span>🕐 {new Date().toLocaleTimeString('th-TH', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ 
          flex: 1, 
          padding: '2rem',
          background: '#f8fafc'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
