import React, { useEffect, useState, useRef } from 'react';
import axios from '../api/axios';
import './OrderManagePage.css';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../hooks/useAuth';

function OrderManagePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const { user } = useAuth();
  const ws = useRef(null);

  useEffect(() => {
    fetchOrders();
    // อัปเดตข้อมูลทุก 30 วินาที
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [pagination.page, pagination.size, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setError(null);
      console.log('Fetching orders...');
      
      const params = new URLSearchParams({
        page: pagination.page,
        size: pagination.size,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const response = await axios.get(`/orders?${params}`);
      console.log('Orders response:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0
        }));
      } else {
        throw new Error(response.data.message || 'ไม่สามารถโหลดข้อมูลออเดอร์ได้');
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
      setError(`ไม่สามารถโหลดข้อมูลออเดอร์ได้: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (order, nextStatus) => {
    setUpdatingOrderId(order.id);
    
    try {
      console.log(`Updating order ${order.id} status to:`, nextStatus);
      
      // ใช้ API ใหม่สำหรับอัปเดตสถานะ
      const response = await axios.patch(`/staff/orders/${order.id}/status`, {
        status: nextStatus
      });
      
      console.log('Status update response:', response.data);
      
      if (response.data.success) {
        // อัปเดตออเดอร์ในรายการ
        setOrders(prev => prev.map(o => 
          o.id === order.id 
            ? { ...o, status: nextStatus, updated_at: Date.now() }
            : o
        ));
        
        // แสดงข้อความสำเร็จ
        alert(`อัปเดตสถานะออเดอร์ #${order.id} เป็น "${getStatusText(nextStatus)}" แล้ว`);
      } else {
        throw new Error(response.data.message || 'ไม่สามารถอัปเดตสถานะได้');
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert(`ไม่สามารถอัปเดตสถานะได้: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = async (order, reason = '') => {
    if (!confirm(`ยืนยันการยกเลิกออเดอร์ #${order.id}?`)) return;
    
    setUpdatingOrderId(order.id);
    
    try {
      const response = await axios.post(`/staff/orders/cancel/${order.id}/table/${order.qr_code_identifier || order.table_id}`, {}, {
        params: { reason }
      });
      
      if (response.data.success) {
        setOrders(prev => prev.map(o => 
          o.id === order.id 
            ? { ...o, status: 'cancelled', updated_at: Date.now() }
            : o
        ));
        alert(`ยกเลิกออเดอร์ #${order.id} แล้ว`);
      }
    } catch (err) {
      alert(`ไม่สามารถยกเลิกออเดอร์ได้: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleClearTable = async (qrCode) => {
    if (!confirm(`ยืนยันการล้างประวัติโต๊ะ ${qrCode}?`)) return;
    
    try {
      const response = await axios.post(`/staff/orders/clear-table/${qrCode}`);
      
      if (response.data.success) {
        // รีเฟรชข้อมูลออเดอร์
        await fetchOrders();
        alert(`ล้างประวัติโต๊ะ ${qrCode} แล้ว`);
      }
    } catch (err) {
      alert(`ไม่สามารถล้างประวัติโต๊ะได้: ${err.response?.data?.message || err.message}`);
    }
  };

  // Helper functions
  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'รอดำเนินการ',
      'confirmed': 'ยืนยันแล้ว',
      'preparing': 'กำลังเตรียม',
      'ready': 'พร้อมเสิร์ฟ',
      'served': 'เสิร์ฟแล้ว',
      'paid': 'ชำระแล้ว',
      'cancelled': 'ยกเลิก'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': '#ffa500',
      'confirmed': '#2196f3',
      'preparing': '#ff9800',
      'ready': '#4caf50',
      'served': '#9c27b0',
      'paid': '#8bc34a',
      'cancelled': '#f44336'
    };
    return colorMap[status] || '#666';
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusFlow = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['preparing', 'cancelled'],
      'preparing': ['ready', 'cancelled'],
      'ready': ['served'],
      'served': ['paid'],
      'paid': [],
      'cancelled': []
    };
    return statusFlow[currentStatus] || [];
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.id.toString().includes(searchTerm) ||
      order.table_number?.toString().includes(searchTerm) ||
      order.qr_code_identifier?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="order-bg">
        <div className="order-container">
          <div className="order-header">
            <h2 className="order-title">จัดการออเดอร์</h2>
            <div className="order-user-info">
              <span>พนักงาน: {user?.first_name} {user?.last_name}</span>
            </div>
          </div>

          {/* ฟิลเตอร์และค้นหา */}
          <div className="order-filters">
            <div className="filter-group">
              <input
                type="text"
                placeholder="ค้นหาออเดอร์ (ID, โต๊ะ, QR Code)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="confirmed">ยืนยันแล้ว</option>
                <option value="preparing">กำลังเตรียม</option>
                <option value="ready">พร้อมเสิร์ฟ</option>
                <option value="served">เสิร์ฟแล้ว</option>
                <option value="paid">ชำระแล้ว</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
            <button onClick={fetchOrders} className="refresh-btn">
              🔄 รีเฟรช
            </button>
          </div>

          <div className="order-content">
            {loading ? (
              <div className="order-loading">
                <div className="loading-spinner"></div>
                <p>กำลังโหลดออเดอร์...</p>
              </div>
            ) : error ? (
              <div className="order-error">
                <h3>⚠️ เกิดข้อผิดพลาด</h3>
                <p>{error}</p>
                <button onClick={fetchOrders} className="retry-btn">ลองใหม่</button>
              </div>
            ) : (
              <div className="order-list">
                {filteredOrders.map((order) => (
                <div key={order.id} className={`order-card order-status-${order.status} ${updatingOrderId === order.id ? 'updating' : ''}`}>
                  <div className="order-header">
                    <div className="order-info">
                      <div className="order-table">โต๊ะ {order.table_number || order.qr_code_identifier}</div>
                      <div className="order-id">ออเดอร์ #{order.id}</div>
                      <div className="order-time">
                        {new Date((order.created_at || Date.now() / 1000) * 1000).toLocaleString('th-TH')}
                      </div>
                    </div>
                    <div className="order-status-info">
                      <div className="current-status" style={{color: getStatusColor(order.status)}}>
                        {getStatusText(order.status)}
                      </div>
                      <div className="order-total">฿{order.total_amount}</div>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    <h4>🍽️ รายการอาหาร:</h4>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <div className="item-info">
                            <span className="item-name">{item.name || `เมนู ID: ${item.menu_item_id}`}</span>
                            <span className="item-quantity">x{item.quantity || item.qty}</span>
                          </div>
                          <span className="item-total">
                            ฿{item.sub_total || (item.price_per_item * (item.quantity || item.qty)) || 0}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="no-items">ไม่มีรายการอาหาร</div>
                    )}
                  </div>

                  <div className="order-actions">
                    <div className="status-actions">
                      <label>เปลี่ยนสถานะ:</label>
                      <div className="status-buttons">
                        {getNextStatusOptions(order.status).map(nextStatus => (
                          <button
                            key={nextStatus}
                            onClick={() => handleStatusChange(order, nextStatus)}
                            disabled={updatingOrderId === order.id}
                            className={`status-btn status-btn-${nextStatus}`}
                            style={{backgroundColor: getStatusColor(nextStatus)}}
                          >
                            {updatingOrderId === order.id ? '⏳' : getStatusText(nextStatus)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="order-tools">
                      {order.status !== 'cancelled' && order.status !== 'paid' && (
                        <button
                          onClick={() => handleCancelOrder(order, 'ยกเลิกโดยพนักงาน')}
                          disabled={updatingOrderId === order.id}
                          className="cancel-btn"
                        >
                          ❌ ยกเลิก
                        </button>
                      )}
                      
                      {order.status === 'paid' && (
                        <button
                          onClick={() => handleClearTable(order.qr_code_identifier || order.table_number)}
                          className="clear-table-btn"
                        >
                          🧹 ล้างโต๊ะ
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredOrders.length === 0 && (
                <div className="no-orders">
                  <h3>ไม่มีออเดอร์</h3>
                  <p>ไม่พบออเดอร์ที่ตรงกับเงื่อนไขการค้นหา</p>
                </div>
              )}

              {/* Pagination */}
              <div className="pagination">
                <button
                  onClick={() => setPagination(prev => ({...prev, page: Math.max(1, prev.page - 1)}))}
                  disabled={pagination.page <= 1}
                  className="pagination-btn"
                >
                  ← ก่อนหน้า
                </button>
                
                <span className="pagination-info">
                  หน้า {pagination.page} จาก {Math.ceil(pagination.total / pagination.size)}
                  ({pagination.total} รายการ)
                </span>
                
                <button
                  onClick={() => setPagination(prev => ({...prev, page: prev.page + 1}))}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.size)}
                  className="pagination-btn"
                >
                  ถัดไป →
                </button>
              </div>
              </div>
            )}
          </div>
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
