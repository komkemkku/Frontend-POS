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
    // อัปเดตข้อมูลทุก 30 วินาที
    const interval = setInterval(fetchTables, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTables = async () => {
    try {
      setError(null);
      console.log('Fetching tables...');
      
      const data = await adminApi.tables.getList();
      setTables(data || []);
    } catch (err) {
      console.error('Tables fetch error:', err);
      setError(`ไม่สามารถโหลดข้อมูลโต๊ะได้: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditTable(null);
    setModalOpen(true);
  };

  const handleEdit = (table) => {
    setEditTable(table);
    setModalOpen(true);
  };

  const handleDelete = (table) => {
    setDeleteId(table.id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await axios.delete(`/tables/${deleteId}`);
      if (response.data.success) {
        toast.success('ลบโต๊ะสำเร็จ');
        fetchTables(); // รีเฟรชข้อมูล
      } else {
        throw new Error(response.data.message || 'ไม่สามารถลบโต๊ะได้');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(`ลบโต๊ะไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleSave = async (tableData) => {
    try {
      let response;
      if (editTable) {
        // Update existing table
        response = await axios.put(`/tables/${editTable.id}`, tableData);
      } else {
        // Create new table
        response = await axios.post('/tables', tableData);
      }
      
      if (response.data.success) {
        toast.success(editTable ? 'อัปเดตโต๊ะสำเร็จ' : 'เพิ่มโต๊ะสำเร็จ');
        setModalOpen(false);
        setEditTable(null);
        fetchTables(); // รีเฟรชข้อมูล
      } else {
        throw new Error(response.data.message || 'ไม่สามารถบันทึกข้อมูลโต๊ะได้');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error(`บันทึกไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleShowQR = async (table) => {
    try {
      const response = await axios.get(`/tables/${table.id}/qr-code`);
      if (response.data.success) {
        setQrCodeData(response.data.data);
        setShowQRModal(true);
      } else {
        throw new Error(response.data.message || 'ไม่สามารถสร้าง QR Code ได้');
      }
    } catch (err) {
      console.error('QR Code error:', err);
      toast.error(`สร้าง QR Code ไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'available': return { label: 'ว่าง', color: '#52c41a' };
      case 'occupied': return { label: 'มีลูกค้า', color: '#e74c3c' };
      case 'reserved': return { label: 'จองแล้ว', color: '#f39c12' };
      case 'maintenance': return { label: 'ปิดปรับปรุง', color: '#95a5a6' };
      default: return { label: status || 'ไม่ทราบ', color: '#6c757d' };
    }
  };

  // Filter tables based on search and status
  const filteredTables = tables.filter(table => {
    const matchesSearch = !searchTerm || 
      table.table_number?.toString().includes(searchTerm) ||
      table.qr_code_identifier?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="table-page">
      <ToastNotify />
      
      <ConfirmDialog
        open={confirmOpen}
        title="ยืนยันการลบโต๊ะ"
        message="คุณต้องการลบโต๊ะนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
      />

      {/* QR Code Modal */}
      {showQRModal && qrCodeData && (
        <div className="qr-modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>QR Code - โต๊ะ {qrCodeData.table.table_number}</h3>
              <button onClick={() => setShowQRModal(false)} className="close-btn">✕</button>
            </div>
            <div className="qr-modal-content">
              <div className="qr-code-container">
                <QRCode value={qrCodeData.url} size={200} />
              </div>
              <div className="qr-info">
                <p><strong>QR Code ID:</strong> {qrCodeData.identifier}</p>
                <p><strong>URL:</strong> {qrCodeData.url}</p>
                <p><strong>โต๊ะ:</strong> {qrCodeData.table.table_number}</p>
                <p><strong>ที่นั่ง:</strong> {qrCodeData.table.capacity} ที่</p>
              </div>
              <div className="qr-actions">
                <button onClick={() => window.print()} className="print-btn">
                  🖨️ พิมพ์ QR Code
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(qrCodeData.url);
                    toast.success('คัดลอก URL แล้ว');
                  }}
                  className="copy-btn"
                >
                  📋 คัดลอก URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">จัดการโต๊ะ</h2>
          <div className="table-user-info">
            <span>พนักงาน: {user?.first_name} {user?.last_name}</span>
          </div>
        </div>

        <div className="table-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="ค้นหาโต๊ะ (หมายเลข, QR Code)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="available">ว่าง</option>
              <option value="occupied">มีลูกค้า</option>
              <option value="reserved">จองแล้ว</option>
              <option value="maintenance">ปิดปรับปรุง</option>
            </select>
          </div>
          <div className="action-section">
            <button onClick={handleAdd} className="add-btn">
              ➕ เพิ่มโต๊ะ
            </button>
            <button onClick={fetchTables} className="refresh-btn">
              🔄 รีเฟรช
            </button>
          </div>
        </div>

        {error && <div className="table-error">{error}</div>}

        <div className="table-content">
          {loading ? (
            <div className="table-loading">กำลังโหลด...</div>
          ) : filteredTables.length === 0 ? (
            <div className="no-tables">
              <h3>ไม่พบโต๊ะ</h3>
              <p>ไม่มีโต๊ะที่ตรงกับเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <div className="tables-grid">
              {filteredTables.map((table) => {
                const statusInfo = getStatusDisplay(table.status);
                return (
                  <div key={table.id} className="table-card">
                    <div className="table-card-header">
                      <h3>โต๊ะ {table.table_number}</h3>
                      <div 
                        className="table-status"
                        style={{ backgroundColor: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </div>
                    </div>
                    
                    <div className="table-card-body">
                      <div className="table-info">
                        <p><strong>ชื่อ:</strong> {table.name || '-'}</p>
                        <p><strong>ที่นั่ง:</strong> {table.capacity} ที่</p>
                        {table.qr_code_identifier && (
                          <p><strong>QR Code:</strong> {table.qr_code_identifier}</p>
                        )}
                      </div>
                      
                      <div className="table-actions">
                        <button 
                          onClick={() => handleShowQR(table)}
                          className="qr-btn"
                          title="แสดง QR Code"
                        >
                          📱 QR
                        </button>
                        <button 
                          onClick={() => handleEdit(table)}
                          className="edit-btn"
                          title="แก้ไข"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(table)}
                          className="delete-btn"
                          title="ลบ"
                        >
                          🗑️
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
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); fetchTables(); }}
        />
      )}
    </div>
  );
}

export default TablePage;
