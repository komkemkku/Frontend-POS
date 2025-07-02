import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

function ReserveTablePage() {
    const [tables, setTables] = useState([]);
    const [form, setForm] = useState({
        customer_name: '',
        customer_phone: '',
        number_of_guests: 1,
        reservation_time: '',
        table_id: '',
        status: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // ดึงรายการโต๊ะจาก backend
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await axios.get('/tables');
                setTables(res.data?.data || []);
            } catch (e) {
                setTables([]);
            }
        };
        fetchTables();
    }, []);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            // แปลง reservation_time เป็น unix timestamp (วินาที)
            let reservation_time = form.reservation_time;
            let unixTime = '';
            if (reservation_time) {
                unixTime = Math.floor(new Date(reservation_time).getTime() / 1000).toString();
            }
            const payload = {
                ...form,
                table_id: form.table_id ? parseInt(form.table_id, 10) : undefined,
                reservation_time: unixTime,
                number_of_guests: parseInt(form.number_of_guests, 10)
            };
            await axios.post('/reservations/create', payload);
            setSuccess(true);
            setForm({ customer_name: '', customer_phone: '', number_of_guests: 1, reservation_time: '', table_id: '', status: '', notes: '' });
        } catch (err) {
            // Show backend error if available
            let msg = 'จองโต๊ะไม่สำเร็จ กรุณาลองใหม่';
            if (err.response && err.response.data && err.response.data.message) {
                msg = err.response.data.message;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reserve-bg">
            <div className="reserve-card">
                <div className="reserve-header">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="12" fill="#1890ff" />
                        <path d="M16 32L32 16M16 16h16v16" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2>จองโต๊ะร้านอาหาร</h2>
                </div>
                <form onSubmit={handleSubmit} className="reserve-form">
                    <label>
                        ชื่อผู้จอง
                        <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="ชื่อ-นามสกุล" required />
                    </label>
                    <label>
                        เบอร์โทรศัพท์
                        <input name="customer_phone" value={form.customer_phone} onChange={handleChange} placeholder="เบอร์โทร" required />
                    </label>
                    <label>
                        โต๊ะ (Table)
                        <select name="table_id" value={form.table_id} onChange={handleChange} required className="reserve-select">
                            <option value="">-- เลือกโต๊ะ --</option>
                            {tables.length === 0 && <option disabled>ไม่มีข้อมูลโต๊ะ</option>}
                            {tables.map((table) => (
                                <option key={table.id} value={table.id}>{table.name || `โต๊ะ ${table.id}`}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        จำนวนคน
                        <input name="number_of_guests" type="number" min="1" value={form.number_of_guests} onChange={handleChange} placeholder="จำนวนคน" required />
                    </label>
                    <label>
                        วันและเวลา
                        <input name="reservation_time" type="datetime-local" value={form.reservation_time} onChange={handleChange} required />
                    </label>
                    <label className="reserve-label">
                        สถานะ (status)
                        <div className="reserve-select-wrapper">
                            <select name="status" value={form.status} onChange={handleChange} required className="reserve-select">
                                <option value="">-- เลือกสถานะ --</option>
                                <option value="pending">รอยืนยัน</option>
                                <option value="confirmed">ยืนยันแล้ว</option>
                                <option value="cancelled">ยกเลิกการจอง</option>
                                <option value="other">อื่นๆ (ระบุในหมายเหตุ)</option>
                            </select>
                        </div>
                    </label>
                    <label>
                        หมายเหตุ (notes)
                        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)" rows={2} className="reserve-notes" />
                    </label>
                    <button type="submit" disabled={loading}>{loading ? 'กำลังจอง...' : 'จองโต๊ะ'}</button>
                </form>
                {success && <div className="reserve-success">✅ จองโต๊ะสำเร็จ!</div>}
                {error && <div className="reserve-error">{error}</div>}
            </div>
            <style>{`
        .reserve-bg { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(120deg, #e0e7ff 0%, #f0f2f5 100%); }
        .reserve-card { background: #fff; border-radius: 16px; box-shadow: 0 8px 32px rgba(24, 144, 255, 0.10), 0 1.5px 4px rgba(0,0,0,0.04); padding: 36px 28px 28px 28px; min-width: 340px; max-width: 98vw; }
        .reserve-header { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 18px; }
        .reserve-header svg { margin-bottom: 2px; }
        .reserve-header h2 { font-size: 1.3rem; font-weight: 600; color: #222; margin: 0; }
        .reserve-form { display: flex; flex-direction: column; gap: 14px; }
        .reserve-form label { font-size: 1rem; color: #333; display: flex; flex-direction: column; gap: 4px; font-weight: 500; }
        .reserve-form input, .reserve-form textarea, .reserve-select {
          padding: 10px;
          border-radius: 6px;
          border: 1.5px solid #d9d9d9;
          font-size: 1rem;
          background: #fafcff;
          transition: border 0.2s;
          font-family: inherit;
        }
        .reserve-form input:focus, .reserve-form textarea:focus, .reserve-select:focus {
          outline: none;
          border-color: #1890ff;
          background: #fff;
        }
        .reserve-select-wrapper {
          position: relative;
        }
        .reserve-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background: #fafcff url('data:image/svg+xml;utf8,<svg fill="%231890ff" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"/></svg>') no-repeat right 0.75rem center/1.2em auto;
          padding-right: 2.5em;
          cursor: pointer;
        }
        .reserve-notes {
          min-height: 38px;
          resize: vertical;
        }
        .reserve-form button { padding: 12px; border-radius: 6px; background: linear-gradient(90deg, #1890ff 60%, #40a9ff 100%); color: #fff; border: none; font-size: 1.1rem; font-weight: 500; cursor: pointer; margin-top: 8px; box-shadow: 0 2px 8px rgba(24,144,255,0.08); transition: background 0.2s, box-shadow 0.2s; }
        .reserve-form button:disabled { background: #b5d6fa; cursor: not-allowed; }
        .reserve-success { color: #52c41a; margin-top: 14px; text-align: center; font-size: 1.1rem; }
        .reserve-error { color: #ff4d4f; margin-top: 14px; text-align: center; font-size: 1.1rem; }
      `}</style>
        </div>
    );
}

export default ReserveTablePage;
