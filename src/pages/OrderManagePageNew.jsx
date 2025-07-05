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
      
      // Filter by search term
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
          order.id.toString().includes(searchTerm) ||
          order.table_number?.toString().includes(searchTerm) ||
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
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">จัดการออเดอร์</h1>
                <p className="text-secondary">ติดตามและจัดการออเดอร์ทั้งหมด</p>
              </div>
              <button onClick={fetchOrders} className="btn btn-outline">
                <span className="text-xl mr-2">🔄</span>
                รีเฟรช
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-primary">{statusCounts.all}</div>
              <div className="text-secondary text-sm">ทั้งหมด</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-warning">{statusCounts.pending}</div>
              <div className="text-secondary text-sm">รอดำเนินการ</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-primary">{statusCounts.preparing}</div>
              <div className="text-secondary text-sm">กำลังเตรียม</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-success">{statusCounts.ready}</div>
              <div className="text-secondary text-sm">พร้อมเสิร์ฟ</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-success">{statusCounts.served}</div>
              <div className="text-secondary text-sm">เสิร์ฟแล้ว</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-success">{statusCounts.completed}</div>
              <div className="text-secondary text-sm">เสร็จสิ้น</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-error">{statusCounts.cancelled}</div>
              <div className="text-secondary text-sm">ยกเลิก</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="ค้นหาออเดอร์ (ID, โต๊ะ, ชื่อลูกค้า)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input w-full"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-48"
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="preparing">กำลังเตรียม</option>
                <option value="ready">พร้อมเสิร์ฟ</option>
                <option value="served">เสิร์ฟแล้ว</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
              <button onClick={fetchOrders} className="btn btn-primary">
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <h4 className="font-bold">เกิดข้อผิดพลาด</h4>
            <p>{error}</p>
          </div>
        )}

        {/* Orders Grid */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-bold">รายการออเดอร์ ({orders.length})</h3>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-12">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-lg">กำลังโหลดข้อมูล...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold mb-2">ไม่มีออเดอร์</h3>
                <p className="text-secondary">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'ไม่พบออเดอร์ที่ตรงกับเงื่อนไขการค้นหา' 
                    : 'ยังไม่มีออเดอร์ในระบบ'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="card hover-lift border-l-4" style={{borderLeftColor: getStatusColor(order.status).replace('bg-', '#')}}>
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold">ออเดอร์ #{order.id}</h4>
                          <p className="text-secondary">โต๊ะ {order.table_number || order.table_id}</p>
                        </div>
                        <span className={`status-badge ${getStatusColor(order.status)} text-white`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <span>⏰</span>
                          <span>{new Date(order.created_at).toLocaleString('th-TH')}</span>
                        </div>
                        {order.customer_name && (
                          <div className="flex items-center gap-2">
                            <span>👤</span>
                            <span>{order.customer_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span className="font-bold">฿{order.total_amount?.toLocaleString()}</span>
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
                        <div className="mb-4">
                          <h5 className="font-semibold mb-2">รายการอาหาร:</h5>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {order.order_items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                <span>{item.menu_name || item.name}</span>
                                <span>{item.quantity}x ฿{item.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {canUpdateStatus(order.status) && getNextStatus(order.status) && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                            disabled={updatingOrderId === order.id}
                            className="btn btn-primary flex-1"
                          >
                            {updatingOrderId === order.id ? 'กำลังอัปเดต...' : getNextStatusText(order.status)}
                          </button>
                        )}
                        
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            disabled={updatingOrderId === order.id}
                            className="btn btn-error"
                          >
                            ยกเลิก
                          </button>
                        )}
                      </div>
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

export default OrderManagePage;
