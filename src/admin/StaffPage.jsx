import React, { useState, useEffect } from 'react';
import StaffForm from './components/StaffForm';
import axios from '../api/axios';
import './StaffPage.css';

function StaffPage() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/staff');
      setStaffs(res.data.data || []);
      setError(null);
    } catch {
      setError('โหลดข้อมูลพนักงานไม่สำเร็จ');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบบัญชีนี้?')) return;
    await axios.delete(`/staff/${id}`);
    fetchStaffs();
  };

  return (
    <div className="staff-page">
      <div className="staff-header">
        <h2>จัดการพนักงาน</h2>
        <button className="staff-add-btn" onClick={() => setModalOpen(true)}>+ เพิ่มพนักงาน</button>
      </div>
      {error && <div className="staff-error">{error}</div>}
      <div className="staff-table-wrap">
        {loading ? <div className="staff-loading">กำลังโหลด...</div> : (
          <table className="staff-table">
            <thead>
              <tr>
                <th>ชื่อ</th>
                <th>Username</th>
                <th>สิทธิ์</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.name}</td>
                  <td>{staff.username}</td>
                  <td>{staff.role}</td>
                  <td>
                    <button onClick={() => handleDelete(staff.id)} className="staff-del-btn">ลบ</button>
                  </td>
                </tr>
              ))}
              {staffs.length === 0 && <tr><td colSpan={4} style={{textAlign:'center'}}>ไม่มีพนักงาน</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {modalOpen && (
        <StaffForm
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); fetchStaffs(); }}
        />
      )}
    </div>
  );
}

export default StaffPage;
