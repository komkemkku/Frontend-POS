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
            setLoading(true);
            
            // โหลดข้อมูลโต๊ะ
            const tableInfo = await customerApi.getTable(tableId);
            setTableInfo(tableInfo);

            // โหลดหมวดหมู่
            const categoriesData = await customerApi.getCategories();
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);

            // โหลดเมนู
            const menuData = await customerApi.getMenuItems();
            setMenuItems(Array.isArray(menuData) ? menuData : []);

            setLoading(false);
        } catch (error) {
            console.error('Error loading data:', error);
            setLoading(false);
        }
    };

    const loadOrderHistory = async () => {
        try {
            const orderData = await customerApi.getOrderHistory(tableId);
            setOrderHistory(Array.isArray(orderData) ? orderData : []);
        } catch (error) {
            console.error('Error loading order history:', error);
            setOrderHistory([]);
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
                qr_code_identifier: tableId,
                table_id: tableInfo?.table_id || tableId,
                items: cart.map(item => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name
                })),
                total_amount: getTotalAmount(),
                status: 'pending',
                order_type: 'dine_in'
            };

            const result = await customerApi.createOrder(orderData);
            
            // Handle successful response
            if (result) {
                alert('สั่งอาหารสำเร็จ! รอสักครู่จะมีพนักงานมาเสิร์ฟครับ');
                setCart([]);
                loadOrderHistory();
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('เกิดข้อผิดพลาดในการสั่งอาหาร กรุณาลองใหม่อีกครั้ง');
        }
    };

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const filteredMenuItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => {
            // Support both categoryId and category_id fields
            const categoryId = item.categoryId || item.category_id;
            const categoryName = item.category || item.category_name;
            
            return categoryId === selectedCategory || categoryName === selectedCategory;
        });

    if (loading) {
        return <div className="loading">กำลังโหลด...</div>;
    }

    return (
        <div className="customer-menu-page">
            <header className="customer-header">
                <h1>เมนูอาหาร</h1>
                <div className="table-info">
                    <span>โต๊ะ {tableInfo?.table_name || tableInfo?.name || tableId}</span>
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
                                    <div className="order-time">
                                        {new Date(order.created_at || order.createdAt).toLocaleTimeString('th-TH')}
                                    </div>
                                    <div className="order-items">
                                        {(order.items || order.order_items || []).map(item => (
                                            <span key={item.id}>
                                                {item.name || item.menu_item_name} x{item.quantity}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="order-status">
                                        {order.status === 'pending' ? 'รอเสิร์ฟ' : 
                                         order.status === 'preparing' ? 'กำลังทำ' :
                                         order.status === 'served' ? 'เสิร์ฟแล้ว' :
                                         order.status === 'completed' ? 'เสร็จสิ้น' : order.status}
                                    </div>
                                    <div className="order-total">
                                        ฿{order.total_amount || order.totalAmount}
                                    </div>
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
                            <img 
                                src={item.image || item.image_url || '/placeholder-food.svg'} 
                                alt={item.name} 
                                onError={(e) => {
                                    e.target.src = '/placeholder-food.svg';
                                }}
                            />
                            <h3>{item.name}</h3>
                            <p className="description">{item.description}</p>
                            <div className="price">฿{item.price}</div>
                            <button 
                                className="add-btn"
                                onClick={() => addToCart(item)}
                                disabled={!item.available && item.available !== undefined}
                            >
                                {(item.available === false) ? 'หมด' : 'เพิ่มลงตะกร้า'}
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