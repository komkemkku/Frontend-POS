import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './DashboardPage.css';

function DashboardPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get('/tables');
        setTables(res.data?.data || []);
      } catch (e) {
        setError('ไม่สามารถโหลดข้อมูลโต๊ะได้');
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  return (
    <div className="dashboard-bg">
      <div className="dashboard-container">
        <h2 className="dashboard-title">สถานะโต๊ะทั้งหมด</h2>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
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
