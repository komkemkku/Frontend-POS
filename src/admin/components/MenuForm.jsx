import React, { useState } from 'react';
import axios from '../../api/axios';
import './MenuForm.css';

function MenuForm({ menu, onClose, onSuccess, categories = [] }) {
  const [form, setForm] = useState(menu ? {
    name: menu.name || '',
    category_id: menu.category_id || '',
    price: menu.price || '',
    image_url: menu.image_url || '',
    is_available: menu.is_available ?? true
  } : { name: '', category_id: '', price: '', image_url: '', is_available: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'price') {
      value = value === '' ? '' : parseFloat(value);
    }
    if (e.target.name === 'is_available') {
      value = e.target.checked;
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: form.price === '' ? undefined : parseFloat(form.price),
        category_id: form.category_id ? parseInt(form.category_id) : undefined
      };
      if (isNaN(payload.price)) {
        setError('กรุณากรอกราคาเป็นตัวเลข');
        setLoading(false);
        return;
      }
      if (!payload.category_id) {
        setError('กรุณาเลือกหมวดหมู่');
        setLoading(false);
        return;
      }
      if (menu) {
        await axios.patch(`/menu-items/${menu.id}`, payload);
      } else {
        await axios.post('/menu-items/create', payload);
      }
      onSuccess();
    } catch (err) {
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
            <select name="category_id" value={form.category_id} onChange={handleChange} required>
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label>ราคา (บาท)
            <input name="price" type="number" min="1" value={form.price} onChange={handleChange} required />
          </label>
          <label>URL รูปภาพ
            <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />
          </label>
          <label style={{display:'flex',alignItems:'center',gap:8}}>
            <input type="checkbox" name="is_available" checked={!!form.is_available} onChange={handleChange} />
            แสดงให้ลูกค้าเห็น (is_available)
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
