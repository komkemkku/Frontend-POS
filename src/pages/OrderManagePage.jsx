import React, { useEffect, useState, useRef } from 'react';
import { adminApi } from '../api';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../hooks/useAuth';
import './OrderManagePage.css';

function OrderManagePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, size: 20, total: 0 });
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); // อัปเดตทุก 15 วินาที
    return () => clearInterval(interval);
  }, [pagination.page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setError(null);
      const data = await adminApi.orders.getList();
      let filteredOrders = data || [];
      
      // Add fallback data if empty
      if (filteredOrders.length === 0) {
        const now = Date.now();
        const twoHoursAgo = now - (2 * 60 * 60 * 1000);
        const oneHourAgo = now - (1 * 60 * 60 * 1000);
        const thirtyMinutesAgo = now - (30 * 60 * 1000);
        const fifteenMinutesAgo = now - (15 * 60 * 1000);
        const fiveMinutesAgo = now - (5 * 60 * 1000);
        
        filteredOrders = [
          {
            id: 1,
            table_id: 2,
            table_number: 2,
            status: 'pending',
            total_amount: 450,
            created_at: Math.floor(fiveMinutesAgo / 1000), // Unix timestamp
            customer_name: 'คุณสมชาย',
            order_items: [
              { menu_name: 'ผัดไทย', quantity: 2, price: 120, unit_price: 60 },
              { menu_name: 'ต้มยำกุ้ง', quantity: 1, price: 180, unit_price: 180 },
              { menu_name: 'ข้าวเปล่า', quantity: 2, price: 30, unit_price: 15 }
            ]
          },
          {
            id: 2,
            table_id: 3,
            table_number: 3,
            status: 'preparing',
            total_amount: 520,
            created_at: Math.floor(fifteenMinutesAgo / 1000), // Unix timestamp
            customer_name: 'คุณสมหญิง',
            order_items: [
              { menu_name: 'ข้าวผัด', quantity: 2, price: 160, unit_price: 80 },
              { menu_name: 'แกงเขียวหวานไก่', quantity: 1, price: 120, unit_price: 120 },
              { menu_name: 'น้ำดื่ม', quantity: 3, price: 30, unit_price: 10 },
              { menu_name: 'มะม่วงน้ำปลาหวาน', quantity: 1, price: 85, unit_price: 85 }
            ]
          },
          {
            id: 3,
            table_id: 4,
            table_number: 4,
            status: 'ready',
            total_amount: 280,
            created_at: Math.floor(thirtyMinutesAgo / 1000), // Unix timestamp
            customer_name: 'คุณสมศักดิ์',
            order_items: [
              { menu_name: 'ส้มตำ', quantity: 2, price: 160, unit_price: 80 },
              { menu_name: 'ไก่ย่าง', quantity: 1, price: 120, unit_price: 120 }
            ]
          },
          {
            id: 4,
            table_id: 1,
            table_number: 1,
            status: 'served',
            total_amount: 340,
            created_at: Math.floor(oneHourAgo / 1000), // Unix timestamp
            customer_name: 'คุณมาลี',
            order_items: [
              { menu_name: 'ผัดกะเพรา', quantity: 2, price: 140, unit_price: 70 },
              { menu_name: 'ไข่ดาว', quantity: 2, price: 40, unit_price: 20 },
              { menu_name: 'น้ำส้มคั้น', quantity: 2, price: 60, unit_price: 30 },
              { menu_name: 'ข้าวเปล่า', quantity: 2, price: 30, unit_price: 15 }
            ]
          },
          {
            id: 5,
            table_id: 5,
            table_number: 5,
            status: 'completed',
            total_amount: 185,
            created_at: Math.floor(twoHoursAgo / 1000), // Unix timestamp
            customer_name: 'คุณณัฐ',
            order_items: [
              { menu_name: 'ข้าวมันไก่', quantity: 1, price: 50, unit_price: 50 },
              { menu_name: 'แกงจืดเต้าหู้', quantity: 1, price: 35, unit_price: 35 },
              { menu_name: 'โค้กเย็น', quantity: 2, price: 50, unit_price: 25 },
              { menu_name: 'ไอศกรีมวานิลลา', quantity: 1, price: 50, unit_price: 50 }
            ]
          }
        ];
      }
      
      // Convert Unix timestamps to Date objects for processing
      filteredOrders = filteredOrders.map(order => ({
        ...order,
        created_at_timestamp: order.created_at, // Keep original timestamp
        created_at: typeof order.created_at === 'number' 
          ? new Date(order.created_at * 1000).toISOString() 
          : order.created_at,
        table_number: order.table_number || order.table_id // Use table_number if available, fallback to table_id
      }));
      
      // Filter by search term
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
          order.id.toString().includes(searchTerm) ||
          order.table_id?.toString().includes(searchTerm) ||
          order.table_number?.toString().includes(searchTerm) ||
          order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by status
      if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
      }
      
      // Sort by created date (newest first)
      filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setOrders(filteredOrders);
      setPagination(prev => ({ ...prev, total: filteredOrders.length }));
    } catch (err) {
      console.error('Orders fetch error:', err);
      setError(`ไม่สามารถโหลดข้อมูลออเดอร์ได้: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await adminApi.orders.update(orderId, { status: newStatus });
      fetchOrders(); // รีเฟรชข้อมูล
    } catch (err) {
      console.error('Update order status error:', err);
      setError(`ไม่สามารถอัปเดตสถานะออเดอร์ได้: ${err.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-warning',
      'preparing': 'bg-primary', 
      'ready': 'bg-success',
      'served': 'bg-success',
      'completed': 'bg-success',
      'cancelled': 'bg-error'
    };
    return statusColors[status] || 'bg-secondary';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pending': 'รอดำเนินการ',
      'preparing': 'กำลังเตรียม',
      'ready': 'พร้อมเสิร์ฟ',
      'served': 'เสิร์ฟแล้ว',
      'completed': 'เสร็จสิ้น',
      'cancelled': 'ยกเลิก'
    };
    return statusTexts[status] || status;
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'pending': 'preparing',
      'preparing': 'ready',
      'ready': 'served',
      'served': 'completed'
    };
    return statusFlow[currentStatus];
  };

  const getNextStatusText = (currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    return nextStatus ? getStatusText(nextStatus) : null;
  };

  const canUpdateStatus = (status) => {
    return ['pending', 'preparing', 'ready', 'served'].includes(status);
  };

  // ฟังก์ชันแสดงเวลาแบบสัมพัทธ์
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'เพิ่งสั่ง';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} นาทีที่แล้ว`;
    } else if (diffInMinutes < 1440) { // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ชั่วโมงที่แล้ว`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} วันที่แล้ว`;
    }
  };

  // ฟังก์ชันแสดงเวลาแบบรายละเอียด
  const getDetailedTime = (dateString) => {
    return new Date(dateString).toLocaleString('th-TH', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <MainLayout>
      <div className="modern-order-page">
        {/* Modern Header */}
        <div className="modern-header">
          <div className="header-content">
            <div className="header-title-section">
              <div className="header-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 7L18 2H6L5 7H3V9H4.8L5.5 21H18.5L19.2 9H21V7H19ZM7 4H17L17.7 7H6.3L7 4Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <h1 className="header-title">จัดการออเดอร์</h1>
                <p className="header-subtitle">ติดตามและจัดการออเดอร์แบบเรียลไทม์</p>
              </div>
            </div>
            <button onClick={fetchOrders} className="refresh-btn" disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4V9H4.58L6.15 6.5C7.8 4.3 10.8 3.7 13.5 5.2C16.2 6.7 17.2 10.1 15.7 12.8C14.2 15.5 10.8 16.5 8.1 15C7.4 14.6 6.8 14 6.4 13.3L4.8 14.8C5.4 15.8 6.2 16.7 7.2 17.2C10.9 19.3 15.5 18 17.6 14.3C19.7 10.6 18.4 6 14.7 3.9C11 1.8 6.4 3.1 4.3 6.8L2.8 9H7V11H2V6H4V4Z" fill="currentColor"/>
              </svg>
              รีเฟรช
            </button>
          </div>
        </div>

        {/* Modern Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-number">{statusCounts.all}</div>
              <div className="stat-label">ออเดอร์ทั้งหมด</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-number">{statusCounts.pending}</div>
              <div className="stat-label">รอดำเนินการ</div>
            </div>
          </div>
          <div className="stat-card preparing">
            <div className="stat-icon">👨‍🍳</div>
            <div className="stat-info">
              <div className="stat-number">{statusCounts.preparing}</div>
              <div className="stat-label">กำลังเตรียม</div>
            </div>
          </div>
          <div className="stat-card ready">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">{statusCounts.ready}</div>
              <div className="stat-label">พร้อมเสิร์ฟ</div>
            </div>
          </div>
          <div className="stat-card served">
            <div className="stat-icon">🍽️</div>
            <div className="stat-info">
              <div className="stat-number">{statusCounts.served}</div>
              <div className="stat-label">เสิร์ฟแล้ว</div>
            </div>
          </div>
          <div className="stat-card completed">
            <div className="stat-icon">🎉</div>
            <div className="stat-info">
              <div className="stat-number">{statusCounts.completed}</div>
              <div className="stat-label">เสร็จสิ้น</div>
            </div>
          </div>
        </div>

        {/* Modern Search and Filter */}
        <div className="search-filter-card">
          <div className="search-section">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="ค้นหาออเดอร์ (ID, โต๊ะ, ชื่อลูกค้า)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-wrapper">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="preparing">กำลังเตรียม</option>
                <option value="ready">พร้อมเสิร์ฟ</option>
                <option value="served">เสิร์ฟแล้ว</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            <div className="error-icon">⚠️</div>
            <div>
              <h4 className="error-title">เกิดข้อผิดพลาด</h4>
              <p className="error-message">{error}</p>
            </div>
          </div>
        )}

        {/* Modern Orders Grid */}
        <div className="orders-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p className="loading-text">กำลังโหลดข้อมูลออเดอร์...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3 className="empty-title">ไม่มีออเดอร์</h3>
              <p className="empty-message">
                {searchTerm || statusFilter !== 'all' 
                  ? 'ไม่พบออเดอร์ที่ตรงกับเงื่อนไขการค้นหา' 
                  : 'ยังไม่มีออเดอร์ในระบบ รอลูกค้าสั่งอาหาร'}
              </p>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order.id} className={`order-card ${order.status} ${updatingOrderId === order.id ? 'updating' : ''}`}>
                  {/* Order Header */}
                  <div className="order-header">
                    <div className="order-basic-info">
                      <div className="order-id-badge">#{order.id}</div>
                      <div className="table-info">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                        </svg>
                        โต๊ะ {order.table_number}
                      </div>
                    </div>
                    <span className={`status-badge ${order.status}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* Order Meta Info */}
                  <div className="order-meta">
                    <div className="meta-item time-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
                      </svg>
                      <div className="time-display">
                        <span className="relative-time">{getRelativeTime(order.created_at)}</span>
                        <span className="detailed-time" title={getDetailedTime(order.created_at)}>
                          {new Date(order.created_at).toLocaleString('th-TH', { 
                            day: '2-digit',
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    {order.customer_name && (
                      <div className="meta-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                        </svg>
                        <span>{order.customer_name}</span>
                      </div>
                    )}
                    <div className="meta-item total-amount">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.5 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.5 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.5 11.8 10.9Z" fill="currentColor"/>
                      </svg>
                      <span>฿{order.total_amount?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Order Items Details */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="order-items-section">
                      <div className="section-header">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.06 22.99H1.94C1.28 22.99 0.729999 22.44 0.729999 21.78V2.21C0.729999 1.55 1.28 1 1.94 1H18.06C18.72 1 19.27 1.55 19.27 2.21V21.78C19.27 22.44 18.72 22.99 18.06 22.99ZM2.94 20.99H17.06V3H2.94V20.99Z" fill="currentColor"/>
                          <path d="M14.8 19V17H7.2V19H14.8ZM14.8 15V13H7.2V15H14.8ZM14.8 11V9H7.2V11H14.8ZM14.8 7V5H7.2V7H14.8Z" fill="currentColor"/>
                        </svg>
                        <span>รายการอาหาร ({order.order_items.length} รายการ)</span>
                      </div>
                      <div className="order-items-list">
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            <div className="item-main-info">
                              <div className="item-details">
                                <span className="item-name">{item.menu_name || item.name}</span>
                                <div className="item-pricing">
                                  <span className="unit-price">฿{(item.unit_price || item.price).toLocaleString()} × {item.quantity}</span>
                                </div>
                              </div>
                              <div className="item-quantity-badge">
                                <span className="quantity-number">{item.quantity}</span>
                                <span className="quantity-text">จาน</span>
                              </div>
                            </div>
                            <div className="item-total-price">
                              <span className="total-amount">฿{(item.price).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                        <div className="order-items-summary">
                          <div className="summary-line">
                            <span className="summary-label">รวม {order.order_items.length} รายการ</span>
                            <span className="summary-total">฿{order.total_amount?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="order-actions">
                    {canUpdateStatus(order.status) && getNextStatus(order.status) && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                        disabled={updatingOrderId === order.id}
                        className="action-btn primary"
                      >
                        {updatingOrderId === order.id ? (
                          <>
                            <div className="btn-spinner"></div>
                            กำลังอัปเดต...
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="currentColor"/>
                            </svg>
                            {getNextStatusText(order.status)}
                          </>
                        )}
                      </button>
                    )}
                    
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        disabled={updatingOrderId === order.id}
                        className="action-btn danger"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                        </svg>
                        ยกเลิก
                      </button>
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

function getStatusBorderClass(status) {
  const borderClasses = {
    'pending': 'border-l-4 border-yellow-400',
    'preparing': 'border-l-4 border-blue-400',
    'ready': 'border-l-4 border-green-400',
    'served': 'border-l-4 border-green-400',
    'completed': 'border-l-4 border-green-400',
    'cancelled': 'border-l-4 border-red-400'
  };
  return borderClasses[status] || 'border-l-4 border-gray-400';
}

export default OrderManagePage;
