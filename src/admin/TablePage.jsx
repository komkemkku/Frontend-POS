import React, { useState, useEffect } from 'react';
import TableForm from './components/TableForm';
import axios from '../api/axios';
import './TablePage.css';

function TablePage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/tables');
      setTables(res.data.data || []);
      setError(null);
    } catch {
      setError('โหลดข้อมูลโต๊ะไม่สำเร็จ');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบโต๊ะนี้?')) return;
    await axios.delete(`/admin/tables/${id}`);
    fetchTables();
  };

  return (
    <div className="table-page">
      <div className="table-header">
        <h2>จัดการโต๊ะ</h2>
        <button className="table-add-btn" onClick={() => setModalOpen(true)}>+ เพิ่มโต๊ะ</button>
      </div>
      {error && <div className="table-error">{error}</div>}
      <div className="table-table-wrap">
        {loading ? <div className="table-loading">กำลังโหลด...</div> : (
          <table className="table-table">
            <thead>
              <tr>
                <th>เลขโต๊ะ</th>
                <th>QR Code</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <tr key={table.id}>
                  <td>{table.name || `โต๊ะ ${table.id}`}</td>
                  <td>
                    <img src={table.qr_code_url} alt="QR" className="table-qr-img" />
                  </td>
                  <td>
                    <button onClick={() => handleDelete(table.id)} className="table-del-btn">ลบ</button>
                  </td>
                </tr>
              ))}
              {tables.length === 0 && <tr><td colSpan={3} style={{textAlign:'center'}}>ไม่มีโต๊ะ</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {modalOpen && (
        <TableForm
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); fetchTables(); }}
        />
      )}
    </div>
  );
}

export default TablePage;
