import React, { useState } from 'react';
import axios from '../../api/axios';
import './StaffForm.css';

function StaffForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'staff' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/admin/staffs', form);
      onSuccess();
    } catch {
      setError('บันทึกไม่สำเร็จ');
    }
    setLoading(false);
  };

  return (
    <div className="staffform-modal-bg">
      <div className="staffform-modal">
        <h3>เพิ่มพนักงาน</h3>
        <form onSubmit={handleSubmit} className="staffform-form">
          <label>ชื่อ
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>Username
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>
          <label>สิทธิ์
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="staff">พนักงาน</option>
              <option value="admin">แอดมิน</option>
            </select>
          </label>
          {error && <div className="staffform-error">{error}</div>}
          <div className="staffform-actions">
            <button type="button" onClick={onClose} className="staffform-cancel">ยกเลิก</button>
            <button type="submit" disabled={loading}>{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffForm;
