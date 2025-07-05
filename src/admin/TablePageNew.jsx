import React, { useState, useEffect } from 'react';
import { adminApi } from '../api';
import ToastNotify from './components/ToastNotify';
import ConfirmDialog from './components/ConfirmDialog';
import TableForm from './components/TableForm';
import QRCode from 'react-qr-code';
import { useAuth } from '../hooks/useAuth';

function TablePage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const { user } = useAuth();

  useEffect(() => { 
    fetchTables(); 
    const interval = setInterval(fetchTables, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTables = async () => {
    try {
      setError(null);
      const data = await adminApi.tables.getList();
      setTables(data || []);
    } catch (err) {
      console.error('Tables fetch error:', err);
      setError(`ไม่สามารถโหลดข้อมูลโต๊ะได้: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (table) => {
    setEditTable(table);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditTable(null);
    setModalOpen(true);
  };

  const handleDelete = (table) => {
    setDeleteId(table.id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await adminApi.tables.delete(deleteId);
      fetchTables();
    } catch (err) {
      console.error('Delete error:', err);
      setError(`ลบโต๊ะไม่สำเร็จ: ${err.message}`);
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleShowQR = (table) => {
    const frontendUrl = window.location.origin;
    const qrUrl = `${frontendUrl}/scan-qr/${table.qr_code_identifier || table.id}`;
    setQrCodeData({
      url: qrUrl,
      table: table
    });
    setShowQRModal(true);
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'available': { label: 'ว่าง', color: '#10b981', bgColor: 'bg-success' },
      'occupied': { label: 'มีลูกค้า', color: '#ef4444', bgColor: 'bg-error' },
      'reserved': { label: 'จองแล้ว', color: '#f59e0b', bgColor: 'bg-warning' },
      'maintenance': { label: 'ปิดปรับปรุง', color: '#6b7280', bgColor: 'bg-secondary' }
    };
    return statusMap[status] || statusMap['available'];
  };

  const filteredTables = tables.filter(table => {
    const matchesSearch = !searchTerm || 
      table.table_number?.toString().includes(searchTerm) ||
      table.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.qr_code_identifier?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    maintenance: tables.filter(t => t.status === 'maintenance').length
  };

  return (
    <div className="page-container">
      <ToastNotify />
      <ConfirmDialog
        open={confirmOpen}
        title="ยืนยันการลบโต๊ะ"
        message="คุณต้องการลบโต๊ะนี้หรือไม่?"
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
      />

      {/* QR Code Modal */}
      {showQRModal && qrCodeData && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="card">
              <div className="card-header">
                <h3 className="text-xl font-bold">QR Code - โต๊ะ {qrCodeData.table.table_number}</h3>
                <button 
                  onClick={() => setShowQRModal(false)}
                  className="btn btn-ghost text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="card-body text-center">
                <div className="mb-4 p-4 bg-white rounded-lg inline-block">
                  <QRCode 
                    value={qrCodeData.url} 
                    size={200}
                  />
                </div>
                <p className="text-secondary mb-4">สแกน QR Code เพื่อดูเมนูและสั่งอาหาร</p>
                <p className="text-sm text-secondary break-all">{qrCodeData.url}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">จัดการโต๊ะ</h1>
              <p className="text-secondary">เพิ่ม แก้ไข และจัดการโต๊ะทั้งหมด</p>
            </div>
            <div className="flex gap-2">
              <button onClick={fetchTables} className="btn btn-outline">
                <span className="text-xl mr-2">🔄</span>
                รีเฟรช
              </button>
              <button onClick={handleAdd} className="btn btn-primary">
                <span className="text-xl mr-2">+</span>
                เพิ่มโต๊ะ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-primary">{statusCounts.total}</div>
            <div className="text-secondary text-sm">โต๊ะทั้งหมด</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-success">{statusCounts.available}</div>
            <div className="text-secondary text-sm">ว่าง</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-error">{statusCounts.occupied}</div>
            <div className="text-secondary text-sm">มีลูกค้า</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-warning">{statusCounts.reserved}</div>
            <div className="text-secondary text-sm">จองแล้ว</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-secondary">{statusCounts.maintenance}</div>
            <div className="text-secondary text-sm">ปิดปรับปรุง</div>
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
                placeholder="ค้นหาโต๊ะ (หมายเลข, ชื่อ, QR Code)"
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
              <option value="available">ว่าง</option>
              <option value="occupied">มีลูกค้า</option>
              <option value="reserved">จองแล้ว</option>
              <option value="maintenance">ปิดปรับปรุง</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <h4 className="font-bold">เกิดข้อผิดพลาด</h4>
          <p>{error}</p>
        </div>
      )}

      {/* Tables Grid */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-bold">รายการโต๊ะทั้งหมด ({filteredTables.length})</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-lg">กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredTables.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🪑</div>
              <h3 className="text-xl font-bold mb-2">ไม่มีโต๊ะ</h3>
              <p className="text-secondary">
                {searchTerm || statusFilter !== 'all' 
                  ? 'ไม่พบโต๊ะที่ตรงกับเงื่อนไขการค้นหา' 
                  : 'กรุณาเพิ่มโต๊ะแรกของคุณ'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTables.map((table) => {
                const statusInfo = getStatusDisplay(table.status);
                return (
                  <div key={table.id} className="card hover-lift border-l-4" style={{borderLeftColor: statusInfo.color}}>
                    <div className="card-body">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-lg font-bold">โต๊ะ {table.table_number}</h4>
                        <span className={`status-badge ${statusInfo.bgColor} text-white`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm mb-4">
                        {table.name && (
                          <div className="flex items-center gap-2">
                            <span>📝</span>
                            <span>{table.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{table.capacity} ที่นั่ง</span>
                        </div>
                        {table.qr_code_identifier && (
                          <div className="flex items-center gap-2">
                            <span>📱</span>
                            <span className="text-xs">{table.qr_code_identifier}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleShowQR(table)}
                          className="btn btn-outline flex-1"
                          title="แสดง QR Code"
                        >
                          📱 QR
                        </button>
                        <button 
                          onClick={() => handleEdit(table)}
                          className="btn btn-secondary flex-1"
                          title="แก้ไข"
                        >
                          ✏️ แก้ไข
                        </button>
                        <button 
                          onClick={() => handleDelete(table)}
                          className="btn btn-error flex-1"
                          title="ลบ"
                        >
                          🗑️ ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <TableForm
          table={editTable}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); fetchTables(); }}
        />
      )}
    </div>
  );
}

export default TablePage;
