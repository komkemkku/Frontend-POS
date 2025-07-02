import React, { useState } from 'react';
import axios from '../../api/axios';
import './MenuForm.css';

const categories = [
  'อาหาร',
  'เครื่องดื่ม',
  'ของหวาน',
];

function MenuForm({ menu, onClose, onSuccess }) {
  const [form, setForm] = useState(menu || { name: '', category: '', price: '', image: '' });
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
      if (menu) {
        await axios.put(`/admin/menus/${menu.id}`, form);
      } else {
        await axios.post('/admin/menus', form);
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
        <h3>{menu ? 'แก้ไขเมนู' : 'เพิ่มเมนู'}</h3>
        <form onSubmit={handleSubmit} className="menuform-form">
          <label>ชื่อเมนู
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>หมวดหมู่
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>ราคา (บาท)
            <input name="price" type="number" min="1" value={form.price} onChange={handleChange} required />
          </label>
          <label>URL รูปภาพ
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
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

export default MenuForm;
