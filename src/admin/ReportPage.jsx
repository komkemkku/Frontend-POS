import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './ReportPage.css';

function ReportPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/payments'); // ตัวอย่าง: ดึงข้อมูล payment summary (ควรแก้ endpoint ตาม backend จริง)
      setSummary(res.data.data);
      setError(null);
    } catch {
      setError('โหลดรายงานไม่สำเร็จ');
    }
    setLoading(false);
  };

  return (
    <div className="report-page">
      <h2>รายงานสรุปยอดขาย</h2>
      {error && <div className="report-error">{error}</div>}
      {loading ? <div className="report-loading">กำลังโหลด...</div> : summary && (
        <>
          <div className="report-summary">
            <div>ยอดขายวันนี้: <b>{summary.today_sales} บาท</b></div>
            <div>ยอดขายสัปดาห์นี้: <b>{summary.week_sales} บาท</b></div>
            <div>ยอดขายเดือนนี้: <b>{summary.month_sales} บาท</b></div>
          </div>
          <div className="report-chart-wrap">
            {/* สามารถใช้ chart library เช่น Chart.js, Recharts ได้ */}
            <img src="/chart-demo.png" alt="chart demo" style={{width:'100%',maxWidth:500}} />
          </div>
          <div className="report-topmenu">
            <h3>เมนูขายดี</h3>
            <table className="report-topmenu-table">
              <thead>
                <tr>
                  <th>ชื่อเมนู</th>
                  <th>จำนวนที่ขาย</th>
                </tr>
              </thead>
              <tbody>
                {summary.top_menus?.map((m) => (
                  <tr key={m.name}>
                    <td>{m.name}</td>
                    <td>{m.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default ReportPage;
