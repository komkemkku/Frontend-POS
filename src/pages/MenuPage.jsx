import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('/menu-items');
        setMenu(res.data.data || []);
      } catch (err) {
        setError('โหลดเมนูไม่สำเร็จ');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

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

  const handleOrder = async () => {
    if (!tableNumber) return alert('กรุณาระบุหมายเลขโต๊ะ');
    if (cart.length === 0) return alert('กรุณาเลือกเมนู');
    try {
      await axios.post('/orders/create', {
        table_id: tableNumber,
        items: cart.map(i => ({ menu_item_id: i.id, quantity: i.qty, price_per_item: i.price })),
      });
      setOrderSuccess(true);
      setCart([]);
    } catch (err) {
      alert('ส่งออเดอร์ไม่สำเร็จ');
    }
  };

  if (loading) return <div>กำลังโหลดเมนู...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="menu-bg">
      <div className="menu-card">
        <h2>เมนูอาหาร</h2>
        <div className="menu-list">
          {menu.map(item => (
            <div key={item.id} className="menu-item">
              <div className="menu-item-info">
                <div className="menu-item-name">{item.name}</div>
                <div className="menu-item-price">฿{item.price}</div>
              </div>
              <button onClick={() => addToCart(item)}>เพิ่ม</button>
            </div>
          ))}
        </div>
        <div className="menu-cart">
          <h3>ตะกร้าสั่งอาหาร</h3>
          <input placeholder="หมายเลขโต๊ะ (จาก QR)" value={tableNumber} onChange={e => setTableNumber(e.target.value)} />
          {cart.length === 0 ? <div>ยังไม่มีรายการ</div> : (
            <ul>
              {cart.map(i => (
                <li key={i.id}>
                  {i.name} x {i.qty} <button onClick={() => removeFromCart(i.id)}>ลบ</button>
                </li>
              ))}
            </ul>
          )}
          <button onClick={handleOrder} disabled={cart.length === 0}>ส่งออเดอร์</button>
          {orderSuccess && <div className="order-success">ส่งออเดอร์สำเร็จ!</div>}
        </div>
      </div>
      <style>{`
        .menu-bg { min-height: 100vh; background: #f0f2f5; display: flex; align-items: center; justify-content: center; }
        .menu-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 16px #0001; padding: 32px 24px; min-width: 340px; }
        .menu-list { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 18px; }
        .menu-item { background: #f6faff; border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; min-width: 180px; }
        .menu-item-info { display: flex; flex-direction: column; }
        .menu-item-name { font-weight: 500; }
        .menu-item-price { color: #1890ff; }
        .menu-item button { background: #1890ff; color: #fff; border: none; border-radius: 4px; padding: 4px 10px; cursor: pointer; }
        .menu-cart { margin-top: 18px; background: #f9f9f9; border-radius: 8px; padding: 14px; }
        .menu-cart input { width: 100%; margin-bottom: 8px; padding: 8px; border-radius: 4px; border: 1px solid #ddd; }
        .menu-cart button { background: #52c41a; color: #fff; border: none; border-radius: 4px; padding: 6px 14px; cursor: pointer; margin-top: 8px; }
        .order-success { color: #52c41a; margin-top: 8px; text-align: center; }
      `}</style>
    </div>
  );
}

export default MenuPage;
