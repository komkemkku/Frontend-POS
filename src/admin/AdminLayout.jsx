import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { removeCookie } from '../utils/cookie';
import './AdminLayout.css';

const menu = [
  { path: '/dashboard', label: 'ภาพรวมโต๊ะ (Dashboard)' },
  { path: '/admin/menus', label: 'จัดการเมนู' },
  { path: '/admin/categories', label: 'จัดการประเภทสินค้า' },
  { path: '/admin/tables', label: 'จัดการโต๊ะ' },
  { path: '/admin/reservations', label: 'การจอง' },
  { path: '/admin/staffs', label: 'พนักงาน' },
  { path: '/admin/reports', label: 'รายงาน' },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    removeCookie('token');
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">🍽️ POS Admin</div>
        <nav>
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <span>ระบบหลังบ้านร้านอาหาร</span>
          <button className="admin-logout" onClick={handleLogout}>ออกจากระบบ</button>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
