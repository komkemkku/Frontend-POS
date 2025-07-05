import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import ToastNotify from './components/ToastNotify';
import './ReportPage.css';
import { useAuth } from '../hooks/useAuth';

function ReportPage() {
  const [salesSummary, setSalesSummary] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);
  const [topMenus, setTopMenus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
  }, [dateRange, startDate, endDate]);

  const fetchReports = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('Fetching reports...');

      // Build query params for date filtering
      let params = {};
      if (dateRange === 'custom' && startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      } else if (dateRange !== 'all') {
        params.period = dateRange;
      }

      // Fetch sales summary
      const salesResponse = await axios.get('/reports/sales', { params });
      console.log('Sales report response:', salesResponse.data);
      
      if (salesResponse.data.success) {
        setSalesSummary(salesResponse.data.data);
      }

      // Fetch order summary
      const orderResponse = await axios.get('/reports/orders', { params });
      console.log('Order report response:', orderResponse.data);
      
      if (orderResponse.data.success) {
        setOrderSummary(orderResponse.data.data);
      }

      // Fetch top menu items
      const topMenuResponse = await axios.get('/reports/top-menu-items', { params });
      console.log('Top menu response:', topMenuResponse.data);
      
      if (topMenuResponse.data.success) {
        setTopMenus(topMenuResponse.data.data || []);
      }

      // Fetch recent orders for activity
      const recentResponse = await axios.get('/orders', { 
        params: { limit: 10, status: 'paid' } 
      });
      console.log('Recent orders response:', recentResponse.data);
      
      if (recentResponse.data.success) {
        setRecentOrders(recentResponse.data.data || []);
      }

    } catch (err) {
      console.error('Reports fetch error:', err);
      setError(`ไม่สามารถโหลดรายงานได้: ${err.response?.data?.message || err.message}`);
      toast.error(err.response?.data?.message || 'โหลดรายงานไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount || 0);
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case 'today': return 'วันนี้';
      case 'yesterday': return 'เมื่อวาน';
      case 'this_week': return 'สัปดาห์นี้';
      case 'last_week': return 'สัปดาห์ที่แล้ว';
      case 'this_month': return 'เดือนนี้';
      case 'last_month': return 'เดือนที่แล้ว';
      case 'custom': return `${startDate} ถึง ${endDate}`;
      case 'all': return 'ทั้งหมด';
      default: return dateRange;
    }
  };

  return (
    <div className="report-page">
      <ToastNotify />

      <div className="report-container">
        <div className="report-header">
          <h2 className="report-title">รายงานสรุปยอดขาย</h2>
          <div className="report-user-info">
            <span>ผู้ดูแลระบบ: {user?.first_name} {user?.last_name}</span>
          </div>
        </div>

        <div className="report-controls">
          <div className="date-filter">
            <label>ช่วงเวลา:</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="date-range-select"
            >
              <option value="today">วันนี้</option>
              <option value="yesterday">เมื่อวาน</option>
              <option value="this_week">สัปดาห์นี้</option>
              <option value="last_week">สัปดาห์ที่แล้ว</option>
              <option value="this_month">เดือนนี้</option>
              <option value="last_month">เดือนที่แล้ว</option>
              <option value="custom">กำหนดเอง</option>
              <option value="all">ทั้งหมด</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <div className="custom-date-range">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
              <span>ถึง</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>
          )}

          <button onClick={fetchReports} className="refresh-btn">
            🔄 รีเฟรช
          </button>
        </div>

        {error && <div className="report-error">{error}</div>}

        {loading ? (
          <div className="report-loading">กำลังโหลด...</div>
        ) : (
          <div className="report-content">
            <div className="report-period">
              <h3>รายงานประจำ{getDateRangeLabel()}</h3>
            </div>

            {/* Sales Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card sales">
                <div className="card-icon">💰</div>
                <div className="card-content">
                  <h3>ยอดขายรวม</h3>
                  <div className="card-value">
                    {formatCurrency(salesSummary?.total_sales || 0)}
                  </div>
                  <div className="card-detail">
                    {salesSummary?.total_orders || 0} ออเดอร์
                  </div>
                </div>
              </div>

              <div className="summary-card orders">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <h3>จำนวนออเดอร์</h3>
                  <div className="card-value">
                    {orderSummary?.total_orders || 0}
                  </div>
                  <div className="card-detail">
                    เฉลี่ย {formatCurrency(salesSummary?.average_order_value || 0)}/ออเดอร์
                  </div>
                </div>
              </div>

              <div className="summary-card customers">
                <div className="card-icon">👥</div>
                <div className="card-content">
                  <h3>จำนวนลูกค้า</h3>
                  <div className="card-value">
                    {orderSummary?.total_customers || 0}
                  </div>
                  <div className="card-detail">
                    {orderSummary?.returning_customers || 0} คนเก่า
                  </div>
                </div>
              </div>

              <div className="summary-card revenue">
                <div className="card-icon">📈</div>
                <div className="card-content">
                  <h3>กำไรสุทธิ</h3>
                  <div className="card-value">
                    {formatCurrency(salesSummary?.net_profit || 0)}
                  </div>
                  <div className="card-detail">
                    {salesSummary?.profit_margin || 0}% มาร์จิ้น
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Breakdown */}
            {orderSummary?.status_breakdown && (
              <div className="report-section">
                <h3>สถานะออเดอร์</h3>
                <div className="status-breakdown">
                  {Object.entries(orderSummary.status_breakdown).map(([status, count]) => (
                    <div key={status} className="status-item">
                      <span className="status-label">{status}</span>
                      <span className="status-count">{count} ออเดอร์</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Menu Items */}
            <div className="report-section">
              <h3>เมนูขายดี</h3>
              {topMenus.length === 0 ? (
                <div className="no-data">ไม่มีข้อมูลเมนูขายดี</div>
              ) : (
                <div className="top-menus-grid">
                  {topMenus.slice(0, 10).map((menu, index) => (
                    <div key={menu.id || index} className="top-menu-item">
                      <div className="menu-rank">#{index + 1}</div>
                      <div className="menu-info">
                        <h4>{menu.name || `เมนู ID: ${menu.menu_item_id}`}</h4>
                        <p>ขายไป {menu.total_quantity || menu.quantity} ชิ้น</p>
                        <p>รายได้ {formatCurrency(menu.total_revenue || menu.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="report-section">
              <h3>ออเดอร์ล่าสุด (ชำระแล้ว)</h3>
              {recentOrders.length === 0 ? (
                <div className="no-data">ไม่มีออเดอร์ล่าสุด</div>
              ) : (
                <div className="recent-orders-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ออเดอร์</th>
                        <th>โต๊ะ</th>
                        <th>ยอดรวม</th>
                        <th>เวลา</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>โต๊ะ {order.table_number || order.qr_code_identifier}</td>
                          <td>{formatCurrency(order.total_amount)}</td>
                          <td>
                            {new Date((order.updated_at || order.created_at) * 1000).toLocaleString('th-TH')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Sales by Hour (if available) */}
            {salesSummary?.hourly_sales && (
              <div className="report-section">
                <h3>ยอดขายรายชั่วโมง</h3>
                <div className="hourly-sales-chart">
                  {/* This could be replaced with a proper chart library */}
                  <div className="chart-placeholder">
                    <p>📊 กราฟยอดขายรายชั่วโมง</p>
                    <p>ชั่วโมงที่ขายดีที่สุด: {salesSummary.peak_hour || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;
