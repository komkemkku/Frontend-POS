import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './PaymentPage.css';

function PaymentPage() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [bill, setBill] = useState(null);
  const [paying, setPaying] = useState(false);
  const [payType, setPayType] = useState('cash');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

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

  const handleTableSelect = async (e) => {
    setSelectedTable(e.target.value);
    setBill(null);
    setSuccess(false);
    setError(null);
    if (e.target.value) {
      try {
        const res = await axios.get(`/bills/table/${e.target.value}`);
        setBill(res.data?.data || null);
      } catch (e) {
        setBill(null);
        setError('ไม่พบข้อมูลบิลสำหรับโต๊ะนี้');
      }
    }
  };

  const handlePay = async () => {
    if (!bill) return;
    setPaying(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.post(`/bills/${bill.id}/pay`, { pay_type: payType });
      setSuccess(true);
    } catch (e) {
      setError('บันทึกการชำระเงินไม่สำเร็จ');
    } finally {
      setPaying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pay-bg">
      <div className="pay-container">
        <h2 className="pay-title">หน้าชำระเงิน</h2>
        <label className="pay-label">
          เลือกโต๊ะ
          <select value={selectedTable} onChange={handleTableSelect} className="pay-select">
            <option value="">-- เลือกโต๊ะ --</option>
            {tables.map((t) => (
              <option key={t.id} value={t.id}>{t.name || `โต๊ะ ${t.id}`}</option>
            ))}
          </select>
        </label>
        {bill && (
          <div className="pay-bill">
            <div className="pay-bill-title">บิลโต๊ะ {bill.table_id}</div>
            <div className="pay-bill-items">
              {bill.items?.map((item, idx) => (
                <div key={idx} className="pay-bill-item">{item.name} x {item.qty} <span>{item.price * item.qty} บาท</span></div>
              ))}
            </div>
            <div className="pay-bill-total">รวมทั้งสิ้น: <b>{bill.total} บาท</b></div>
            <div className="pay-paytype">
              <label><input type="radio" name="paytype" value="cash" checked={payType==='cash'} onChange={()=>setPayType('cash')} /> เงินสด</label>
              <label><input type="radio" name="paytype" value="qr" checked={payType==='qr'} onChange={()=>setPayType('qr')} /> QR</label>
            </div>
            <button className="pay-btn" onClick={handlePay} disabled={paying || success}>{paying ? 'กำลังบันทึก...' : 'บันทึกการชำระเงิน'}</button>
            {success && <button className="pay-btn print-btn" onClick={handlePrint}>พิมพ์ใบเสร็จ</button>}
          </div>
        )}
        {error && <div className="pay-error">{error}</div>}
        {success && <div className="pay-success">✅ ชำระเงินสำเร็จ!</div>}
      </div>
    </div>
  );
}

export default PaymentPage;
