import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import './ReservationPage.css';

function ReservationPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/reservations');
      setReservations(res.data.data || []);
      setError(null);
    } catch {
      setError('โหลดข้อมูลการจองไม่สำเร็จ');
    }
    setLoading(false);
  };

  const handleStatus = async (id, status) => {
    await axios.put(`/admin/reservations/${id}/status`, { status });
    fetchReservations();
  };

  return (
    <div className="reservation-page">
      <h2>การจองโต๊ะ</h2>
      {error && <div className="reservation-error">{error}</div>}
      <div className="reservation-table-wrap">
        {loading ? <div className="reservation-loading">กำลังโหลด...</div> : (
          <table className="reservation-table">
            <thead>
              <tr>
                <th>โต๊ะ</th>
                <th>เวลา</th>
                <th>สถานะ</th>
                <th>หมายเหตุ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.table_name || r.table_id}</td>
                  <td>{new Date(r.reservation_time * 1000).toLocaleString()}</td>
                  <td>{renderStatus(r.status)}</td>
                  <td>{r.notes}</td>
                  <td>
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatus(r.id, 'confirmed')} className="reservation-confirm-btn">ยืนยัน</button>
                        <button onClick={() => handleStatus(r.id, 'cancelled')} className="reservation-cancel-btn">ยกเลิก</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && <tr><td colSpan={5} style={{textAlign:'center'}}>ไม่มีการจอง</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function renderStatus(status) {
  switch (status) {
    case 'pending': return <span className="reservation-status-pending">รอ</span>;
    case 'confirmed': return <span className="reservation-status-confirmed">ยืนยันแล้ว</span>;
    case 'cancelled': return <span className="reservation-status-cancelled">ยกเลิก</span>;
    default: return <span>{status}</span>;
  }
}

export default ReservationPage;
