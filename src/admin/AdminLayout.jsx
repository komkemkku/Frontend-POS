import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const menu = [
  { path: '/dashboard', label: 'ภาพรวมโต๊ะ (Dashboard)' },
  { path: '/admin/menus', label: 'จัดการเมนู' },
  { path: '/admin/tables', label: 'จัดการโต๊ะ' },
  { path: '/admin/reservations', label: 'การจอง' },
  { path: '/admin/staffs', label: 'พนักงาน' },
  { path: '/admin/reports', label: 'รายงาน' },
];

function AdminLayout() {
  const location = useLocation();
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
          <button className="admin-logout">ออกจากระบบ</button>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
