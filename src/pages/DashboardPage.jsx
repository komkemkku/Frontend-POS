import React, { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { useAuth } from '../hooks/useAuth';
import MainLayout from '../components/MainLayout';
import './DashboardPage.css';

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
      // ข้อมูลที่ควรได้รับจาก Backend API /summary:
      // {
      //   "total_tables": 20,
      //   "occupied_tables": 12,
      //   "available_tables": 6,
      //   "reserved_tables": 2,
      //   "maintenance_tables": 0,
      //   "today_orders": 45,
      //   "today_revenue": 12500.50,
      //   "pending_orders": 8,
      //   "completed_orders": 35,
      //   "cancelled_orders": 2,
      //   "total_menu_items": 120,
      //   "available_menu_items": 115,
      //   "unavailable_menu_items": 5,
      //   "total_staff": 12,
      //   "active_staff": 8,
      //   "peak_hour_info": {
      //     "current_hour": 12,
      //     "is_peak_hour": true,
      //     "avg_orders_per_hour": 6.5
      //   },
      //   "payment_summary": {
      //     "cash_payments": 8500.00,
      //     "card_payments": 4000.50,
      //     "online_payments": 0.00
      //   },
      //   "popular_items": [
      //     {"menu_id": 1, "name": "ผัดไทย", "orders_count": 12},
      //     {"menu_id": 5, "name": "ต้มยำกุ้ง", "orders_count": 8}
      //   ]
      // }
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

  const getTableStatusText = (status) => {
    const statusTexts = {
      'available': 'ว่าง',
      'occupied': 'มีลูกค้า',
      'reserved': 'จองแล้ว',
      'maintenance': 'ปรับปรุง',
      'cleaning': 'ทำความสะอาด'
    };
    return statusTexts[status] || status;
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Header Section */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">แดชบอร์ด POS</h1>
              <p className="dashboard-subtitle">ภาพรวมการดำเนินงานของร้าน - อัปเดตล่าสุด: {new Date().toLocaleTimeString('th-TH')}</p>
            </div>
            <div className="dashboard-user-info">
              <p className="user-welcome">
                ยินดีต้อนรับ, {dashboardData.userInfo?.full_name || dashboardData.userInfo?.first_name + ' ' + dashboardData.userInfo?.last_name || user?.first_name + ' ' + user?.last_name || 'ผู้ใช้งาน'}
              </p>
              <p className="user-position">
                ตำแหน่ง: {dashboardData.userInfo?.role || dashboardData.userInfo?.position || user?.position || 'พนักงาน'}
              </p>
              <button 
                onClick={fetchDashboardData} 
                disabled={loading}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '🔄 กำลังรีเฟรช...' : '🔄 รีเฟรข'}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">🏠</span>
              <div className="stat-value">{dashboardData.summary.total_tables}</div>
              <div className="stat-label">โต๊ะทั้งหมด</div>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <div className="stat-value" style={{color: '#10b981'}}>{dashboardData.summary.available_tables}</div>
              <div className="stat-label">โต๊ะว่าง</div>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <div className="stat-value" style={{color: '#ef4444'}}>{dashboardData.summary.occupied_tables}</div>
              <div className="stat-label">โต๊ะมีลูกค้า</div>
            </div>
            
            {dashboardData.summary.reserved_tables > 0 && (
              <div className="stat-card">
                <span className="stat-icon">�</span>
                <div className="stat-value" style={{color: '#3b82f6'}}>{dashboardData.summary.reserved_tables}</div>
                <div className="stat-label">โต๊ะจอง</div>
              </div>
            )}
            
            <div className="stat-card">
              <span className="stat-icon">�📋</span>
              <div className="stat-value" style={{color: '#3b82f6'}}>{dashboardData.summary.today_orders}</div>
              <div className="stat-label">ออเดอร์วันนี้</div>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">⏳</span>
              <div className="stat-value" style={{color: '#f59e0b'}}>{dashboardData.summary.pending_orders}</div>
              <div className="stat-label">ออเดอร์รอ</div>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">💰</span>
              <div className="stat-value" style={{color: '#8b5cf6'}}>
                {dashboardData.summary.today_revenue < 1000000 
                  ? `฿${dashboardData.summary.today_revenue.toLocaleString()}` 
                  : `฿${(dashboardData.summary.today_revenue / 1000).toFixed(0)}K`
                }
              </div>
              <div className="stat-label">รายได้วันนี้</div>
            </div>
          </div>

          {/* Table Status Overview */}
          <div className="content-card table-overview">
            <div className="content-card-header">
              <span className="content-card-icon">🍽️</span>
              <h3 className="content-card-title">สถานะโต๊ะ</h3>
              <div className="table-utilization">
                <span>อัตราการใช้งาน: </span>
                <span style={{color: dashboardData.summary.occupied_tables / dashboardData.summary.total_tables > 0.8 ? '#ef4444' : '#10b981', fontWeight: 'bold'}}>
                  {dashboardData.summary.total_tables > 0 ? Math.round((dashboardData.summary.occupied_tables / dashboardData.summary.total_tables) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="table-stats-detailed">
              <div className="table-stat-item">
                <div className="table-stat-bar">
                  <div className="bar-segment available" style={{width: `${dashboardData.summary.total_tables > 0 ? (dashboardData.summary.available_tables / dashboardData.summary.total_tables) * 100 : 0}%`}}></div>
                  <div className="bar-segment occupied" style={{width: `${dashboardData.summary.total_tables > 0 ? (dashboardData.summary.occupied_tables / dashboardData.summary.total_tables) * 100 : 0}%`}}></div>
                  <div className="bar-segment reserved" style={{width: `${dashboardData.summary.total_tables > 0 ? (dashboardData.summary.reserved_tables / dashboardData.summary.total_tables) * 100 : 0}%`}}></div>
                </div>
              </div>
              <div className="table-legend">
                <div className="legend-item">
                  <span className="legend-dot available"></span>
                  <span>ว่าง ({dashboardData.summary.available_tables} โต๊ะ)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot occupied"></span>
                  <span>มีลูกค้า ({dashboardData.summary.occupied_tables} โต๊ะ)</span>
                </div>
                {dashboardData.summary.reserved_tables > 0 && (
                  <div className="legend-item">
                    <span className="legend-dot reserved"></span>
                    <span>จองแล้ว ({dashboardData.summary.reserved_tables} โต๊ะ)</span>
                  </div>
                )}
                {dashboardData.summary.maintenance_tables > 0 && (
                  <div className="legend-item">
                    <span className="legend-dot maintenance"></span>
                    <span>ปิดปรับปรุง ({dashboardData.summary.maintenance_tables} โต๊ะ)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tables Overview Grid */}
          {dashboardData.tables.length > 0 && (
            <div className="content-card">
              <div className="content-card-header">
                <span className="content-card-icon">🏠</span>
                <h3 className="content-card-title">โต๊ะทั้งหมด ({dashboardData.tables.length} โต๊ะ)</h3>
              </div>
              <div className="table-cards-grid">
                {dashboardData.tables.map((table) => (
                  <div 
                    key={table.id} 
                    className={`table-mini-card ${table.status}`}
                    title={`โต๊ะ ${table.table_number || table.id} - สถานะ: ${getTableStatusText(table.status)}`}
                  >
                    <div className="table-number">
                      {table.table_number || table.id}
                    </div>
                    <div className={`table-status ${table.status}`}>
                      {getTableStatusText(table.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid-2">
            {/* Recent Orders */}
            <div className="content-card">
              <div className="content-card-header">
                <span className="content-card-icon">📋</span>
                <h3 className="content-card-title">ออเดอร์ล่าสุด</h3>
              </div>
              {dashboardData.todayOrders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <h3>ยังไม่มีออเดอร์วันนี้</h3>
                  <p>ออเดอร์จะแสดงที่นี่เมื่อมีการสั่งอาหาร</p>
                </div>
              ) : (
                <div>
                  {dashboardData.todayOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <div className="order-id">#{order.id} - โต๊ะ {order.table_id}</div>
                          <div className="order-time">
                            {new Date(order.created_at).toLocaleTimeString('th-TH', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                        <div style={{textAlign: 'right'}}>
                          <div className="order-amount">฿{order.total_amount?.toLocaleString()}</div>
                          <div className={`status-badge ${getOrderStatusClass(order.status)}`}>
                            {getOrderStatusText(order.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Real-time Stats & Alerts */}
            <div className="content-card">
              <div className="content-card-header">
                <span className="content-card-icon">⚡</span>
                <h3 className="content-card-title">สถิติเรียลไทม์</h3>
              </div>
              
              {/* Pending Orders Alert */}
              {dashboardData.summary.pending_orders > 0 && (
                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>⚠️</span>
                  <span style={{color: '#92400e', fontWeight: '600'}}>
                    มีออเดอร์รอดำเนินการ {dashboardData.summary.pending_orders} รายการ
                  </span>
                </div>
              )}

              {/* Occupied Tables Alert */}
              {dashboardData.summary.occupied_tables === dashboardData.summary.total_tables && dashboardData.summary.total_tables > 0 && (
                <div style={{
                  background: '#fee2e2',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>🚫</span>
                  <span style={{color: '#991b1b', fontWeight: '600'}}>
                    โต๊ะเต็มทั้งหมด! ไม่มีโต๊ะว่าง
                  </span>
                </div>
              )}

              <div className="grid-2" style={{gap: '1rem'}}>
                <div style={{textAlign: 'center', padding: '1rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6'}}>{dashboardData.summary.total_menu_items}</div>
                  <div style={{fontSize: '0.875rem', color: '#1e40af'}}>เมนูทั้งหมด</div>
                </div>
                <div style={{textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981'}}>{dashboardData.summary.available_menu_items}</div>
                  <div style={{fontSize: '0.875rem', color: '#065f46'}}>เปิดขาย</div>
                </div>
                <div style={{textAlign: 'center', padding: '1rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b'}}>{dashboardData.summary.completed_orders}</div>
                  <div style={{fontSize: '0.875rem', color: '#92400e'}}>เสร็จแล้ว</div>
                </div>
                <div style={{textAlign: 'center', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca'}}>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444'}}>{dashboardData.summary.maintenance_tables}</div>
                  <div style={{fontSize: '0.875rem', color: '#991b1b'}}>โต๊ะปิดปรับปรุง</div>
                </div>
              </div>

              {/* Peak Hours Indicator */}
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span>📈 สถิติวันนี้</span>
                  <span>อัตราการใช้โต๊ะ: {dashboardData.summary.total_tables > 0 ? Math.round((dashboardData.summary.occupied_tables / dashboardData.summary.total_tables) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-card">
            <div className="content-card-header">
              <span className="content-card-icon">⚡</span>
              <h3 className="content-card-title">การดำเนินการด่วน</h3>
            </div>
            <div className="quick-actions-grid">
              <a href="/admin/orders" className="quick-action-btn">
                <span className="quick-action-icon">📋</span>
                <span className="quick-action-label">ดูออเดอร์</span>
              </a>
              <a href="/admin/menu" className="quick-action-btn">
                <span className="quick-action-icon">🍽️</span>
                <span className="quick-action-label">จัดการเมนู</span>
              </a>
              <a href="/admin/tables" className="quick-action-btn">
                <span className="quick-action-icon">🪑</span>
                <span className="quick-action-label">จัดการโต๊ะ</span>
              </a>
              <a href="/admin/reports" className="quick-action-btn">
                <span className="quick-action-icon">📊</span>
                <span className="quick-action-label">รายงาน</span>
              </a>
              <a href="/admin/staff" className="quick-action-btn">
                <span className="quick-action-icon">👥</span>
                <span className="quick-action-label">จัดการพนักงาน</span>
              </a>
              <a href="/admin/qr" className="quick-action-btn">
                <span className="quick-action-icon">�</span>
                <span className="quick-action-label">QR Code</span>
              </a>
            </div>
          </div>

          {/* Tables Status */}
          {loading ? (
            <div className="content-card">
              <div className="loading-card">
                <div className="loading-spinner"></div>
                <p style={{marginTop: '1rem'}}>กำลังโหลดข้อมูล...</p>
              </div>
            </div>
          ) : error ? (
            <div className="content-card">
              <div className="error-card">
                <div className="error-content">
                  <h4>เกิดข้อผิดพลาด</h4>
                  <p>{error}</p>
                </div>
                <button onClick={fetchDashboardData} className="error-btn">
                  ลองใหม่
                </button>
              </div>
            </div>
          ) : (
            <div className="content-card">
              <div className="content-card-header">
                <span className="content-card-icon">🪑</span>
                <h3 className="content-card-title">สถานะโต๊ะทั้งหมด</h3>
              </div>
              {dashboardData.tables.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🪑</div>
                  <h3>ไม่มีข้อมูลโต๊ะ</h3>
                  <p>กรุณาเพิ่มโต๊ะในระบบก่อนใช้งาน</p>
                </div>
              ) : (
                <div className="tables-grid">
                  {dashboardData.tables.map((table) => (
                    <div key={table.id} className={`table-card ${table.status}`}>
                      <div className="table-header">
                        <h4 className="table-number">โต๊ะ {table.table_number}</h4>
                        <span className={`status-badge status-${table.status}`}>
                          {renderTableStatus(table.status)}
                        </span>
                      </div>
                      
                      <div className="table-info">
                        <div className="table-info-item">
                          <span>🎯</span>
                          <span>QR: {table.qr_code_identifier || table.id}</span>
                        </div>
                        
                        {table.capacity && (
                          <div className="table-info-item">
                            <span>👥</span>
                            <span>{table.capacity} ที่นั่ง</span>
                          </div>
                        )}
                        
                        {table.current_orders && table.current_orders > 0 && (
                          <div className="table-info-item">
                            <span>📋</span>
                            <span>{table.current_orders} ออเดอร์</span>
                          </div>
                        )}
                        
                        {table.total_amount && table.total_amount > 0 && (
                          <div className="table-info-item">
                            <span>💰</span>
                            <span>฿{table.total_amount.toLocaleString()}</span>
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
      </div>
    </MainLayout>
  );
}

function getOrderStatusClass(status) {
  const statusClasses = {
    'pending': 'status-pending',
    'preparing': 'status-preparing',
    'ready': 'status-ready',
    'served': 'status-completed',
    'completed': 'status-completed',
    'cancelled': 'status-cancelled'
  };
  return statusClasses[status] || 'status-pending';
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

export default DashboardPage;
