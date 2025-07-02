import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeCookie } from '../utils/cookie';
import './PosNav.css';


import { useContext } from 'react';
import { AuthContext } from '../contexts/Authcontext';

function PosNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav-logo">🍽️ POS Dashboard</div>
      <div className="dashboard-nav-menu">
        <button onClick={() => navigate('/dashboard')} className={`dashboard-nav-btn${location.pathname === '/dashboard' ? ' active' : ''}`}>ภาพรวมโต๊ะ</button>
        <button onClick={() => navigate('/orders')} className={`dashboard-nav-btn${location.pathname === '/orders' ? ' active' : ''}`}>ออเดอร์</button>
        <button onClick={() => navigate('/payment')} className={`dashboard-nav-btn${location.pathname === '/payment' ? ' active' : ''}`}>ชำระเงิน</button>
        <button onClick={() => navigate('/admin/menus')} className="dashboard-nav-btn">หลังร้าน (Admin)</button>
      </div>
      <button className="dashboard-logout-btn" onClick={handleLogout}>ออกจากระบบ</button>
    </nav>
  );
}

export default PosNav;