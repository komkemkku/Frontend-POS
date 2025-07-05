import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { customerApi } from '../api/customerApi';
import './CustomerMenuPage.css';

function CustomerMenuPage() {
    const { tableId } = useParams();
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [orderHistory, setOrderHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tableInfo, setTableInfo] = useState(null);

    useEffect(() => {
        loadData();
        loadOrderHistory();
    }, [tableId]);

    const loadData = async () => {
        try {
            // โหลดข้อมูลโต๊ะ
            const tableResponse = await customerApi.getTable(tableId);
            setTableInfo(tableResponse.data);

            // โหลดหมวดหมู่
            const categoriesResponse = await customerApi.getCategories();
            setCategories(categoriesResponse.data);

            // โหลดเมนู
            const menuResponse = await customerApi.getMenuItems();
            setMenuItems(menuResponse.data);

            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    };

    const loadOrderHistory = async () => {
        try {
            const response = await customerApi.getOrderHistory(tableId);
            setOrderHistory(response.data);
        } catch (error) {
            console.error('Error loading order history:', error);
        }
    };

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            setCart(cart.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            ));
        }
    };

    const submitOrder = async () => {
        if (cart.length === 0) return;

        try {
            const orderData = {
                tableId: tableId,
                items: cart.map(item => ({
                    menuItemId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: getTotalAmount(),
                status: 'pending'
            };

            const response = await customerApi.createOrder(orderData);
            
            if (response.status === 200 || response.status === 201) {
                alert('สั่งอาหารสำเร็จ! รอสักครู่จะมีพนักงานมาเสิร์ฟครับ');
                setCart([]);
                loadOrderHistory();
            } else {
                alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        }
    };

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const filteredMenuItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.categoryId === selectedCategory);

    if (loading) {
        return <div className="loading">กำลังโหลด...</div>;
    }

    return (
        <div className="customer-menu-page">
            <header className="customer-header">
                <h1>เมนูอาหาร</h1>
                <div className="table-info">
                    <span>โต๊ะ {tableInfo?.name || tableId}</span>
                    <button 
                        className="history-btn"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        ประวัติการสั่ง
                    </button>
                </div>
            </header>

            {showHistory && (
                <div className="order-history">
                    <h3>ประวัติการสั่งอาหารวันนี้</h3>
                    {orderHistory.length === 0 ? (
                        <p>ยังไม่มีการสั่งอาหาร</p>
                    ) : (
                        <div className="history-list">
                            {orderHistory.map(order => (
                                <div key={order.id} className="history-item">
                                    <div className="order-time">{new Date(order.createdAt).toLocaleTimeString('th-TH')}</div>
                                    <div className="order-items">
                                        {order.items.map(item => (
                                            <span key={item.id}>{item.name} x{item.quantity}</span>
                                        ))}
                                    </div>
                                    <div className="order-status">{order.status}</div>
                                    <div className="order-total">฿{order.totalAmount}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="menu-content">
                <div className="categories">
                    <button
                        className={selectedCategory === 'all' ? 'active' : ''}
                        onClick={() => setSelectedCategory('all')}
                    >
                        ทั้งหมด
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={selectedCategory === category.id ? 'active' : ''}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="menu-grid">
                    {filteredMenuItems.map(item => (
                        <div key={item.id} className="menu-item">
                            <img src={item.image} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p className="description">{item.description}</p>
                            <div className="price">฿{item.price}</div>
                            <button 
                                className="add-btn"
                                onClick={() => addToCart(item)}
                                disabled={!item.available}
                            >
                                {item.available ? 'เพิ่มลงตะกร้า' : 'หมด'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {cart.length > 0 && (
                <div className="cart">
                    <h3>ตะกร้าสินค้า</h3>
                    <div className="cart-items">
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <span className="item-name">{item.name}</span>
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                </div>
                                <span className="item-total">฿{item.price * item.quantity}</span>
                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
                            </div>
                        ))}
                    </div>
                    <div className="cart-total">
                        <strong>รวม: ฿{getTotalAmount()}</strong>
                    </div>
                    <button className="order-btn" onClick={submitOrder}>
                        สั่งอาหาร
                    </button>
                </div>
            )}
        </div>
    );
}

export default CustomerMenuPage;