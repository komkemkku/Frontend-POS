import React, { useState } from 'react';
import axios from '../../api/axios';
import './ReservationForm.css';

function ReservationForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    table_id: '',
    customer_name: '',
    customer_phone: '',
    number_of_guests: 1,
    reservation_time: '',
    status: 'pending',
    notes: ''
  });
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
      await axios.post('/reservations/create', form);
      onSuccess();
    } catch {
      setError('บันทึกไม่สำเร็จ');
    }
    setLoading(false);
  };

  return (
    <div className="reservationform-modal-bg">
      <div className="reservationform-modal">
        <h3>เพิ่มการจอง</h3>
        <form onSubmit={handleSubmit} className="reservationform-form">
          <label>โต๊ะ
            <input name="table_id" value={form.table_id} onChange={handleChange} required />
          </label>
          <label>ชื่อผู้จอง
            <input name="customer_name" value={form.customer_name} onChange={handleChange} required />
          </label>
          <label>เบอร์โทรศัพท์
            <input name="customer_phone" value={form.customer_phone} onChange={handleChange} required />
          </label>
          <label>จำนวนคน
            <input name="number_of_guests" type="number" min="1" value={form.number_of_guests} onChange={handleChange} required />
          </label>
          <label>วันและเวลา
            <input name="reservation_time" type="datetime-local" value={form.reservation_time} onChange={handleChange} required />
          </label>
          <label>หมายเหตุ
            <input name="notes" value={form.notes} onChange={handleChange} />
          </label>
          {error && <div className="reservationform-error">{error}</div>}
          <div className="reservationform-actions">
            <button type="button" onClick={onClose} className="reservationform-cancel">ยกเลิก</button>
            <button type="submit" disabled={loading}>{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationForm;
