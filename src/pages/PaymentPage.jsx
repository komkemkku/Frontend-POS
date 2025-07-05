import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';
import MainLayout from '../components/MainLayout';
import './PaymentPage.css';

function PaymentPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastPayment, setLastPayment] = useState(null);

  // เพิ่มตัวแปรสำหรับแสดงสถานะการเชื่อมต่อ API
  const [apiStatus, setApiStatus] = useState({
    connected: false,
    lastChecked: null,
    error: null
  });

  useEffect(() => {
    fetchOrdersForPayment();
    const interval = setInterval(fetchOrdersForPayment, 30000);
    return () => clearInterval(interval);
  }, []);

  // ฟังก์ชันตรวจสอบการเชื่อมต่อ API
  const checkApiConnection = async () => {
    try {
      await adminApi.health.check();
      setApiStatus({
        connected: true,
        lastChecked: new Date(),
        error: null
      });
    } catch (err) {
      setApiStatus({
        connected: false,
        lastChecked: new Date(),
        error: err.message
      });
    }
  };

  // ตรวจสอบการเชื่อมต่อเมื่อ component โหลด
  useEffect(() => {
    checkApiConnection();
    const healthCheckInterval = setInterval(checkApiConnection, 60000); // ตรวจสอบทุก 1 นาที
    return () => clearInterval(healthCheckInterval);
  }, []);

  const fetchOrdersForPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching orders from API...');
      const data = await adminApi.orders.getList();
      console.log('Raw orders data:', data);
      
      // กรองแค่ออเดอร์ที่เสิร์ฟแล้วเท่านั้น (ไม่รวม completed เพราะชำระแล้ว)
      let payableOrders = (Array.isArray(data) ? data : []).filter(order => 
        order.status === 'served'
      );
      
      console.log('Filtered served orders:', payableOrders);
      
      // Map field names to ensure consistency
      payableOrders = payableOrders.map(order => ({
        ...order,
        id: order.id,
        table_number: order.table_number || order.tableNumber || order.table_id,
        total_amount: parseFloat(order.total_amount || order.totalAmount || 0),
        created_at: typeof order.created_at === 'number' 
          ? new Date(order.created_at * 1000).toISOString() 
          : order.created_at,
        customer_name: order.customer_name || order.customerName || 'ลูกค้าทั่วไป',
        order_items: order.order_items || order.orderItems || order.items || []
      }));
      
      console.log('Mapped orders:', payableOrders);
      
      // Add fallback data ONLY if completely empty and in development
      if (payableOrders.length === 0 && process.env.NODE_ENV === 'development') {
        console.log('No served orders found, adding fallback data for development');
        const now = Math.floor(Date.now() / 1000);
        const oneHourAgo = now - (1 * 60 * 60);
        const thirtyMinutesAgo = now - (30 * 60);
        
        payableOrders = [
          {
            id: 999,
            table_id: 5,
            table_number: 5,
            status: 'served',
            total_amount: 580,
            created_at: new Date(oneHourAgo * 1000).toISOString(),
            customer_name: 'คุณสมพร (Demo)',
            order_items: [
              { menu_name: 'ผัดกะเพรา', quantity: 1, price: 120, unit_price: 120 },
              { menu_name: 'แกงเขียวหวาน', quantity: 1, price: 160, unit_price: 160 },
              { menu_name: 'ข้าวเปล่า', quantity: 3, price: 100, unit_price: 33 },
              { menu_name: 'น้ำใส', quantity: 2, price: 200, unit_price: 100 }
            ]
          }
        ];
      }
      
      setOrders(payableOrders);
      console.log('Final orders set:', payableOrders);
      
    } catch (err) {
      console.error('Orders fetch error:', err);
      setError(`ไม่สามารถโหลดออเดอร์ได้: ${err.response?.data?.message || err.message}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = async (orderId) => {
    setSelectedOrder(orderId);
    setSuccess(false);
    setError(null);
    setShowReceipt(false);
    
    if (!orderId) {
      setOrderDetails(null);
      return;
    }

    try {
      console.log('Fetching order details for ID:', orderId);
      
      // Try to get order details from API first
      const orderData = await adminApi.orders.getById(orderId);
      console.log('Order details from API:', orderData);
      
      // Map field names for consistency
      const mappedOrderData = {
        ...orderData,
        id: orderData.id,
        table_number: orderData.table_number || orderData.tableNumber || orderData.table_id,
        total_amount: parseFloat(orderData.total_amount || orderData.totalAmount || 0),
        created_at: typeof orderData.created_at === 'number' 
          ? new Date(orderData.created_at * 1000).toISOString() 
          : orderData.created_at,
        customer_name: orderData.customer_name || orderData.customerName || 'ลูกค้าทั่วไป',
        order_items: (orderData.order_items || orderData.orderItems || orderData.items || []).map(item => ({
          ...item,
          menu_name: item.menu_name || item.menuName || item.name,
          quantity: parseInt(item.quantity || 1),
          price: parseFloat(item.price || item.unitPrice || 0),
          unit_price: parseFloat(item.unit_price || item.unitPrice || item.price || 0)
        }))
      };
      
      console.log('Mapped order data:', mappedOrderData);
      
      setOrderDetails(mappedOrderData);
      setReceivedAmount(mappedOrderData.total_amount?.toString() || '');
      setDiscount(0);
      
    } catch (err) {
      console.error('Order details fetch error:', err);
      
      // If API fails, use data from orders list as fallback
      const fallbackOrder = orders.find(order => order.id === parseInt(orderId));
      if (fallbackOrder) {
        console.log('Using fallback order:', fallbackOrder);
        setOrderDetails(fallbackOrder);
        setReceivedAmount(fallbackOrder.total_amount?.toString() || '');
        setDiscount(0);
      } else {
        setError(`ไม่สามารถโหลดรายละเอียดออเดอร์ได้: ${err.response?.data?.message || err.message}`);
        setOrderDetails(null);
      }
    }
  };

  const handlePayment = async () => {
    if (!orderDetails) return;

    setPaying(true);
    setError(null);
    
    try {
      const totalAfterDiscount = orderDetails.total_amount - discount;
      const received = parseFloat(receivedAmount) || 0;
      
      if (paymentMethod === 'cash' && received < totalAfterDiscount) {
        setError('จำนวนเงินที่รับไม่เพียงพอ');
        setPaying(false);
        return;
      }

      // สร้าง payment data ตาม API format ของ Backend
      const paymentData = {
        order_id: orderDetails.id,
        amount_paid: totalAfterDiscount,
        payment_method: paymentMethod,
        transaction_time: new Date().toISOString()
      };
      
      console.log('Creating payment with data:', paymentData);
      
      // Create payment record ผ่าน API จริง
      const paymentResult = await adminApi.payments.create(paymentData);
      console.log('Payment result:', paymentResult);
      
      // Update order status to completed ผ่าน API จริง
      await adminApi.orders.update(orderDetails.id, { status: 'completed' });
      console.log('Order status updated to completed');
      
      // Store payment info for receipt
      setLastPayment({
        ...paymentData,
        received_amount: received,
        change_amount: paymentMethod === 'cash' ? Math.max(0, received - totalAfterDiscount) : 0,
        discount: discount,
        order: orderDetails,
        payment_id: paymentResult?.id || Date.now(),
        timestamp: new Date()
      });
      
      setSuccess(true);
      setShowReceipt(true);
      setSelectedOrder('');
      setOrderDetails(null);
      setReceivedAmount('');
      setDiscount(0);
      
      // Refresh orders list
      await fetchOrdersForPayment();
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(`การชำระเงินไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    } finally {
      setPaying(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      'cash': '💵',
      'credit_card': '💳',
      'bank_transfer': '🏦',
      'qr_code': '📱',
      'e_wallet': '📲'
    };
    return icons[method] || '💰';
  };

  const getPaymentMethodText = (method) => {
    const texts = {
      'cash': 'เงินสด',
      'credit_card': 'บัตรเครดิต',
      'bank_transfer': 'โอนเงิน',
      'qr_code': 'QR Code',
      'e_wallet': 'E-Wallet'
    };
    return texts[method] || method;
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

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const orderTime = typeof dateString === 'number' ? new Date(dateString * 1000) : new Date(dateString);
    const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'เพิ่งสั่ง';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} นาทีที่แล้ว`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ชั่วโมงที่แล้ว`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} วันที่แล้ว`;
    }
  };

  const totalAfterDiscount = orderDetails ? orderDetails.total_amount - discount : 0;
  const changeAmount = paymentMethod === 'cash' && receivedAmount ? 
    Math.max(0, parseFloat(receivedAmount) - totalAfterDiscount) : 0;

  const printReceipt = () => {
    if (!lastPayment) return;
    
    const printWindow = window.open('', '', 'width=300,height=600');
    const receiptHtml = `
      <html>
        <head>
          <title>ใบเสร็จรับเงิน</title>
          <style>
            body { font-family: monospace; font-size: 12px; margin: 10px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 5px 0; }
            .total { font-size: 14px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="center bold">ร้านอาหาร POS</div>
          <div class="center">ใบเสร็จรับเงิน</div>
          <div class="line"></div>
          <div>เลขที่: ${lastPayment.payment_id}</div>
          <div>วันที่: ${lastPayment.timestamp.toLocaleString('th-TH')}</div>
          <div>โต๊ะ: ${lastPayment.order.table_number}</div>
          <div>ลูกค้า: ${lastPayment.order.customer_name}</div>
          <div class="line"></div>
          ${lastPayment.order.order_items.map(item => 
            `<div>${item.menu_name} x${item.quantity} = ฿${item.price.toLocaleString()}</div>`
          ).join('')}
          <div class="line"></div>
          <div>รวม: ฿${lastPayment.order.total_amount.toLocaleString()}</div>
          ${lastPayment.discount > 0 ? `<div>ส่วนลด: -฿${lastPayment.discount.toLocaleString()}</div>` : ''}
          <div class="total">ยอดชำระ: ฿${(lastPayment.amount || lastPayment.amount_paid).toLocaleString()}</div>
          <div>วิธีชำระ: ${getPaymentMethodText(lastPayment.payment_method)}</div>
          ${lastPayment.payment_method === 'cash' ? `
            <div>รับเงิน: ฿${lastPayment.received_amount.toLocaleString()}</div>
            <div>เงินทอน: ฿${lastPayment.change_amount.toLocaleString()}</div>
          ` : ''}
          <div class="line"></div>
          <div class="center">ขอบคุณที่ใช้บริการ</div>
        </body>
      </html>
    `;
    
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <MainLayout>
      <div className="modern-payment-page">
        {/* Modern Header */}
        <div className="modern-header">
          <div className="header-content">
            <div className="header-title-section">
              <div className="header-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 18C15.89 18 15 18.89 15 20C15 21.11 15.89 22 17 22C18.11 22 19 21.11 19 20C19 18.89 18.11 18 17 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.11 5.89 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.58 17.3 11.97L20.88 5H5.21L4.27 3H1M7 18C5.89 18 5 18.89 5 20C5 21.11 5.89 22 7 22C8.11 22 9 21.11 9 20C9 18.89 8.11 18 7 18Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <h1 className="header-title">ชำระเงิน</h1>
                <p className="header-subtitle">จัดการการชำระเงินและพิมพ์ใบเสร็จ</p>
              </div>
            </div>
            <div className="header-actions">
              {/* API Status Indicator */}
              <div className={`api-status ${apiStatus.connected ? 'connected' : 'disconnected'}`}>
                <span className="status-dot"></span>
                <span className="status-text">
                  {apiStatus.connected ? 'API เชื่อมต่อ' : 'API ขาดการเชื่อมต่อ'}
                </span>
              </div>
              <button onClick={fetchOrdersForPayment} className="refresh-btn" disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4V9H4.58L6.15 6.5C7.8 4.3 10.8 3.7 13.5 5.2C16.2 6.7 17.2 10.1 15.7 12.8C14.2 15.5 10.8 16.5 8.1 15C7.4 14.6 6.8 14 6.4 13.3L4.8 14.8C5.4 15.8 6.2 16.7 7.2 17.2C10.9 19.3 15.5 18 17.6 14.3C19.7 10.6 18.4 6 14.7 3.9C11 1.8 6.4 3.1 4.3 6.8L2.8 9H7V11H2V6H4V4Z" fill="currentColor"/>
                </svg>
                รีเฟรช
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-alert">
            <div className="success-icon">✅</div>
            <div>
              <h4 className="success-title">ชำระเงินสำเร็จ!</h4>
              <p className="success-message">ออเดอร์ได้รับการชำระเงินเรียบร้อยแล้ว</p>
              {showReceipt && (
                <button onClick={printReceipt} className="print-receipt-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 3V1C18 0.45 17.55 0 17 0H7C6.45 0 6 0.45 6 1V3H4C2.9 3 2 3.9 2 5V15C2 16.1 2.9 17 4 17H6V21C6 21.55 6.45 22 7 22H17C17.55 22 18 21.55 18 21V17H20C21.1 17 22 16.1 22 15V5C22 3.9 21.1 3 20 3H18ZM8 2H16V3H8V2ZM16 20H8V16H16V20ZM18 15H16V14C16 13.45 15.55 13 15 13H9C8.45 13 8 13.45 8 14V15H6V5H18V15Z" fill="currentColor"/>
                  </svg>
                  พิมพ์ใบเสร็จ
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="error-alert">
            <div className="error-icon">⚠️</div>
            <div>
              <h4 className="error-title">เกิดข้อผิดพลาด</h4>
              <p className="error-message">{error}</p>
            </div>
          </div>
        )}

        <div className="payment-grid">
          {/* Orders List */}
          <div className="orders-section">
            <div className="section-header">
              <h3 className="section-title">เลือกออเดอร์ที่ต้องการชำระเงิน</h3>
              <div className="orders-count">
                {orders.length} ออเดอร์
              </div>
            </div>
            
            <div className="orders-container">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">กำลังโหลดข้อมูลออเดอร์...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💳</div>
                  <h3 className="empty-title">ไม่มีออเดอร์ที่ต้องชำระเงิน</h3>
                  <p className="empty-message">ออเดอร์ที่พร้อมชำระเงินจะแสดงที่นี่</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => handleOrderSelect(order.id)}
                      className={`order-card ${selectedOrder === order.id ? 'selected' : ''}`}
                    >
                      <div className="order-header">
                        <div className="order-info">
                          <div className="order-id">ออเดอร์ #{order.id}</div>
                          <div className="table-info">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                            </svg>
                            โต๊ะ {order.table_number}
                          </div>
                        </div>
                        <div className="order-amount">
                          ฿{order.total_amount?.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="order-meta">
                        <div className="order-time">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
                          </svg>
                          {getRelativeTime(order.created_at)}
                        </div>
                        <div className="order-customer">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                          </svg>
                          {order.customer_name}
                        </div>
                        <div className="order-status">
                          <span className={`status-badge ${order.status}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="order-items-preview">
                        <span className="items-count">
                          {order.order_items?.length || 0} รายการ
                        </span>
                        <div className="items-list">
                          {(order.order_items || []).slice(0, 2).map((item, idx) => (
                            <span key={idx} className="item-name">
                              {item.menu_name} x{item.quantity}
                            </span>
                          ))}
                          {(order.order_items || []).length > 2 && (
                            <span className="more-items">
                              และอีก {(order.order_items || []).length - 2} รายการ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="payment-section">
            <div className="section-header">
              <h3 className="section-title">รายละเอียดการชำระเงิน</h3>
            </div>
            
            {!orderDetails ? (
              <div className="payment-placeholder">
                <div className="placeholder-icon">👆</div>
                <h3 className="placeholder-title">เลือกออเดอร์เพื่อชำระเงิน</h3>
                <p className="placeholder-message">กรุณาเลือกออเดอร์จากรายการด้านซ้าย</p>
              </div>
            ) : (
              <div className="payment-details">
                {/* Order Summary */}
                <div className="order-summary">
                  <div className="summary-header">
                    <h4 className="summary-title">ออเดอร์ #{orderDetails.id}</h4>
                    <div className="summary-info">
                      <div className="info-item">
                        <span className="info-label">โต๊ะ:</span>
                        <span className="info-value">{orderDetails.table_number}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">ลูกค้า:</span>
                        <span className="info-value">{orderDetails.customer_name}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">เวลา:</span>
                        <span className="info-value">{getRelativeTime(orderDetails.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="order-items">
                    <h5 className="items-title">รายการอาหาร</h5>
                    <div className="items-list">
                      {(orderDetails.order_items || []).map((item, idx) => (
                        <div key={idx} className="item-row">
                          <div className="item-details">
                            <span className="item-name">{item.menu_name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                          <span className="item-price">฿{item.price?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="items-total">
                      <span className="total-label">ยอดรวม:</span>
                      <span className="total-amount">฿{orderDetails.total_amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="payment-method">
                  <h5 className="method-title">วิธีการชำระเงิน</h5>
                  <div className="method-grid">
                    {['cash', 'credit_card', 'bank_transfer', 'qr_code', 'e_wallet'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`method-btn ${paymentMethod === method ? 'active' : ''}`}
                      >
                        <div className="method-icon">{getPaymentMethodIcon(method)}</div>
                        <div className="method-text">{getPaymentMethodText(method)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount */}
                <div className="discount-section">
                  <label className="discount-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z" fill="currentColor"/>
                    </svg>
                    ส่วนลด (บาท)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={orderDetails.total_amount}
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="discount-input"
                    placeholder="0"
                  />
                </div>

                {/* Cash Payment */}
                {paymentMethod === 'cash' && (
                  <div className="cash-section">
                    <label className="cash-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 6C5.55 6 6 5.55 6 5S5.55 4 5 4 4 4.45 4 5 4.45 6 5 6M5 8C5.55 8 6 7.55 6 7S5.55 6 5 6 4 6.45 4 7 4.45 8 5 8M7 5C7 5.55 7.45 6 8 6S9 5.55 9 5 8.55 4 8 4 7 4.45 7 5M7 7C7 7.55 7.45 8 8 8S9 7.55 9 7 8.55 6 8 6 7 6.45 7 7M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                      </svg>
                      จำนวนเงินที่รับ
                    </label>
                    <input
                      type="number"
                      min={totalAfterDiscount}
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      className="cash-input"
                      placeholder={totalAfterDiscount.toString()}
                    />
                    <div className="quick-amounts">
                      {[totalAfterDiscount, Math.ceil(totalAfterDiscount / 100) * 100, Math.ceil(totalAfterDiscount / 500) * 500, Math.ceil(totalAfterDiscount / 1000) * 1000].filter((amount, index, arr) => arr.indexOf(amount) === index).map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setReceivedAmount(amount.toString())}
                          className="quick-amount-btn"
                        >
                          ฿{amount.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Summary */}
                <div className="payment-summary">
                  <div className="summary-row">
                    <span className="summary-label">ยอดรวม:</span>
                    <span className="summary-value">฿{orderDetails.total_amount?.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="summary-row discount">
                      <span className="summary-label">ส่วนลด:</span>
                      <span className="summary-value">-฿{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span className="summary-label">ยอดที่ต้องชำระ:</span>
                    <span className="summary-value">฿{totalAfterDiscount.toLocaleString()}</span>
                  </div>
                  {paymentMethod === 'cash' && changeAmount > 0 && (
                    <div className="summary-row change">
                      <span className="summary-label">เงินทอน:</span>
                      <span className="summary-value">฿{changeAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={paying || (paymentMethod === 'cash' && parseFloat(receivedAmount) < totalAfterDiscount)}
                  className="payment-btn"
                >
                  {paying ? (
                    <>
                      <div className="btn-spinner"></div>
                      กำลังดำเนินการ...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="currentColor"/>
                      </svg>
                      ชำระเงิน ฿{totalAfterDiscount.toLocaleString()}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PaymentPage;
