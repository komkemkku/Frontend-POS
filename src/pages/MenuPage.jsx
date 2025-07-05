import React, { useEffect, useState } from 'react';
import publicAxios from '../api/publicAxios';
import { useSearchParams } from 'react-router-dom';

function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [orderHistory, setOrderHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [tableInfo, setTableInfo] = useState(null);
  const [tableSummary, setTableSummary] = useState(null);
  const [orderTrackingInterval, setOrderTrackingInterval] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('online');

  // Retry mechanism for failed API calls
  const retryApiCall = async (apiFunction, maxRetries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await apiFunction();
        setConnectionStatus('online');
        return result;
      } catch (error) {
        console.log(`API call attempt ${attempt} failed:`, error.response?.status);
        
        if (attempt === maxRetries) {
          setConnectionStatus('offline');
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  };

  // Staff utility functions (for future use with authentication)
  const clearTableOrders = async (type = 'payment') => {
    if (!tableNumber) return;
    
    try {
      // This would require staff authentication token
      const token = localStorage.getItem('staffToken'); // Future implementation
      if (!token) {
        console.log('Staff authentication required for clearing orders');
        return;
      }
      
      const response = await fetch(`http://localhost:8080/staff/orders/advanced-clear/${tableNumber}?type=${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      if (result.success) {
        console.log('Orders cleared successfully:', result.data);
        // Refresh order history
        await fetchOrderHistory();
      }
    } catch (err) {
      console.error('Failed to clear orders:', err);
    }
  };

  // Helper functions for order status display
  const getStatusDisplay = (status) => {
    const statusMap = {
      'pending': '⏳ รอดำเนินการ',
      'confirmed': '✅ ยืนยันแล้ว',
      'preparing': '👨‍🍳 กำลังเตรียม',
      'ready': '🍽️ พร้อมเสิร์ฟ',
      'served': '✨ เสิร์ฟแล้ว',
      'paid': '💰 ชำระแล้ว',
      'cancelled': '❌ ยกเลิก'
    };
    return statusMap[status] || `📋 ${status}`;
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

  useEffect(() => {
    // ดึง table parameter จาก URL
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
    
    const fetchMenuAndTableInfo = async () => {
      try {
        console.log('Fetching menu and table info...');
        
        if (tableParam) {
          // ใช้ API ใหม่สำหรับดึงเมนูตาม QR Code
          try {
            const menuResponse = await publicAxios.get(`/public/menu/${tableParam}`);
            console.log('Menu by QR response:', menuResponse.data);
            
            if (menuResponse.data.success) {
              const data = menuResponse.data.data;
              setTableInfo(data.table_info);
              setMenu(data.menu_items.filter(item => item.is_available));
              console.log('Menu and table info loaded:', data);
            }
          } catch (qrMenuError) {
            console.log('Menu by QR failed, falling back to general menu:', qrMenuError.response?.status);
            // หาก API ตาม QR Code ไม่ทำงาน ให้ใช้ API ทั่วไป
            const generalMenuRes = await publicAxios.get('/public/menu-items');
            if (generalMenuRes.data.success) {
              setMenu(generalMenuRes.data.data.filter(item => item.is_available));
              console.log('General menu loaded');
            }
          }
        } else {
          // หากไม่มี table parameter ใช้ API ทั่วไป
          const generalMenuRes = await publicAxios.get('/public/menu-items');
          if (generalMenuRes.data.success) {
            setMenu(generalMenuRes.data.data.filter(item => item.is_available));
            console.log('General menu loaded');
          }
        }
      } catch (err) {
        console.error('Menu API error:', err);
        setError(`โหลดเมนูไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
        if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
          setConnectionStatus('offline');
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchOrderHistory = async () => {
      if (tableParam) {
        setHistoryLoading(true);
        try {
          console.log('Fetching order history for table:', tableParam);
          
          // ลองใช้ API ประวัติออเดอร์ตาม Backend ใหม่
          try {
            const historyRes = await publicAxios.get(`/public/orders/history/${tableParam}`);
            console.log('Order history response:', historyRes.data);
            
            if (historyRes.data.success) {
              const historyData = historyRes.data.data;
              
              // อัปเดตข้อมูลโต๊ะ
              if (historyData.table_info) {
                setTableInfo(historyData.table_info);
              }
              
              // รวมออเดอร์ปัจจุบันและออเดอร์ที่ชำระแล้ว
              const allOrders = [
                ...(historyData.current_orders || []),
                ...(historyData.paid_orders || [])
              ].sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
              
              setOrderHistory(allOrders);
              console.log('Order history loaded:', allOrders);
            }
          } catch (historyErr) {
            console.log('History API failed, trying current orders only:', historyErr.response?.status);
            
            // หาก history API ไม่ทำงาน ลองใช้ current orders
            try {
              const currentOrdersRes = await publicAxios.get(`/public/orders/table/${tableParam}`);
              console.log('Current orders response:', currentOrdersRes.data);
              
              if (currentOrdersRes.data.success) {
                setOrderHistory(currentOrdersRes.data.data || []);
              }
            } catch (currentErr) {
              console.log('Current orders API also failed:', currentErr.response?.status);
              // ใช้ localStorage เป็น fallback
              const savedOrders = JSON.parse(localStorage.getItem(`orders_${tableParam}`) || '[]');
              const emergencyOrders = JSON.parse(localStorage.getItem('emergencyOrders') || '[]')
                .filter(order => 
                  order.qr_code_identifier === tableParam || 
                  order.table === tableParam
                );
              
              setOrderHistory([...savedOrders, ...emergencyOrders]
                .sort((a, b) => (b.timestamp || b.created_at || 0) - (a.timestamp || a.created_at || 0)));
            }
          }
        } catch (err) {
          console.error('Order history fetch failed:', err);
        } finally {
          setHistoryLoading(false);
        }
      }
    };

    const fetchTableSummary = async () => {
      if (tableParam) {
        try {
          const summaryRes = await publicAxios.get(`/public/table/summary/${tableParam}`);
          console.log('Table summary response:', summaryRes.data);
          
          if (summaryRes.data.success) {
            setTableSummary(summaryRes.data.data);
          }
        } catch (err) {
          console.log('Table summary failed:', err.response?.status);
        }
      }
    };

    const checkConnectionHealth = async () => {
      try {
        setConnectionStatus('connecting');
        const response = await publicAxios.get('/health', { timeout: 5000 });
        if (response.status === 200) {
          setConnectionStatus('online');
        }
      } catch (err) {
        setConnectionStatus('offline');
        console.log('Connection health check failed:', err.response?.status);
      }
    };

    fetchMenuAndTableInfo();
    fetchOrderHistory();
    fetchTableSummary();
    checkConnectionHealth();

    // ตั้งค่า real-time tracking สำหรับออเดอร์
    if (tableParam) {
      const interval = setInterval(() => {
        fetchOrderHistory();
        fetchTableSummary();
        checkConnectionHealth();
      }, 10000); // อัปเดตทุก 10 วินาที
      
      setOrderTrackingInterval(interval);
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [searchParams]);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) {
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: newQty } : i));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  const handleOrder = async () => {
    if (!tableNumber) {
      alert('กรุณาระบุหมายเลขโต๊ะ');
      return;
    }
    if (cart.length === 0) {
      alert('กรุณาเลือกเมนู');
      return;
    }

    setOrderLoading(true);
    
    try {
      // สร้างออเดอร์ตาม Backend API format ใหม่
      const orderData = {
        qr_code_identifier: tableNumber.toString(),
        items: cart.map(item => ({
          menu_item_id: parseInt(item.id),
          quantity: parseInt(item.qty)
        }))
      };

      console.log('Sending order:', orderData);
      const response = await publicAxios.post('/public/orders/create', orderData);
      console.log('Order response:', response.data);
      
      if (response.data.success) {
        // แสดงข้อความสำเร็จจาก Backend
        const orderInfo = response.data.data;
        setOrderSuccess(true);
        setCart([]);
        
        // อัปเดตประวัติออเดอร์ทันทีหลังสั่งสำเร็จ
        setTimeout(async () => {
          try {
            const historyRes = await publicAxios.get(`/public/orders/history/${tableNumber}`);
            if (historyRes.data.success) {
              const historyData = historyRes.data.data;
              const allOrders = [
                ...(historyData.current_orders || []),
                ...(historyData.paid_orders || [])
              ].sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
              
              setOrderHistory(allOrders);
            }
          } catch (refreshErr) {
            console.log('Failed to refresh order history');
          }
        }, 1000);
        
        // ซ่อนข้อความสำเร็จหลัง 3 วินาที
        setTimeout(() => setOrderSuccess(false), 3000);
      }
      
    } catch (err) {
      console.error('Order API failed:', err);
      console.error('Error response:', err.response?.data);
      
      // วิเคราะห์สาเหตุข้อผิดพลาดตาม Backend response
      let errorTitle = '';
      let errorDescription = '';
      
      if (err.response?.data?.success === false) {
        errorTitle = '❌ ข้อผิดพลาดจาก API';
        errorDescription = err.response.data.message || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ';
      } else if (err.response?.status === 500) {
        errorTitle = '⚠️ เซิร์ฟเวอร์มีปัญหาชั่วคราว';
        errorDescription = 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กำลังดำเนินการแก้ไข';
      } else if (err.response?.status === 400) {
        errorTitle = '❌ ข้อมูลออเดอร์ไม่ถูกต้อง';
        errorDescription = err.response?.data?.message || 'กรุณาตรวจสอบข้อมูล';
      } else if (err.response?.status === 404) {
        errorTitle = '🔍 ไม่พบโต๊ะที่ระบุ';
        errorDescription = 'ไม่พบโต๊ะหรือ QR Code ไม่ถูกต้อง';
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorTitle = '📡 ปัญหาการเชื่อมต่อเครือข่าย';
        errorDescription = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
      } else {
        errorTitle = '⚠️ เกิดข้อผิดพลาดที่ไม่คาดคิด';
        errorDescription = err.response?.data?.message || err.message || 'สาเหตุไม่ทราบ';
      }
      
      // บันทึกเป็น Emergency Order หาก API ล้มเหลว
      console.log('API failed, saving as emergency order...');
      
      const emergencyOrder = {
        id: Date.now(),
        timestamp: Date.now(),
        created_at: Date.now(),
        table_id: null,
        table_number: tableNumber,
        qr_code_identifier: tableNumber.toString(),
        status: 'pending',
        status_text: 'รอดำเนินการ (ออฟไลน์)',
        total_amount: getTotalPrice(),
        items: cart.map(item => ({
          id: item.id,
          menu_item_id: item.id,
          quantity: item.qty,
          price_per_item: item.price,
          sub_total: item.price * item.qty,
          notes: ''
        })),
        reason: errorTitle,
        errorDetails: errorDescription,
        isEmergencyOrder: true
      };

      // บันทึกใน localStorage
      const savedOrders = JSON.parse(localStorage.getItem(`orders_${tableNumber}`) || '[]');
      savedOrders.push(emergencyOrder);
      localStorage.setItem(`orders_${tableNumber}`, JSON.stringify(savedOrders));
      
      const emergencyOrders = JSON.parse(localStorage.getItem('emergencyOrders') || '[]');
      emergencyOrders.push(emergencyOrder);
      localStorage.setItem('emergencyOrders', JSON.stringify(emergencyOrders));

      // อัปเดตประวัติในหน้าเว็บ
      setOrderHistory(prev => [emergencyOrder, ...prev]);

      // แสดงข้อความแจ้งเตือน
      alert(`${errorTitle}\n\n${errorDescription}\n\n✅ ออเดอร์ของคุณได้ถูกบันทึกไว้แล้ว!\n\nโต๊ะ: ${tableNumber}\nยอดรวม: ฿${getTotalPrice()}\n\n📝 กรุณาแจ้งพนักงานเพื่อดำเนินการต่อ`);

      setCart([]);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="menu-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>กำลังโหลดเมนู...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-container">
        <div className="error-message">
          <h3>❌ เกิดข้อผิดพลาด</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>ลองใหม่</button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1>🍽️ เมนูอาหาร</h1>
        <p>โต๊ะ: {tableInfo?.table_number || tableNumber || 'ไม่ระบุ'}</p>
        <div className={`connection-status ${connectionStatus}`}>
          {connectionStatus === 'online' && '🟢 เชื่อมต่อแล้ว'}
          {connectionStatus === 'offline' && '🔴 ออฟไลน์'}
          {connectionStatus === 'connecting' && '🟡 กำลังเชื่อมต่อ...'}
        </div>
      </div>

      {/* ข้อมูลโต๊ะและสรุป */}
      {tableInfo && (
        <div className="table-info-section">
          <div className="table-info">
            <h3>📍 ข้อมูลโต๊ะ</h3>
            <p><strong>โต๊ะ:</strong> {tableInfo.table_number}</p>
            <p><strong>ที่นั่ง:</strong> {tableInfo.capacity} ที่</p>
            <p><strong>สถานะ:</strong> {tableInfo.status === 'occupied' ? '🔴 มีลูกค้า' : '🟢 ว่าง'}</p>
          </div>
          
          {tableSummary && (
            <div className="table-summary">
              <h3>💰 สรุปยอดโต๊ะ</h3>
              <p><strong>รอดำเนินการ:</strong> {tableSummary.order_counts?.pending || 0} รายการ</p>
              <p><strong>กำลังเตรียม:</strong> {tableSummary.order_counts?.preparing || 0} รายการ</p>
              <p><strong>พร้อมเสิร์ฟ:</strong> {tableSummary.order_counts?.ready || 0} รายการ</p>
              <p><strong>ยอดคงค้าง:</strong> ฿{tableSummary.total_pending || 0}</p>
              <p><strong>อัปเดตล่าสุด:</strong> {new Date((tableSummary.last_updated || 0) * 1000).toLocaleTimeString('th-TH')}</p>
            </div>
          )}
        </div>
      )}

      {/* รายการเมนู */}
      <div className="menu-grid">
        {menu.length === 0 ? (
          <div className="no-menu">ไม่มีเมนูในขณะนี้</div>
        ) : (
          menu.map(item => (
            <div key={item.id} className="menu-card">
              <div className="menu-info">
                <h3 className="menu-name">{item.name}</h3>
                <p className="menu-description">{item.description}</p>
                <div className="menu-price">฿{item.price}</div>
              </div>
              <button 
                className="add-btn" 
                onClick={() => addToCart(item)}
                aria-label={`เพิ่ม ${item.name} ลงตะกร้า`}
              >
                <span>+</span> เพิ่ม
              </button>
            </div>
          ))
        )}
      </div>

      {/* ตะกร้าสินค้า */}
      <div className="cart-section">
        <div className="cart-header">
          <h2>🛒 ตะกร้าสั่งอาหาร</h2>
          <span className="cart-count">({cart.length} รายการ)</span>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>🛒 ยังไม่มีรายการอาหาร</p>
            <small>เลือกเมนูที่ต้องการจากด้านบน</small>
          </div>
        ) : (
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <span className="item-price">฿{item.price} × {item.qty}</span>
                </div>
                <div className="quantity-controls">
                  <button 
                    className="qty-btn minus"
                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                    aria-label="ลดจำนวน"
                  >
                    −
                  </button>
                  <span className="quantity">{item.qty}</span>
                  <button 
                    className="qty-btn plus"
                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                    aria-label="เพิ่มจำนวน"
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ฿{item.price * item.qty}
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`ลบ ${item.name}`}
                >
                  🗑️
                </button>
              </div>
            ))}
            
            <div className="cart-summary">
              <div className="total-price">
                <strong>ยอดรวม: ฿{getTotalPrice()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* ส่วนส่งออเดอร์ */}
        <div className="order-section">
          <div className="table-input">
            <label htmlFor="tableNumber">หมายเลขโต๊ะ:</label>
            <input 
              id="tableNumber"
              type="text"
              placeholder="เช่น T01, A5" 
              value={tableNumber} 
              onChange={e => setTableNumber(e.target.value)}
              disabled={searchParams.get('table')}
            />
          </div>
          
          <button 
            className={`order-btn ${cart.length === 0 ? 'disabled' : ''}`}
            onClick={handleOrder}
            disabled={cart.length === 0 || orderLoading || !tableNumber}
          >
            {orderLoading ? (
              <>
                <div className="btn-spinner"></div>
                กำลังส่งออเดอร์...
              </>
            ) : (
              <>
                🍴 ส่งออเดอร์ (฿{getTotalPrice()})
              </>
            )}
          </button>
          
          {/* ข้อมูลเพิ่มเติมสำหรับออเดอร์ */}
          <div className="order-info">
            <p className="order-note">
              📝 <strong>หมายเหตุ:</strong> ออเดอร์จะถูกส่งไปยังครัวโดยอัตโนมัติ
              หากระบบมีปัญหาชั่วคราว ออเดอร์จะถูกบันทึกและประมวลผลภายหลัง
            </p>
          </div>
        </div>

        {/* ข้อความสำเร็จ */}
        {orderSuccess && (
          <div className="success-message">
            <div className="success-content">
              <h3>✅ รับออเดอร์แล้ว!</h3>
              <p>ออเดอร์ของคุณได้ถูกบันทึกเรียบร้อยแล้ว</p>
              <p><strong>โต๊ะ:</strong> {tableNumber}</p>
              <p><strong>สถานะ:</strong> กำลังดำเนินการ</p>
              <small>⏰ อาหารจะเสิร์ฟภายใน 15-20 นาที<br/>
              📞 หากมีคำถาม กรุณาติดต่อพนักงาน</small>
            </div>
          </div>
        )}

        {/* แสดงออเดอร์ที่กำลังดำเนินการ */}
        {(() => {
          const savedOrders = JSON.parse(localStorage.getItem('emergencyOrders') || '[]');
          const tableOrders = savedOrders.filter(order => order.table === tableNumber);
          
          if (tableOrders.length > 0) {
            return (
              <div className="order-tracking">
                <h4>📋 ออเดอร์ฉุกเฉิน (โต๊ะ {tableNumber}):</h4>
                {tableOrders.map(order => (
                  <div key={order.id} className="tracking-order-item">
                    <div className="order-header">
                      <span>🕐 {order.timestamp}</span>
                      <span className="tracking-status" style={{backgroundColor: getStatusColor(order.status)}}>
                        {getStatusDisplay(order.status)}
                      </span>
                    </div>
                    {order.reason && (
                      <div className="order-error-reason">
                        <small>📋 สาเหตุ: {order.reason}</small>
                        {order.errorDetails && (
                          <small className="error-details">{order.errorDetails}</small>
                        )}
                      </div>
                    )}
                    <div className="order-items">
                      {order.items.map(item => (
                        <div key={item.id} className="tracking-item">
                          {item.name} x{item.qty} = ฿{item.price * item.qty}
                        </div>
                      ))}
                    </div>
                    <div className="order-total">ยอดรวม: ฿{order.total}</div>
                    <div className="order-note">
                      <small>💡 ออเดอร์นี้กำลังถูกดำเนินการ กรุณาแจ้งพนักงาน</small>
                    </div>
                  </div>
                ))}
                <button 
                  className="received-order-btn"
                  onClick={() => {
                    if (confirm('ยืนยันว่าได้รับอาหารครบถ้วนแล้ว?')) {
                      const allOrders = JSON.parse(localStorage.getItem('emergencyOrders') || '[]');
                      const filteredOrders = allOrders.filter(order => order.table !== tableNumber);
                      localStorage.setItem('emergencyOrders', JSON.stringify(filteredOrders));
                      window.location.reload();
                    }
                  }}
                >
                  ✅ ยืนยันรับอาหารแล้ว
                </button>
              </div>
            );
          }
          return null;
        })()}

        {/* แสดงประวัติออเดอร์จากระบบ */}
        {orderHistory.length > 0 && (
          <div className="order-history">
            <h4>📝 ประวัติการสั่งอาหาร (โต๊ะ {tableNumber}):</h4>
            {historyLoading ? (
              <div className="history-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดประวัติ...</p>
              </div>
            ) : (
              orderHistory.map(order => (
                <div key={order.id} className="history-order-item">
                  <div className="order-header">
                    <span>🕐 {new Date((order.created_at || order.timestamp) * 1000).toLocaleString('th-TH')}</span>
                    <span className={`order-status`} style={{backgroundColor: getStatusColor(order.status)}}>
                      {getStatusDisplay(order.status)}
                    </span>
                  </div>
                  
                  <div className="order-details">
                    <p><strong>ออเดอร์ #:</strong> {order.id}</p>
                    <p><strong>ชื่อลูกค้า:</strong> {order.customer_name || 'ลูกค้า'}</p>
                    {order.note && <p><strong>หมายเหตุ:</strong> {order.note}</p>}
                  </div>

                  <div className="order-items">
                    <h5>🍽️ รายการอาหารที่สั่ง:</h5>
                    {/* แสดงจาก order_items ก่อน ถ้าไม่มีให้ใช้ items */}
                    {order.order_items && order.order_items.length > 0 ? (
                      order.order_items.map((item, index) => (
                        <div key={index} className="order-item-detail">
                          <span className="item-name">
                            {item.menu_item?.name || item.name || `เมนู ID: ${item.menu_item_id}`}
                          </span>
                          <span className="item-quantity">x{item.quantity || item.qty || 1}</span>
                          <span className="item-price">฿{item.sub_total || (item.price_per_item * (item.quantity || item.qty || 1)) || 0}</span>
                        </div>
                      ))
                    ) : order.items && order.items.length > 0 ? (
                      // Fallback สำหรับ emergency orders หรือ localStorage
                      order.items.map((item, index) => (
                        <div key={index} className="order-item-detail">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">x{item.qty}</span>
                          <span className="item-price">฿{item.price * item.qty}</span>
                        </div>
                      ))
                    ) : (
                      <div className="no-items-message">
                        <p>ไม่พบรายละเอียดอาหาร</p>
                        <small>ระบบอาจกำลังอัปเดตข้อมูล หรือ Backend ยังไม่ได้ส่งข้อมูลออเดอร์</small>
                      </div>
                    )}
                  </div>

                  <div className="order-total">
                    <strong>ยอดรวม: ฿{order.total_amount || order.total}</strong>
                  </div>

                  {/* แสดง emergency order notice */}
                  {order.isEmergencyOrder && (
                    <div className="emergency-order-notice">
                      💾 ออเดอร์สำรอง - บันทึกเนื่องจาก: {order.reason}
                      <br />
                      <small>กรุณาแจ้งพนักงานเพื่อดำเนินการ</small>
                    </div>
                  )}

                  {order.status === 'ready' && (
                    <div className="order-ready-notice">
                      🔔 อาหารของคุณพร้อมแล้ว! กรุณามารับที่เคาน์เตอร์
                    </div>
                  )}

                  {(order.status === 'pending' || order.status === 'preparing') && (
                    <div className="order-progress-notice">
                      ⏰ อาหารกำลังเตรียม คาดว่าจะเสร็จภายใน 15-20 นาที
                    </div>
                  )}

                  {order.status === 'served' && (
                    <div className="order-served-notice">
                      ✨ เสิร์ฟเรียบร้อยแล้ว ขอบคุณที่ใช้บริการ
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Real-time updates info */}
        {tableNumber && connectionStatus === 'online' && (
          <div className="realtime-info">
            <p>🔄 อัปเดตสถานะออเดอร์อัตโนมัติทุก 10 วินาที</p>
          </div>
        )}

        {/* ข้อความเมื่อไม่มีประวัติ */}
        {!historyLoading && orderHistory.length === 0 && tableNumber && (
          <div className="no-history">
            <div className="no-history-content">
              <h4>📋 ยังไม่มีประวัติการสั่งอาหาร</h4>
              <p>โต๊ะ {tableNumber} ยังไม่เคยสั่งอาหารมาก่อน</p>
              <small>เริ่มสั่งอาหารได้เลยจากเมนูด้านบน!</small>
              <div className="api-status-info">
                <p>🔧 หากคุณเพิ่งสั่งอาหาร อาจต้องรอสักครู่เพื่อให้ระบบประมวลผล</p>
                <p>📞 หากมีปัญหา กรุณาติดต่อเจ้าหน้าที่</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .menu-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .menu-header {
          text-align: center;
          color: white;
          margin-bottom: 30px;
        }

        .menu-header h1 {
          font-size: 2.5rem;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .menu-header p {
          font-size: 1.2rem;
          margin: 10px 0 0 0;
          opacity: 0.9;
        }

        .connection-status {
          font-size: 0.9rem;
          margin-top: 10px;
          padding: 5px 12px;
          border-radius: 20px;
          display: inline-block;
        }

        .connection-status.online {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        }

        .connection-status.offline {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        }

        .connection-status.connecting {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }

        .table-info-section {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .table-info,
        .table-summary {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 15px;
          color: #333;
        }

        .table-info h3,
        .table-summary h3 {
          margin: 0 0 10px 0;
          color: #667eea;
          font-size: 1.1rem;
        }

        .table-info p,
        .table-summary p {
          margin: 5px 0;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .table-info-section {
            grid-template-columns: 1fr;
          }
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: white;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255,255,255,0.3);
          border-top: 5px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          background: white;
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          max-width: 400px;
          margin: 50px auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .error-message button {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 15px;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .menu-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .menu-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }

        .menu-info {
          flex: 1;
        }

        .menu-name {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #333;
        }

        .menu-description {
          color: #666;
          font-size: 0.9rem;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .menu-price {
          font-size: 1.4rem;
          font-weight: 700;
          color: #667eea;
        }

        .add-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .add-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .cart-section {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          margin-top: 20px;
        }

        .cart-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .cart-header h2 {
          margin: 0;
          color: #333;
        }

        .cart-count {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .empty-cart {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .empty-cart p {
          font-size: 1.2rem;
          margin: 0 0 8px 0;
        }

        .cart-items {
          space: 15px 0;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          margin-bottom: 15px;
          transition: border-color 0.3s ease;
        }

        .cart-item:hover {
          border-color: #667eea;
        }

        .item-details {
          flex: 1;
        }

        .item-details h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .item-price {
          color: #666;
          font-size: 0.9rem;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .qty-btn {
          width: 35px;
          height: 35px;
          border: 2px solid #667eea;
          background: white;
          color: #667eea;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .qty-btn:hover {
          background: #667eea;
          color: white;
        }

        .quantity {
          min-width: 40px;
          text-align: center;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .item-total {
          font-weight: 700;
          color: #667eea;
          font-size: 1.1rem;
          min-width: 80px;
          text-align: right;
        }

        .remove-btn {
          background: #ff4757;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: transform 0.3s ease;
        }

        .remove-btn:hover {
          transform: scale(1.1);
        }

        .cart-summary {
          border-top: 2px solid #f0f0f0;
          padding-top: 20px;
          margin-top: 20px;
        }

        .total-price {
          text-align: right;
          font-size: 1.5rem;
          color: #333;
        }

        .order-section {
          margin-top: 25px;
          padding-top: 25px;
          border-top: 2px solid #f0f0f0;
        }

        .table-input {
          margin-bottom: 20px;
        }

        .table-input label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .table-input input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .table-input input:focus {
          outline: none;
          border-color: #667eea;
        }

        .table-input input:disabled {
          background: #f5f5f5;
          color: #999;
        }

        .order-btn {
          width: 100%;
          background: linear-gradient(135deg, #52c41a, #389e0d);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 700;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .order-btn:hover:not(.disabled):not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(82, 196, 26, 0.4);
        }

        .order-btn.disabled,
        .order-btn:disabled {
          background: #d9d9d9;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .order-info {
          margin-top: 15px;
          padding: 15px;
          background: #f6ffed;
          border: 1px solid #b7eb8f;
          border-radius: 8px;
        }

        .order-note {
          margin: 0;
          font-size: 14px;
          color: #52c41a;
          line-height: 1.5;
        }

        .emergency-orders {
          margin-top: 20px;
          padding: 20px;
          background: #e6f7ff;
          border: 2px solid #1890ff;
          border-radius: 12px;
        }

        .emergency-orders h4 {
          margin: 0 0 15px 0;
          color: #1890ff;
        }

        .emergency-order-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 10px;
          border-left: 4px solid #1890ff;
        }

        .order-tracking {
          margin-top: 20px;
          padding: 20px;
          background: #e6f7ff;
          border: 2px solid #1890ff;
          border-radius: 12px;
        }

        .order-tracking h4 {
          margin: 0 0 15px 0;
          color: #1890ff;
          text-align: center;
        }

        .order-history {
          margin-top: 20px;
          padding: 20px;
          background: #f6ffed;
          border: 2px solid #52c41a;
          border-radius: 12px;
        }

        .order-history h4 {
          margin: 0 0 15px 0;
          color: #52c41a;
          text-align: center;
        }

        .history-loading {
          text-align: center;
          padding: 20px;
          color: #52c41a;
        }

        .history-order-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 15px;
          border-left: 4px solid #52c41a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .order-details {
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f0f0f0;
        }

        .order-details p {
          margin: 5px 0;
          color: #666;
        }

        .order-items h5 {
          margin: 10px 0;
          color: #333;
          font-size: 1.1rem;
        }

        .order-item-detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .order-item-detail:last-child {
          border-bottom: none;
        }

        .item-name {
          flex: 1;
          font-weight: 500;
          color: #333;
        }

        .item-quantity {
          color: #666;
          margin: 0 15px;
        }

        .item-price {
          font-weight: 600;
          color: #52c41a;
        }

        .no-items-message {
          text-align: center;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 8px;
          color: #999;
        }

        .no-items-message p {
          margin: 0 0 5px 0;
          font-weight: 500;
        }

        .no-items-message small {
          color: #666;
          font-style: italic;
        }

        .order-progress-notice {
          background: #e6f7ff;
          border: 1px solid #91d5ff;
          border-radius: 8px;
          padding: 10px;
          margin-top: 10px;
          text-align: center;
          color: #0050b3;
          font-weight: 500;
        }

        .no-history {
          margin-top: 20px;
          padding: 20px;
          background: #fafafa;
          border: 2px dashed #d9d9d9;
          border-radius: 12px;
          text-align: center;
        }

        .no-history-content h4 {
          margin: 0 0 10px 0;
          color: #666;
        }

        .no-history-content p {
          margin: 0 0 5px 0;
          color: #999;
        }

        .no-history-content small {
          color: #bfbfbf;
          font-style: italic;
        }

        .order-ready-notice {
          background: #fff7e6;
          border: 1px solid #ffb300;
          border-radius: 8px;
          padding: 10px;
          margin-top: 10px;
          text-align: center;
          color: #e65100;
          font-weight: 600;
          animation: readyPulse 2s infinite;
        }

        .order-served-notice {
          background: #f6ffed;
          border: 1px solid #52c41a;
          border-radius: 8px;
          padding: 10px;
          margin-top: 10px;
          text-align: center;
          color: #389e0d;
          font-weight: 600;
        }

        @keyframes readyPulse {
          0% { background-color: #fff7e6; }
          50% { background-color: #ffe0b2; }
          100% { background-color: #fff7e6; }
        }

        .order-status {
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .tracking-order-item {
          background: white;
          padding: 18px;
          border-radius: 12px;
          margin-bottom: 15px;
          border-left: 4px solid #52c41a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-weight: bold;
        }

        .order-error-reason {
          background: #fff2e8;
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 10px;
          border-left: 3px solid #fa8c16;
        }

        .order-error-reason small {
          display: block;
          color: #d46b08;
          font-size: 12px;
          line-height: 1.4;
        }

        .error-details {
          margin-top: 4px;
          color: #8c8c8c !important;
          font-style: italic;
        }

        .emergency-order-notice {
          background: #fff2e8;
          border: 1px solid #ffb347;
          border-radius: 8px;
          padding: 10px;
          margin-top: 10px;
          text-align: center;
          color: #d84315;
          font-weight: 500;
        }

        .emergency-order-notice small {
          display: block;
          margin-top: 5px;
          font-weight: normal;
          color: #bf360c;
        }

        .tracking-status {
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .order-items {
          margin-bottom: 12px;
          color: #666;
        }

        .tracking-item {
          padding: 4px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .tracking-item:last-child {
          border-bottom: none;
        }

        .order-total {
          font-weight: 700;
          color: #1890ff;
          text-align: right;
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .order-note {
          text-align: center;
          color: #52c41a;
          font-style: italic;
        }

        .received-order-btn {
          width: 100%;
          background: linear-gradient(135deg, #52c41a, #389e0d);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 15px;
          transition: all 0.3s ease;
        }

        .received-order-btn:hover {
          background: linear-gradient(135deg, #73d13d, #52c41a);
          transform: translateY(-1px);
        }

        .clear-emergency-btn {
          width: 100%;
          background: #ff4d4f;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 10px;
        }

        .clear-emergency-btn:hover {
          background: #ff7875;
        }

        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .success-message {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .success-content {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          animation: successPop 0.5s ease-out;
        }

        @keyframes successPop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .success-content h3 {
          color: #52c41a;
          margin: 0 0 15px 0;
          font-size: 1.5rem;
        }

        .success-content p {
          margin: 0 0 10px 0;
          color: #333;
        }

        .success-content small {
          color: #666;
        }

        .no-menu {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 15px;
          color: #666;
          font-size: 1.2rem;
        }

        .api-status-info {
          margin-top: 15px;
          padding: 12px;
          background: #e6f7ff;
          border: 1px solid #91d5ff;
          border-radius: 8px;
        }

        .api-status-info p {
          margin: 5px 0;
          color: #0050b3;
          font-size: 14px;
        }

        .demo-order-btn {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          margin-top: 15px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(76, 175, 80, 0.3);
        }

        .demo-order-btn:hover {
          background: linear-gradient(45deg, #45a049, #4CAF50);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
        }

        .realtime-info {
          background: rgba(33, 150, 243, 0.1);
          border: 1px solid #2196f3;
          border-radius: 8px;
          padding: 10px;
          margin: 15px 0;
          text-align: center;
        }

        .realtime-info p {
          margin: 0;
          color: #1976d2;
          font-size: 14px;
        }

        /* ข้อความเมื่อไม่มีประวัติ */
        @media (max-width: 768px) {
          .menu-container {
            padding: 15px;
          }

          .menu-header h1 {
            font-size: 2rem;
          }

          .menu-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .menu-card {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }

          .cart-item {
            flex-wrap: wrap;
            gap: 10px;
          }

          .item-details {
            flex: 100%;
          }

          .quantity-controls {
            order: 1;
          }

          .item-total {
            order: 2;
            text-align: left;
            min-width: auto;
          }

          .remove-btn {
            order: 3;
          }
        }
      `}</style>
    </div>
  );
}

export default MenuPage;
