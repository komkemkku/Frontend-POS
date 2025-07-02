import React, { useState } from 'react';
import axios from '../../api/axios';
import './TableForm.css';

function TableForm({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/admin/tables', { name });
      onSuccess();
    } catch {
      setError('บันทึกไม่สำเร็จ');
    }
    setLoading(false);
  };

  return (
    <div className="tableform-modal-bg">
      <div className="tableform-modal">
        <h3>เพิ่มโต๊ะ</h3>
        <form onSubmit={handleSubmit} className="tableform-form">
          <label>ชื่อ/เลขโต๊ะ
            <input value={name} onChange={e => setName(e.target.value)} required />
          </label>
          {error && <div className="tableform-error">{error}</div>}
          <div className="tableform-actions">
            <button type="button" onClick={onClose} className="tableform-cancel">ยกเลิก</button>
            <button type="submit" disabled={loading}>{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TableForm;
