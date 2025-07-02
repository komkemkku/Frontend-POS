import React, { useState } from 'react';
import axios from '../../api/axios';
import './TableForm.css';


function TableForm({ table, onClose, onSuccess }) {
  // Map backend fields to frontend form fields
  // status: 1 = ว่าง, 2 = ไม่ว่าง, 3 = จอง
  const [form, setForm] = useState(table ? {
    number: table.table_number || table.number || '',
    name: table.name || '',
    seats: table.capacity || table.seats || 1,
    status: typeof table.status === 'number' ? table.status : 1
  } : { number: '', name: '', seats: 1, status: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'seats') value = parseInt(value) || 1;
    if (e.target.name === 'status') value = parseInt(value, 10);
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!form.number) {
        setError('กรุณากรอกหมายเลขโต๊ะ');
        setLoading(false);
        return;
      }
      if (form.seats < 1) {
        setError('จำนวนที่นั่งต้องมากกว่า 0');
        setLoading(false);
        return;
      }
      // Map frontend form fields to backend payload (ไม่ส่ง updated_at, name ปล่อยว่างได้)
      const payload = {
        table_number: parseInt(form.number, 10),
        capacity: parseInt(form.seats, 10),
        status: String(form.status)
      };
      if (table && table.id) {
        await axios.patch(`/tables/${table.id}`, payload);
      } else {
        await axios.post('/tables/create', payload);
      }
      onSuccess();
    } catch {
      setError('บันทึกไม่สำเร็จ');
    }
    setLoading(false);
  };

  return (
    <div className="menuform-modal-bg">
      <div className="menuform-modal">
        <h3>{table ? 'แก้ไขโต๊ะ' : 'เพิ่มโต๊ะ'}</h3>
        <form onSubmit={handleSubmit} className="menuform-form">
          <label>หมายเลขโต๊ะ
            <input name="number" value={form.number} onChange={handleChange} required />
          </label>
          <label>ชื่อโต๊ะ
            <input name="name" value={form.name} onChange={handleChange} placeholder="ใส่ชื่อโต๊ะ (ถ้ามี)" />
          </label>
          <label>จำนวนที่นั่ง
            <input name="seats" type="number" min="1" value={form.seats} onChange={handleChange} required />
          </label>
          <label>สถานะโต๊ะ
            <select name="status" value={form.status} onChange={handleChange} required>
              <option value={1}>ว่าง</option>
              <option value={2}>ไม่ว่าง</option>
              <option value={3}>จอง</option>
            </select>
          </label>
          {error && <div className="menuform-error">{error}</div>}
          <div className="menuform-actions">
            <button type="button" onClick={onClose} className="menuform-cancel">ยกเลิก</button>
            <button type="submit" disabled={loading}>{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TableForm;
