import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import './MenuForm.css';

export default function CategoryForm({ onClose, onSuccess, editCategory }) {
  const [form, setForm] = useState(editCategory ? { name: editCategory.name || '' } : { name: '' });
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
      if (!form.name.trim()) {
        setError('กรุณากรอกชื่อประเภทสินค้า');
        setLoading(false);
        return;
      }
      if (editCategory) {
        await axios.patch(`/categories/${editCategory.id}`, { name: form.name });
      } else {
        await axios.post('/categories/create', { name: form.name });
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
        <h3>{editCategory ? 'แก้ไขประเภทสินค้า' : 'เพิ่มประเภทสินค้า'}</h3>
        <form onSubmit={handleSubmit} className="menuform-form">
          <label>ชื่อประเภทสินค้า
            <input name="name" value={form.name} onChange={handleChange} required />
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
