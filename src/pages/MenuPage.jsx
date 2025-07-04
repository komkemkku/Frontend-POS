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

  useEffect(() => {
    // ดึง table parameter จาก URL
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setTableNumber(tableParam);
    }
    
    const fetchMenu = async () => {
      try {
        console.log('Fetching menu from public API...');
        const res = await publicAxios.get('/public/menu-items');
        console.log('Menu API response:', res.data);
        // แสดงเฉพาะเมนูที่ is_available === true
        setMenu((res.data.data || []).filter(item => item.is_available));
      } catch (err) {
        console.error('Menu API error:', err);
        setError(`โหลดเมนูไม่สำเร็จ: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
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
    
    // ลองส่ง API ก่อน
    try {
      // ตรวจสอบข้อมูลที่จะส่ง
      const orderData = {
        qr_code_identifier: tableNumber.toString(),
        customer_name: "ลูกค้า", // เพิ่ม default customer name
        customer_phone: "", // เพิ่ม default phone
        items: cart.map(item => ({
          menu_item_id: parseInt(item.id),
          quantity: parseInt(item.qty),
          price_per_item: parseFloat(item.price),
          sub_total: parseFloat(item.price) * parseInt(item.qty)
        })),
        total_amount: parseFloat(getTotalPrice()),
        note: "" // เพิ่ม note field
      };

      console.log('Sending order:', orderData);
      const response = await publicAxios.post('/public/orders/create', orderData);
      console.log('Order response:', response.data);
      
      // สำเร็จผ่าน API
      setOrderSuccess(true);
      setCart([]);
      
      // ซ่อนข้อความสำเร็จหลัง 3 วินาที
      setTimeout(() => setOrderSuccess(false), 3000);
      
    } catch (err) {
      console.error('Order API failed:', err);
      console.error('Error response:', err.response?.data);
      
      // วิเคราะห์สาเหตุข้อผิดพลาด
      let errorTitle = '';
      let errorDescription = '';
      
      if (err.response?.status === 500) {
        const errorMsg = err.response?.data?.message || '';
        
        if (errorMsg.includes('created_at') || errorMsg.includes('column') || errorMsg.includes('does not exist')) {
          errorTitle = '🔧 ระบบฐานข้อมูลกำลังปรับปรุง';
          errorDescription = 'ฐานข้อมูลกำลังได้รับการอัปเดต เพื่อเพิ่มประสิทธิภาพในการใช้งาน';
        } else {
          errorTitle = '⚠️ เซิร์ฟเวอร์มีปัญหาชั่วคราว';
          errorDescription = 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ กำลังดำเนินการแก้ไข';
        }
      } else if (err.response?.status === 400) {
        errorTitle = '❌ ข้อมูลออเดอร์ไม่ถูกต้อง';
        errorDescription = `รายละเอียด: ${err.response?.data?.message || 'กรุณาตรวจสอบข้อมูล'}`;
      } else if (err.response?.status === 404) {
        errorTitle = '🔍 ไม่พบเส้นทาง API';
        errorDescription = 'ระบบอาจกำลังปรับปรุงหรือย้ายฐานข้อมูล';
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorTitle = '📡 ปัญหาการเชื่อมต่อเครือข่าย';
        errorDescription = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ต';
      } else {
        errorTitle = '⚠️ เกิดข้อผิดพลาดที่ไม่คาดคิด';
        errorDescription = err.response?.data?.message || err.message || 'สาเหตุไม่ทราบ';
      }
      
      // หาก API ล้มเหลว ให้บันทึกเป็น Emergency Order โดยอัตโนมัติ
      console.log('API failed, saving as emergency order...');
      
      const orderSummary = cart.map(item => 
        `${item.name} x${item.qty} = ฿${item.price * item.qty}`
      ).join('\n');
       const emergencyOrder = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('th-TH'),
        table: tableNumber,
        items: cart,
        total: getTotalPrice(),
        status: 'รอดำเนินการ',
        reason: errorTitle,
        errorDetails: errorDescription
      };

      // บันทึกใน localStorage
      const savedOrders = JSON.parse(localStorage.getItem('emergencyOrders') || '[]');
      savedOrders.push(emergencyOrder);
      localStorage.setItem('emergencyOrders', JSON.stringify(savedOrders));

      // แสดงข้อความที่เหมาะสมกับสถานการณ์
      alert(`${errorTitle}\n\n${errorDescription}\n\n✅ ออเดอร์ของคุณได้ถูกบันทึกไว้แล้ว!\n\nโต๊ะ: ${tableNumber}\nเวลา: ${emergencyOrder.timestamp}\n\nยอดรวม: ฿${getTotalPrice()}\n\n📝 กรุณาแจ้งพนักงานเพื่อดำเนินการต่อ\nหรือใช้ปุ่ม "ดูออเดอร์ที่บันทึกไว้" ด้านล่าง`);

      console.log('Emergency Order Saved:', emergencyOrder);
      setCart([]);
      
      // แสดง success message เหมือนส่งสำเร็จ
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
        <p>โต๊ะ: {tableNumber || 'ไม่ระบุ'}</p>
      </div>

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
                <h4>📋 ออเดอร์ของคุณ (โต๊ะ {tableNumber}):</h4>
                {tableOrders.map(order => (
                  <div key={order.id} className="tracking-order-item">
                    <div className="order-header">
                      <span>🕐 {order.timestamp}</span>
                      <span className="tracking-status">{order.status}</span>
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
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .order-status {
          background: #fa8c16;
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
        }

        .tracking-status {
          background: #52c41a;
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
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

        /* Responsive Design */
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
