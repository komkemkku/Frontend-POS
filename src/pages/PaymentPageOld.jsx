import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import './PaymentPage.css';
import MainLayout from '../components/MainLayout';

function PaymentPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrdersForPayment();
  }, []);

  const fetchOrdersForPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching orders for payment...');
      
      // Get orders that are ready for payment (served status)
      const response = await axios.get('/orders', {
        params: { status: 'served', limit: 100 }
      });
      console.log('Orders for payment response:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'ไม่สามารถโหลดออเดอร์ได้');
      }
    } catch (err) {
      console.error('Orders fetch error:', err);
      setError(`ไม่สามารถโหลดออเดอร์ได้: ${err.response?.data?.message || err.message}`);
      toast.error(err.response?.data?.message || 'โหลดออเดอร์ไม่สำเร็จ');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = async (e) => {
    const orderId = e.target.value;
    setSelectedOrder(orderId);
    setOrderDetails(null);
    setSuccess(false);
    setError(null);
    
    if (orderId) {
      try {
        console.log('Fetching order details for payment:', orderId);
        const response = await axios.get(`/orders/${orderId}`);
        console.log('Order details response:', response.data);
        
        if (response.data.success) {
          setOrderDetails(response.data.data);
        } else {
          throw new Error(response.data.message || 'ไม่สามารถโหลดรายละเอียดออเดอร์ได้');
        }
      } catch (err) {
        console.error('Order details fetch error:', err);
        setOrderDetails(null);
        setError(`ไม่พบข้อมูลออเดอร์: ${err.response?.data?.message || err.message}`);
        toast.error('ไม่สามารถโหลดรายละเอียดออเดอร์ได้');
      }
    }
  };

  const handlePayment = async () => {
    if (!orderDetails) return;
    
    setPaying(true);
    setError(null);
    setSuccess(false);
    
    try {
      console.log('Processing payment for order:', orderDetails.id);
      
      // Create payment record
      const paymentResponse = await axios.post('/payments', {
        order_id: orderDetails.id,
        amount: orderDetails.total_amount,
        payment_method: paymentMethod,
        table_number: orderDetails.table_number || orderDetails.qr_code_identifier,
        notes: `ชำระเงินออเดอร์ #${orderDetails.id}`
      });
      
      console.log('Payment response:', paymentResponse.data);
      
      if (paymentResponse.data.success) {
        // Update order status to paid
        const statusResponse = await axios.patch(`/orders/${orderDetails.id}/status`, {
          status: 'paid'
        });
        
        console.log('Status update response:', statusResponse.data);
        
        if (statusResponse.data.success) {
          setSuccess(true);
          toast.success('ชำระเงินสำเร็จ!');
          
          // Reset form after successful payment
          setTimeout(() => {
            setSelectedOrder('');
            setOrderDetails(null);
            setSuccess(false);
            fetchOrdersForPayment(); // Refresh the orders list
          }, 3000);
        } else {
          throw new Error(statusResponse.data.message || 'ไม่สามารถอัปเดตสถานะออเดอร์ได้');
        }
      } else {
        throw new Error(paymentResponse.data.message || 'ไม่สามารถบันทึกการชำระเงินได้');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(`การชำระเงินไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
      toast.error('การชำระเงินไม่สำเร็จ');
    } finally {
      setPaying(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount || 0);
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'cash': return 'เงินสด';
      case 'credit_card': return 'บัตรเครดิต';
      case 'debit_card': return 'บัตรเดบิต';
      case 'qr_code': return 'QR Code';
      case 'bank_transfer': return 'โอนเงิน';
      default: return method;
    }
  };

  return (
    <MainLayout>
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-header">
            <h2 className="payment-title">ชำระเงิน</h2>
            <button onClick={fetchOrdersForPayment} className="refresh-btn">
              🔄 รีเฟรช
            </button>
          </div>

          {error && (
            <div className="payment-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          {success && (
            <div className="payment-success">
              <span>✅ ชำระเงินสำเร็จ!</span>
            </div>
          )}

          <div className="payment-form">
            <div className="form-group">
              <label htmlFor="order-select">เลือกออเดอร์ที่ต้องการชำระเงิน:</label>
              {loading ? (
                <div className="loading">กำลังโหลดออเดอร์...</div>
              ) : (
                <select 
                  id="order-select"
                  value={selectedOrder} 
                  onChange={handleOrderSelect}
                  className="order-select"
                  disabled={paying}
                >
                  <option value="">-- เลือกออเดอร์ --</option>
                  {orders.map(order => (
                    <option key={order.id} value={order.id}>
                      ออเดอร์ #{order.id} - โต๊ะ {order.table_number || order.qr_code_identifier} 
                      ({formatCurrency(order.total_amount)})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {orderDetails && (
              <div className="order-details">
                <h3>รายละเอียดออเดอร์ #{orderDetails.id}</h3>
                <div className="order-info">
                  <div className="info-item">
                    <strong>โต๊ะ:</strong> {orderDetails.table_number || orderDetails.qr_code_identifier}
                  </div>
                  <div className="info-item">
                    <strong>เวลาสั่ง:</strong> {
                      new Date((orderDetails.created_at || Date.now() / 1000) * 1000)
                        .toLocaleString('th-TH')
                    }
                  </div>
                  <div className="info-item">
                    <strong>สถานะ:</strong> {orderDetails.status}
                  </div>
                </div>

                <div className="order-items">
                  <h4>รายการอาหาร:</h4>
                  <div className="items-list">
                    {orderDetails.items && orderDetails.items.length > 0 ? (
                      orderDetails.items.map((item, index) => (
                        <div key={index} className="item">
                          <div className="item-info">
                            <span className="item-name">
                              {item.name || `เมนู ID: ${item.menu_item_id}`}
                            </span>
                            <span className="item-quantity">x{item.quantity || item.qty}</span>
                          </div>
                          <span className="item-total">
                            {formatCurrency(item.sub_total || (item.price_per_item * (item.quantity || item.qty)))}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="no-items">ไม่มีรายการอาหาร</div>
                    )}
                  </div>
                </div>

                <div className="payment-summary">
                  <div className="total-amount">
                    <strong>ยอดรวมทั้งสิ้น: {formatCurrency(orderDetails.total_amount)}</strong>
                  </div>
                </div>

                <div className="payment-method-group">
                  <label>วิธีการชำระเงิน:</label>
                  <div className="payment-methods">
                    <label className="payment-method">
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={paying}
                      />
                      <span>💰 เงินสด</span>
                    </label>
                    <label className="payment-method">
                      <input
                        type="radio"
                        value="credit_card"
                        checked={paymentMethod === 'credit_card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={paying}
                      />
                      <span>💳 บัตรเครดิต</span>
                    </label>
                    <label className="payment-method">
                      <input
                        type="radio"
                        value="qr_code"
                        checked={paymentMethod === 'qr_code'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={paying}
                      />
                      <span>📱 QR Code</span>
                    </label>
                    <label className="payment-method">
                      <input
                        type="radio"
                        value="bank_transfer"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={paying}
                      />
                      <span>🏦 โอนเงิน</span>
                    </label>
                  </div>
                </div>

                <div className="payment-actions">
                  <button 
                    onClick={handlePayment}
                    disabled={paying || !orderDetails}
                    className="pay-btn"
                  >
                    {paying ? 'กำลังดำเนินการ...' : `ชำระเงิน ${formatCurrency(orderDetails.total_amount)}`}
                  </button>
                </div>
              </div>
            )}

            {orders.length === 0 && !loading && (
              <div className="no-orders">
                <h3>ไม่มีออเดอร์ที่ต้องชำระเงิน</h3>
                <p>ออเดอร์ทั้งหมดได้ชำระเงินเรียบร้อยแล้ว</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PaymentPage;
