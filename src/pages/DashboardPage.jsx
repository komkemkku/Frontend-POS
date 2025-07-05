

import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../components/MainLayout';

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    tables: [],
    todayOrders: [],
    userInfo: null, // เพิ่มสำหรับข้อมูลจาก /info
    summary: {
      total_tables: 0,
      occupied_tables: 0,
      available_tables: 0,
      reserved_tables: 0,
      maintenance_tables: 0,
      today_orders: 0,
      today_revenue: 0,
      pending_orders: 0,
      completed_orders: 0,
      total_menu_items: 0,
      available_menu_items: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
    // อัปเดตข้อมูลทุก 30 วินาที
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      console.log('Fetching dashboard data...');
      
      // ดึงข้อมูลโต๊ะทั้งหมด
      let tables = [];
      try {
        const tablesResponse = await adminApi.getTables();
        console.log('Tables response:', tablesResponse);
        // Handle API response structure
        if (tablesResponse?.data) {
          tables = Array.isArray(tablesResponse.data) ? tablesResponse.data : [];
        } else if (Array.isArray(tablesResponse)) {
          tables = tablesResponse;
        } else {
          console.warn('Unexpected tables data structure:', tablesResponse);
        }
      } catch (tableErr) {
        console.log('Tables API not available:', tableErr.message);
      }
      
      // ดึงข้อมูลออเดอร์วันนี้
      let todayOrders = [];
      try {
        const ordersResponse = await adminApi.orders.getList();
        console.log('Orders response:', ordersResponse);
        
        let allOrders = [];
        if (ordersResponse?.data) {
          allOrders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];
        } else if (Array.isArray(ordersResponse)) {
          allOrders = ordersResponse;
        }
        
        const today = new Date().toDateString();
        todayOrders = allOrders.filter(order => 
          new Date(order.created_at).toDateString() === today
        );
      } catch (orderErr) {
        console.log('Orders API not available:', orderErr.message);
      }

      // ดึงข้อมูลเมนู
      let menuItems = [];
      try {
        const menuResponse = await adminApi.menuItems.getList();
        console.log('Menu response:', menuResponse);
        
        if (menuResponse?.data) {
          menuItems = Array.isArray(menuResponse.data) ? menuResponse.data : [];
        } else if (Array.isArray(menuResponse)) {
          menuItems = menuResponse;
        }
      } catch (menuErr) {
        console.log('Menu items API not available:', menuErr.message);
      }

      // ดึงข้อมูลผู้ใช้จาก /staff/info
      let userInfo = null;
      try {
        const infoResponse = await adminApi.getUserInfo();
        console.log('Staff info response:', infoResponse);
        
        if (infoResponse?.data) {
          userInfo = infoResponse.data;
        } else if (infoResponse) {
          userInfo = infoResponse;
        }
      } catch (infoErr) {
        console.log('Staff info API not available:', infoErr.message);
      }

      // Fallback data ถ้าไม่มีข้อมูลจาก API
      if (!userInfo) {
        userInfo = {
          full_name: 'คุณ Admin',
          role: 'ผู้จัดการ',
          username: 'admin'
        };
      }

      // คำนวณสรุปข้อมูล
      const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const availableTables = tables.filter(t => t.status === 'available').length;
      const occupiedTables = tables.filter(t => t.status === 'occupied').length;
      const pendingOrders = todayOrders.filter(o => ['pending', 'preparing'].includes(o.status)).length;
      const completedOrders = todayOrders.filter(o => o.status === 'completed').length;

      // Fallback data ถ้าไม่มีข้อมูลจาก API
      if (tables.length === 0) {
        tables = [
          { id: 1, table_number: 1, status: 'available', capacity: 4 },
          { id: 2, table_number: 2, status: 'occupied', capacity: 2 },
          { id: 3, table_number: 3, status: 'reserved', capacity: 6 },
          { id: 4, table_number: 4, status: 'available', capacity: 4 },
          { id: 5, table_number: 5, status: 'maintenance', capacity: 8 }
        ];
      }
      
      if (todayOrders.length === 0) {
        todayOrders = [
          { 
            id: 1, 
            table_id: 2, 
            status: 'preparing', 
            total_amount: 450, 
            created_at: new Date().toISOString(),
            order_items: [
              { menu_name: 'ผัดไทย', quantity: 2, price: 120 },
              { menu_name: 'ต้มยำกุ้ง', quantity: 1, price: 180 }
            ]
          },
          { 
            id: 2, 
            table_id: 3, 
            status: 'completed', 
            total_amount: 320, 
            created_at: new Date().toISOString(),
            order_items: [
              { menu_name: 'ข้าวผัด', quantity: 2, price: 160 }
            ]
          }
        ];
      }
      
      if (menuItems.length === 0) {
        menuItems = [
          { id: 1, name: 'ผัดไทย', price: 120, is_available: true },
          { id: 2, name: 'ต้มยำกุ้ง', price: 180, is_available: true },
          { id: 3, name: 'ข้าวผัด', price: 160, is_available: false },
          { id: 4, name: 'ส้มตำ', price: 80, is_available: true }
        ];
      }

      let summary = {
        total_tables: tables.length,
        occupied_tables: tables.filter(t => t.status === 'occupied').length,
        available_tables: tables.filter(t => t.status === 'available').length,
        reserved_tables: tables.filter(t => t.status === 'reserved').length,
        maintenance_tables: tables.filter(t => t.status === 'maintenance').length,
        today_orders: todayOrders.length,
        today_revenue: todayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
        pending_orders: todayOrders.filter(o => ['pending', 'preparing'].includes(o.status)).length,
        completed_orders: todayOrders.filter(o => o.status === 'completed').length,
        total_menu_items: menuItems.length,
        available_menu_items: menuItems.filter(m => m.is_available).length
      };
      
      // พยายามดึงข้อมูลสรุปจาก API หากมี
      // หมายเหตุ: ต้องรอให้หลังบ้านส่งข้อมูลจาก /summary API
      try {
        const summaryData = await adminApi.getDashboardSummary();
        if (summaryData) {
          console.log('Summary data from API:', summaryData);
          summary = { ...summary, ...summaryData };
        }
      } catch (summaryErr) {
        console.log('Dashboard summary API not available, using calculated data');
        console.log('Note: Waiting for backend to provide /summary API endpoint');
      }
      
      setDashboardData({ 
        tables, 
        summary, 
        userInfo, 
        todayOrders: todayOrders.slice(0, 5) 
      });
      
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(`ไม่สามารถโหลดข้อมูลได้: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* Header Section */}
        <div className="content-card mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  แดชบอร์ด POS
                </span>
              </h1>
              <p className="text-sm text-gray-600">ภาพรวมการดำเนินงานของร้าน</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-800">
                ยินดีต้อนรับ, {dashboardData.userInfo?.full_name || dashboardData.userInfo?.first_name + ' ' + dashboardData.userInfo?.last_name || user?.first_name + ' ' + user?.last_name || 'ผู้ใช้งาน'}
              </p>
              <p className="text-sm text-gray-600">
                ตำแหน่ง: {dashboardData.userInfo?.role || dashboardData.userInfo?.position || user?.position || 'พนักงาน'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-2xl mb-2">🏠</div>
              <div className="text-2xl font-bold text-gray-800">{dashboardData.summary.total_tables}</div>
              <div className="text-sm text-gray-600">โต๊ะทั้งหมด</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-600">{dashboardData.summary.available_tables}</div>
              <div className="text-sm text-gray-600">โต๊ะว่าง</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-2xl font-bold text-red-600">{dashboardData.summary.occupied_tables}</div>
              <div className="text-sm text-gray-600">โต๊ะมีลูกค้า</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-2xl mb-2">📋</div>
              <div className="text-2xl font-bold text-blue-600">{dashboardData.summary.today_orders}</div>
              <div className="text-sm text-gray-600">ออเดอร์วันนี้</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-2xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-yellow-600">{dashboardData.summary.pending_orders}</div>
              <div className="text-sm text-gray-600">ออเดอร์รอ</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-2xl font-bold text-purple-600">
                {dashboardData.summary.today_revenue < 1000000 
                  ? `฿${dashboardData.summary.today_revenue.toLocaleString()}` 
                  : `฿${(dashboardData.summary.today_revenue / 1000).toFixed(0)}K`
                }
              </div>
              <div className="text-sm text-gray-600">รายได้วันนี้</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">📋</div>
              <h3 className="text-lg font-semibold text-gray-800">ออเดอร์ล่าสุด</h3>
            </div>
            {dashboardData.todayOrders.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📋</div>
                <h4 className="text-gray-500 mb-2">ยังไม่มีออเดอร์วันนี้</h4>
                <p className="text-sm text-gray-400">ออเดอร์จะแสดงที่นี่เมื่อมีการสั่งอาหาร</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.todayOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-800">#{order.id} - โต๊ะ {order.table_id}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleTimeString('th-TH', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-primary">฿{order.total_amount?.toLocaleString()}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getOrderStatusClass(order.status)}`}>
                          {getOrderStatusText(order.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-800">สถิติเมนู</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{dashboardData.summary.total_menu_items}</div>
                <div className="text-sm text-blue-700">เมนูทั้งหมด</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{dashboardData.summary.available_menu_items}</div>
                <div className="text-sm text-green-700">เปิดขาย</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border">
                <div className="text-2xl font-bold text-yellow-600">{dashboardData.summary.completed_orders}</div>
                <div className="text-sm text-yellow-700">เสร็จแล้ว</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border">
                <div className="text-2xl font-bold text-red-600">{dashboardData.summary.maintenance_tables}</div>
                <div className="text-sm text-red-700">โต๊ะปิดปรับปรุง</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="text-2xl mr-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-800">การดำเนินการด่วน</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
              <span className="text-2xl mb-2">📋</span>
              <span className="text-sm font-medium">ดูออเดอร์</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200">
              <span className="text-2xl mb-2">🍽️</span>
              <span className="text-sm font-medium">จัดการเมนู</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors border border-yellow-200">
              <span className="text-2xl mb-2">🪑</span>
              <span className="text-sm font-medium">จัดการโต๊ะ</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
              <span className="text-2xl mb-2">📊</span>
              <span className="text-sm font-medium">รายงาน</span>
            </button>
          </div>
        </div>

        {/* Tables Status */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-8">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-red-800">เกิดข้อผิดพลาด</h4>
                  <p className="text-red-700">{error}</p>
                </div>
                <button onClick={fetchDashboardData} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  ลองใหม่
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">🪑</div>
              <h3 className="text-lg font-semibold text-gray-800">สถานะโต๊ะทั้งหมด</h3>
            </div>
            {dashboardData.tables.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🪑</div>
                <h3 className="text-gray-500 mb-2">ไม่มีข้อมูลโต๊ะ</h3>
                <p className="text-sm text-gray-400">กรุณาเพิ่มโต๊ะในระบบก่อนใช้งาน</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dashboardData.tables.map((table) => (
                  <div key={table.id} className={`border rounded-lg p-4 hover:shadow-md transition-all ${getTableStatusClass(table.status)}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-800">โต๊ะ {table.table_number}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(table.status)}`}>
                        {renderTableStatus(table.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span>🎯</span>
                        <span className="text-gray-700">QR: {table.qr_code_identifier}</span>
                      </div>
                      
                      {table.capacity && (
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span className="text-gray-700">{table.capacity} ที่นั่ง</span>
                        </div>
                      )}
                      
                      {table.current_orders && table.current_orders > 0 && (
                        <div className="flex items-center gap-2">
                          <span>📋</span>
                          <span className="text-gray-700">{table.current_orders} ออเดอร์</span>
                        </div>
                      )}
                      
                      {table.total_amount && table.total_amount > 0 && (
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span className="text-gray-700">฿{table.total_amount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function getOrderStatusClass(status) {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'preparing': 'bg-blue-100 text-blue-800',
    'ready': 'bg-green-100 text-green-800',
    'served': 'bg-green-100 text-green-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
}

function getOrderStatusText(status) {
  const statusTexts = {
    'pending': 'รอดำเนินการ',
    'preparing': 'กำลังเตรียม',
    'ready': 'พร้อมเสิร์ฟ',
    'served': 'เสิร์ฟแล้ว',
    'completed': 'เสร็จสิ้น',
    'cancelled': 'ยกเลิก'
  };
  return statusTexts[status] || status;
}

function renderTableStatus(status) {
  const statusConfig = {
    'available': { text: 'ว่าง', icon: '✅' },
    'occupied': { text: 'มีลูกค้า', icon: '👥' },
    'reserved': { text: 'จองแล้ว', icon: '🔒' },
    'maintenance': { text: 'ปิดปรับปรุง', icon: '⚙️' }
  };
  
  const config = statusConfig[status] || statusConfig['available'];
  return `${config.icon} ${config.text}`;
}

function getTableStatusClass(status) {
  const statusClasses = {
    'available': 'border-l-4 border-green-400 bg-green-50',
    'occupied': 'border-l-4 border-red-400 bg-red-50',
    'reserved': 'border-l-4 border-yellow-400 bg-yellow-50',
    'maintenance': 'border-l-4 border-gray-400 bg-gray-50'
  };
  return statusClasses[status] || statusClasses['available'];
}

function getStatusBadgeClass(status) {
  const badgeClasses = {
    'available': 'bg-green-100 text-green-800',
    'occupied': 'bg-red-100 text-red-800',
    'reserved': 'bg-yellow-100 text-yellow-800',
    'maintenance': 'bg-gray-100 text-gray-800'
  };
  return badgeClasses[status] || badgeClasses['available'];
}

export default DashboardPage;
