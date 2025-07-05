import React, { useEffect, useState, useRef } from 'react';
import { adminApi } from '../api';
import MainLayout from '../components/MainLayout';
import { useAuth } from '../hooks/useAuth';

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
        filteredOrders = [
          {
            id: 1,
            table_id: 2,
            table_number: 2,
            status: 'pending',
            total_amount: 450,
            created_at: new Date().toISOString(),
            customer_name: 'คุณสมชาย',
            order_items: [
              { menu_name: 'ผัดไทย', quantity: 2, price: 120 },
              { menu_name: 'ต้มยำกุ้ง', quantity: 1, price: 180 }
            ]
          },
          {
            id: 2,
            table_id: 3,
            table_number: 3,
            status: 'preparing',
            total_amount: 320,
            created_at: new Date().toISOString(),
            customer_name: 'คุณสมหญิง',
            order_items: [
              { menu_name: 'ข้าวผัด', quantity: 2, price: 160 }
            ]
          },
          {
            id: 3,
            table_id: 4,
            table_number: 4,
            status: 'ready',
            total_amount: 280,
            created_at: new Date().toISOString(),
            customer_name: 'คุณสมศักดิ์',
            order_items: [
              { menu_name: 'ส้มตำ', quantity: 2, price: 80 },
              { menu_name: 'ไก่ย่าง', quantity: 1, price: 120 }
            ]
          }
        ];
      }
      
      // Filter by search term
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
          order.id.toString().includes(searchTerm) ||
          order.table_id?.toString().includes(searchTerm) ||
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
      <div className="page-container">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">จัดการออเดอร์</h1>
              <p className="text-sm text-gray-600">ติดตามและจัดการออเดอร์ทั้งหมด</p>
            </div>
            <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <span className="text-sm mr-2">🔄</span>
              รีเฟรช
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <div className="text-lg font-bold text-gray-800">{statusCounts.all}</div>
            <div className="text-xs text-gray-600">ทั้งหมด</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <div className="text-lg font-bold text-yellow-600">{statusCounts.pending}</div>
            <div className="text-xs text-gray-600">รอดำเนินการ</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{statusCounts.preparing}</div>
            <div className="text-xs text-gray-600">กำลังเตรียม</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <div className="text-lg font-bold text-green-600">{statusCounts.ready}</div>
            <div className="text-xs text-gray-600">พร้อมเสิร์ฟ</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <div className="text-lg font-bold text-green-600">{statusCounts.served}</div>
            <div className="text-xs text-gray-600">เสิร์ฟแล้ว</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <div className="text-lg font-bold text-green-600">{statusCounts.completed}</div>
            <div className="text-xs text-gray-600">เสร็จสิ้น</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-3 text-center">
            <div className="text-lg font-bold text-red-600">{statusCounts.cancelled}</div>
            <div className="text-xs text-gray-600">ยกเลิก</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-48">
              <input
                type="text"
                placeholder="ค้นหาออเดอร์ (ID, โต๊ะ, ชื่อลูกค้า)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-40"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="pending">รอดำเนินการ</option>
              <option value="preparing">กำลังเตรียม</option>
              <option value="ready">พร้อมเสิร์ฟ</option>
              <option value="served">เสิร์ฟแล้ว</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
            <button onClick={fetchOrders} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              ค้นหา
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-red-800">เกิดข้อผิดพลาด</h4>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Orders Grid */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">รายการออเดอร์ ({orders.length})</h3>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">ไม่มีออเดอร์</h3>
                <p className="text-gray-600 text-sm">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'ไม่พบออเดอร์ที่ตรงกับเงื่อนไขการค้นหา' 
                    : 'ยังไม่มีออเดอร์ในระบบ'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <div key={order.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getStatusBorderClass(order.status)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">ออเดอร์ #{order.id}</h4>
                        <p className="text-sm text-gray-600">โต๊ะ {order.table_id}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <span>⏰</span>
                        <span>{new Date(order.created_at).toLocaleString('th-TH', { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}</span>
                      </div>
                      {order.customer_name && (
                        <div className="flex items-center gap-2">
                          <span>👤</span>
                          <span>{order.customer_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span className="font-semibold">฿{order.total_amount?.toLocaleString()}</span>
                      </div>
                      {order.order_items && (
                        <div className="flex items-center gap-2">
                          <span>🍽️</span>
                          <span>{order.order_items.length} รายการ</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Order Items */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="mb-3">
                        <h5 className="font-semibold mb-2 text-sm">รายการอาหาร:</h5>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {order.order_items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                              <span className="truncate">{item.menu_name || item.name}</span>
                              <span>{item.quantity}x ฿{item.price}</span>
                            </div>
                          ))}
                          {order.order_items.length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{order.order_items.length - 3} รายการอื่น...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {canUpdateStatus(order.status) && getNextStatus(order.status) && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                          disabled={updatingOrderId === order.id}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                        >
                          {updatingOrderId === order.id ? 'กำลังอัปเดต...' : getNextStatusText(order.status)}
                        </button>
                      )}
                      
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          disabled={updatingOrderId === order.id}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                        >
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
