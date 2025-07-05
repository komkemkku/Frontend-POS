import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';
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
  const [receivedAmount, setReceivedAmount] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    fetchOrdersForPayment();
    const interval = setInterval(fetchOrdersForPayment, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrdersForPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get orders that are ready for payment (served status)
      const data = await adminApi.orders.getList();
      const payableOrders = (data || []).filter(order => 
        ['served', 'ready'].includes(order.status)
      );
      
      setOrders(payableOrders);
    } catch (err) {
      console.error('Orders fetch error:', err);
      setError(`ไม่สามารถโหลดออเดอร์ได้: ${err.message}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSelect = async (orderId) => {
    setSelectedOrder(orderId);
    setSuccess(false);
    setError(null);
    
    if (!orderId) {
      setOrderDetails(null);
      return;
    }
    
    try {
      const order = orders.find(o => o.id.toString() === orderId);
      setOrderDetails(order);
      setReceivedAmount(order?.total_amount?.toString() || '');
    } catch (err) {
      console.error('Order details fetch error:', err);
      setError(`ไม่สามารถโหลดรายละเอียดออเดอร์ได้: ${err.message}`);
      setOrderDetails(null);
    }
  };

  const calculateTotal = () => {
    if (!orderDetails) return 0;
    const subtotal = orderDetails.total_amount || 0;
    return Math.max(0, subtotal - discount);
  };

  const calculateChange = () => {
    const total = calculateTotal();
    const received = parseFloat(receivedAmount) || 0;
    return Math.max(0, received - total);
  };

  const handlePayment = async () => {
    if (!orderDetails) return;
    
    const total = calculateTotal();
    const received = parseFloat(receivedAmount) || 0;
    
    if (paymentMethod === 'cash' && received < total) {
      setError('จำนวนเงินที่รับมาไม่เพียงพอ');
      return;
    }
    
    try {
      setPaying(true);
      setError(null);
      
      // Create payment record
      const paymentData = {
        order_id: orderDetails.id,
        amount: total,
        payment_method: paymentMethod,
        received_amount: paymentMethod === 'cash' ? received : total,
        change_amount: paymentMethod === 'cash' ? calculateChange() : 0,
        discount: discount
      };
      
      await adminApi.payments.create(paymentData);
      
      // Update order status to completed
      await adminApi.orders.update(orderDetails.id, { status: 'completed' });
      
      setSuccess(true);
      setSelectedOrder('');
      setOrderDetails(null);
      setReceivedAmount('');
      setDiscount(0);
      
      // Refresh orders list
      fetchOrdersForPayment();
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(`การชำระเงินไม่สำเร็จ: ${err.message}`);
    } finally {
      setPaying(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      'cash': '💵',
      'credit_card': '💳',
      'bank_transfer': '🏦',
      'qr_code': '📱'
    };
    return icons[method] || '💰';
  };

  const getPaymentMethodText = (method) => {
    const texts = {
      'cash': 'เงินสด',
      'credit_card': 'บัตรเครดิต',
      'bank_transfer': 'โอนเงิน',
      'qr_code': 'QR Code'
    };
    return texts[method] || method;
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* Header */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">ชำระเงิน</h1>
                <p className="text-secondary">จัดการการชำระเงินของออเดอร์</p>
              </div>
              <button onClick={fetchOrdersForPayment} className="btn btn-outline">
                <span className="text-xl mr-2">🔄</span>
                รีเฟรช
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h4 className="font-bold">ชำระเงินสำเร็จ!</h4>
                <p>ออเดอร์ได้รับการชำระเงินเรียบร้อยแล้ว</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <h4 className="font-bold">เกิดข้อผิดพลาด</h4>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Selection */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-bold">เลือกออเดอร์</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-8">
                  <div className="loading-spinner mx-auto mb-4"></div>
                  <p>กำลังโหลดออเดอร์...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📋</div>
                  <h4 className="font-bold mb-2">ไม่มีออเดอร์ที่พร้อมชำระเงิน</h4>
                  <p className="text-secondary">ออเดอร์ที่พร้อมชำระเงินจะแสดงที่นี่</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div 
                      key={order.id}
                      onClick={() => handleOrderSelect(order.id.toString())}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                        selectedOrder === order.id.toString() 
                          ? 'border-primary bg-primary bg-opacity-10' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">ออเดอร์ #{order.id}</h4>
                          <p className="text-secondary">โต๊ะ {order.table_number || order.table_id}</p>
                          <p className="text-sm text-secondary">
                            {new Date(order.created_at).toLocaleString('th-TH')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">฿{order.total_amount?.toLocaleString()}</div>
                          <div className="text-xs px-2 py-1 bg-success text-white rounded">
                            {order.status === 'ready' ? 'พร้อมเสิร์ฟ' : 'เสิร์ฟแล้ว'}
                          </div>
                        </div>
                      </div>
                      
                      {order.order_items && (
                        <div className="mt-2 text-sm text-secondary">
                          {order.order_items.length} รายการ: {order.order_items.slice(0, 2).map(item => item.menu_name || item.name).join(', ')}
                          {order.order_items.length > 2 && ` และอีก ${order.order_items.length - 2} รายการ`}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-bold">ชำระเงิน</h3>
            </div>
            <div className="card-body">
              {!orderDetails ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">💳</div>
                  <h4 className="font-bold mb-2">เลือกออเดอร์เพื่อชำระเงิน</h4>
                  <p className="text-secondary">กรุณาเลือกออเดอร์จากรายการทางซ้าย</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold mb-3">สรุปออเดอร์ #{orderDetails.id}</h4>
                    {orderDetails.order_items && (
                      <div className="space-y-2 mb-3">
                        {orderDetails.order_items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.menu_name || item.name} x{item.quantity}</span>
                            <span>฿{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>ยอดรวม</span>
                        <span>฿{orderDetails.total_amount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">ส่วนลด (บาท)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="input w-full"
                      min="0"
                      max={orderDetails.total_amount}
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">วิธีการชำระเงิน</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['cash', 'credit_card', 'bank_transfer', 'qr_code'].map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`p-3 border rounded-lg text-center transition-all ${
                            paymentMethod === method 
                              ? 'border-primary bg-primary text-white' 
                              : 'border-gray-200 hover:border-primary'
                          }`}
                        >
                          <div className="text-2xl mb-1">{getPaymentMethodIcon(method)}</div>
                          <div className="text-sm">{getPaymentMethodText(method)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cash Payment Details */}
                  {paymentMethod === 'cash' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">จำนวนเงินที่รับมา</label>
                      <input
                        type="number"
                        value={receivedAmount}
                        onChange={(e) => setReceivedAmount(e.target.value)}
                        className="input w-full text-lg"
                        placeholder="0.00"
                        step="0.01"
                      />
                      
                      {receivedAmount && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span>ยอดที่ต้องชำระ:</span>
                            <span className="font-bold">฿{calculateTotal().toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span>เงินที่รับมา:</span>
                            <span>฿{parseFloat(receivedAmount || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>เงินทอน:</span>
                            <span className={calculateChange() >= 0 ? 'text-success' : 'text-error'}>
                              ฿{calculateChange().toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total Amount */}
                  <div className="bg-primary bg-opacity-10 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">ยอดชำระสุทธิ:</span>
                      <span className="text-2xl font-bold text-primary">
                        ฿{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={paying || (paymentMethod === 'cash' && parseFloat(receivedAmount || 0) < calculateTotal())}
                    className="btn btn-primary w-full py-4 text-lg"
                  >
                    {paying ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-2"></div>
                        กำลังดำเนินการ...
                      </div>
                    ) : (
                      <>
                        <span className="text-2xl mr-2">💳</span>
                        ชำระเงิน ฿{calculateTotal().toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PaymentPage;
