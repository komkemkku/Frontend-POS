import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import './OrderManagePage.css';
import MainLayout from '../components/MainLayout';

function OrderManagePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    // Initial fetch
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/orders');
        setOrders(res.data?.data || []);
      } catch (e) {
        setError('ไม่สามารถโหลดข้อมูลออเดอร์ได้');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    // WebSocket for real-time
    ws.current = new window.WebSocket('ws://localhost:8080/ws/orders');
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOrders((prev) => {
        // Replace or add new order
        const idx = prev.findIndex((o) => o.id === data.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = data;
          return updated;
        }
        return [data, ...prev];
      });
    };
    return () => ws.current && ws.current.close();
  }, []);

  const handleStatusChange = async (order, nextStatus) => {
    try {
      await axios.put(`/orders/${order.id}/status`, { status: nextStatus });
      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: nextStatus } : o));
    } catch (e) {
      alert('เปลี่ยนสถานะไม่สำเร็จ');
    }
  };

  return (
    <MainLayout>
      <div className="order-bg">
        <div className="order-container">
          <h2 className="order-title">รายการออเดอร์ (Real-time)</h2>
          {loading ? (
            <div className="order-loading">กำลังโหลด...</div>
          ) : error ? (
            <div className="order-error">{error}</div>
          ) : (
            <div className="order-list">
              {orders.length === 0 && <div className="order-empty">ไม่มีออเดอร์ใหม่</div>}
              {orders.map((order) => (
                <div key={order.id} className={`order-card order-status-${order.status}`}>
                  <div className="order-table">โต๊ะ {order.table_id}</div>
                  <div className="order-items">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="order-item">{item.name} x {item.qty}</div>
                    ))}
                  </div>
                  <div className="order-status">{renderOrderStatus(order.status)}</div>
                  <div className="order-actions">
                    {order.status === 'pending' && (
                      <button onClick={() => handleStatusChange(order, 'cooking')}>เริ่มทำ</button>
                    )}
                    {order.status === 'cooking' && (
                      <button onClick={() => handleStatusChange(order, 'ready')}>พร้อมเสิร์ฟ</button>
                    )}
                    {order.status === 'ready' && (
                      <button onClick={() => handleStatusChange(order, 'served')}>เสิร์ฟแล้ว</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function renderOrderStatus(status) {
  switch (status) {
    case 'pending': return <span className="order-status-pending">รอทำ</span>;
    case 'cooking': return <span className="order-status-cooking">กำลังทำ</span>;
    case 'ready': return <span className="order-status-ready">พร้อมเสิร์ฟ</span>;
    case 'served': return <span className="order-status-served">เสิร์ฟแล้ว</span>;
    default: return <span>{status}</span>;
  }
}

export default OrderManagePage;
