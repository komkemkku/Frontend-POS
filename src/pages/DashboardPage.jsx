

import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './DashboardPage.css';
import { getCookie, removeCookie } from '../utils/cookie';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';



function DashboardPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getCookie('token') || localStorage.getItem('token');
        const res = await axios.get('/tables', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTables(res.data?.data || res.data || []);
      } catch (e) {
        setError('ไม่สามารถโหลดข้อมูลโต๊ะได้');
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  const handleLogout = () => {
    removeCookie('token');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <MainLayout>
      <div className="dashboard-bg">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2 className="dashboard-title">สถานะโต๊ะทั้งหมด</h2>
          </div>
          {loading ? (
            <div className="dashboard-loading">กำลังโหลด...</div>
          ) : error ? (
            <div className="dashboard-error">{error}</div>
          ) : (
            <div className="dashboard-table-list">
              {tables.map((table) => (
                <div key={table.id} className={`dashboard-table-card dashboard-table-${table.status || 'available'}`}>
                  <div className="dashboard-table-name">{table.name || `โต๊ะ ${table.id}`}</div>
                  <div className="dashboard-table-status">{renderStatus(table.status)}</div>
                  {table.orders && table.orders.length > 0 && (
                    <div className="dashboard-table-orders">
                      <b>ออเดอร์:</b>
                      <ul>
                        {table.orders.map((order) => (
                          <li key={order.id}>
                            #{order.id} - {order.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              {tables.length === 0 && (
                <div className="dashboard-empty">ไม่มีข้อมูลโต๊ะ</div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function renderStatus(status) {
  switch (status) {
    case 'reserved':
      return <span className="dashboard-status-reserved">จองแล้ว</span>;
    case 'occupied':
      return <span className="dashboard-status-occupied">ไม่ว่าง</span>;
    default:
      return <span className="dashboard-status-available">ว่าง</span>;
  }
}

export default DashboardPage;
