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
      
      const data = await adminApi.orders.getList();
      let payableOrders = (Array.isArray(data) ? data : []).filter(order => 
        ['served', 'ready', 'completed'].includes(order.status)
      );
      
      // Map field names to ensure consistency
      payableOrders = payableOrders.map(order => ({
        ...order,
        table_number: order.table_number || order.tableNumber || order.table_id,
        total_amount: order.total_amount || order.totalAmount,
        created_at: order.created_at || order.createdAt,
        customer_name: order.customer_name || order.customerName || 'ลูกค้าทั่วไป',
        order_items: order.order_items || order.orderItems || order.items || []
      }));
      
      // Add fallback data if empty for testing
      if (payableOrders.length === 0) {
        payableOrders = [
          {
            id: 4,
            table_id: 5,
            table_number: 5,
            status: 'served',
            total_amount: 580,
            created_at: new Date().toISOString(),
            customer_name: 'คุณสมพร',
            order_items: [
              { menu_name: 'ผัดกะเพรา', quantity: 1, price: 120 },
              { menu_name: 'แกงเขียวหวาน', quantity: 1, price: 160 },
              { menu_name: 'ข้าวเปล่า', quantity: 3, price: 100 }
            ]
          },
          {
            id: 5,
            table_id: 6,
            table_number: 6,
            status: 'ready',
            total_amount: 420,
            created_at: new Date().toISOString(),
            customer_name: 'คุณสมใจ',
            order_items: [
              { menu_name: 'ลาบหมู', quantity: 1, price: 140 },
              { menu_name: 'ส้มตำไทย', quantity: 2, price: 140 }
            ]
          }
        ];
      }
      
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
      const orderData = await adminApi.orders.getById(orderId);
      
      // Map field names for consistency
      const mappedOrderData = {
        ...orderData,
        table_number: orderData.table_number || orderData.tableNumber || orderData.table_id,
        total_amount: orderData.total_amount || orderData.totalAmount,
        created_at: orderData.created_at || orderData.createdAt,
        customer_name: orderData.customer_name || orderData.customerName || 'ลูกค้าทั่วไป',
        order_items: (orderData.order_items || orderData.orderItems || orderData.items || []).map(item => ({
          ...item,
          menu_name: item.menu_name || item.menuName || item.name,
          quantity: item.quantity,
          price: item.price || item.unitPrice
        }))
      };
      
      setOrderDetails(mappedOrderData);
      setReceivedAmount(mappedOrderData.total_amount?.toString() || '');
    } catch (err) {
      console.error('Order details fetch error:', err);
      setError(`ไม่สามารถโหลดรายละเอียดออเดอร์ได้: ${err.message}`);
      setOrderDetails(null);
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

      const paymentData = {
        order_id: orderDetails.id,
        amount: totalAfterDiscount,
        payment_method: paymentMethod,
        received_amount: received,
        change_amount: paymentMethod === 'cash' ? Math.max(0, received - totalAfterDiscount) : 0,
        discount: discount
      };
      
      await adminApi.payments.create(paymentData);
      await adminApi.orders.update(orderDetails.id, { status: 'completed' });
      
      setSuccess(true);
      setSelectedOrder('');
      setOrderDetails(null);
      setReceivedAmount('');
      setDiscount(0);
      
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

  const totalAfterDiscount = orderDetails ? orderDetails.total_amount - discount : 0;
  const changeAmount = paymentMethod === 'cash' && receivedAmount ? 
    Math.max(0, parseFloat(receivedAmount) - totalAfterDiscount) : 0;

  return (
    <MainLayout>
      <div className="page-container">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">ชำระเงิน</h1>
              <p className="text-sm text-gray-600">จัดการการชำระเงินสำหรับออเดอร์</p>
            </div>
            <button onClick={fetchOrdersForPayment} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <span className="text-sm mr-2">🔄</span>
              รีเฟรช
            </button>
          </div>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h4 className="font-semibold text-green-800">ชำระเงินสำเร็จ!</h4>
                <p className="text-green-700">ออเดอร์ได้รับการชำระเงินเรียบร้อยแล้ว</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-red-800">เกิดข้อผิดพลาด</h4>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Order Selection */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">เลือกออเดอร์</h3>
            </div>
            <div className="p-4">
              {loading ? (
                <div className="text-center py-6">
                  <div className="loading-spinner mx-auto mb-3"></div>
                  <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">💳</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">ไม่มีออเดอร์ที่ต้องชำระเงิน</h3>
                  <p className="text-gray-600 text-sm">ออเดอร์ที่พร้อมชำระเงินจะแสดงที่นี่</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => handleOrderSelect(order.id)}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedOrder === order.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-800">ออเดอร์ #{order.id}</h4>
                          <p className="text-sm text-gray-600">โต๊ะ {order.table_id}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleString('th-TH')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-blue-600">
                            ฿{order.total_amount?.toLocaleString()}
                          </div>
                          <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {order.status === 'served' ? 'เสิร์ฟแล้ว' : 'พร้อมเสิร์ฟ'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">รายละเอียดการชำระเงิน</h3>
            </div>
            <div className="p-4">
              {!orderDetails ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">👆</div>
                  <p className="text-gray-600">กรุณาเลือกออเดอร์ที่ต้องการชำระเงิน</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Order Info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold mb-2">ออเดอร์ #{orderDetails.id}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>โต๊ะ:</span>
                        <span>{orderDetails.table_number || orderDetails.table_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>จำนวนรายการ:</span>
                        <span>{orderDetails.order_items?.length || 0} รายการ</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>ยอดรวม:</span>
                        <span>฿{orderDetails.total_amount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      วิธีการชำระเงิน
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['cash', 'credit_card', 'bank_transfer', 'qr_code'].map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            paymentMethod === method
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-xl mb-1">{getPaymentMethodIcon(method)}</div>
                          <div className="text-xs font-medium">{getPaymentMethodText(method)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ส่วนลด (บาท)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={orderDetails.total_amount}
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  {/* Cash Payment Fields */}
                  {paymentMethod === 'cash' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        จำนวนเงินที่รับ
                      </label>
                      <input
                        type="number"
                        min={totalAfterDiscount}
                        value={receivedAmount}
                        onChange={(e) => setReceivedAmount(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={totalAfterDiscount.toString()}
                      />
                    </div>
                  )}

                  {/* Payment Summary */}
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ยอดรวม:</span>
                      <span>฿{orderDetails.total_amount?.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>ส่วนลด:</span>
                        <span>-฿{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>ยอดที่ต้องชำระ:</span>
                      <span>฿{totalAfterDiscount.toLocaleString()}</span>
                    </div>
                    {paymentMethod === 'cash' && changeAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>เงินทอน:</span>
                        <span>฿{changeAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={paying || (paymentMethod === 'cash' && parseFloat(receivedAmount) < totalAfterDiscount)}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paying ? 'กำลังดำเนินการ...' : `ชำระเงิน ฿${totalAfterDiscount.toLocaleString()}`}
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
