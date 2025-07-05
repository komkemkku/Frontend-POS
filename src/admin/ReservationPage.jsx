import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import ToastNotify from './components/ToastNotify';
import ConfirmDialog from './components/ConfirmDialog';
import ReservationForm from './components/ReservationForm';
import './ReservationPage.css';
import { useAuth } from '../hooks/useAuth';

function ReservationPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editReservation, setEditReservation] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionData, setActionData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchReservations();
    // อัปเดตข้อมูลทุก 30 วินาที
    const interval = setInterval(fetchReservations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReservations = async () => {
    try {
      setError(null);
      console.log('Fetching reservations...');
      
      const response = await axios.get('/reservations');
      console.log('Reservations response:', response.data);
      
      if (response.data.success) {
        setReservations(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'ไม่สามารถโหลดข้อมูลการจองได้');
      }
    } catch (err) {
      console.error('Reservations fetch error:', err);
      setError(`ไม่สามารถโหลดข้อมูลการจองได้: ${err.response?.data?.message || err.message}`);
      toast.error(err.response?.data?.message || 'โหลดข้อมูลการจองไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditReservation(null);
    setModalOpen(true);
  };

  const handleEdit = (reservation) => {
    setEditReservation(reservation);
    setModalOpen(true);
  };

  const handleStatusChange = (reservation, newStatus) => {
    setActionData({ reservation, newStatus, action: 'status' });
    setConfirmOpen(true);
  };

  const handleDelete = (reservation) => {
    setActionData({ reservation, action: 'delete' });
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!actionData) return;
    
    try {
      const { reservation, newStatus, action } = actionData;
      
      if (action === 'status') {
        const response = await axios.patch(`/reservations/${reservation.id}`, { 
          status: newStatus 
        });
        if (response.data.success) {
          toast.success(`อัปเดตสถานะการจองเป็น "${getStatusLabel(newStatus)}" สำเร็จ`);
          fetchReservations();
        } else {
          throw new Error(response.data.message || 'ไม่สามารถอัปเดตสถานะได้');
        }
      } else if (action === 'delete') {
        const response = await axios.delete(`/reservations/${reservation.id}`);
        if (response.data.success) {
          toast.success('ลบการจองสำเร็จ');
          fetchReservations();
        } else {
          throw new Error(response.data.message || 'ไม่สามารถลบการจองได้');
        }
      }
    } catch (err) {
      console.error('Action error:', err);
      toast.error(`ดำเนินการไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    } finally {
      setConfirmOpen(false);
      setActionData(null);
    }
  };

  const handleSave = async (reservationData) => {
    try {
      let response;
      if (editReservation) {
        // Update existing reservation
        response = await axios.put(`/reservations/${editReservation.id}`, reservationData);
      } else {
        // Create new reservation
        response = await axios.post('/reservations', reservationData);
      }
      
      if (response.data.success) {
        toast.success(editReservation ? 'อัปเดตการจองสำเร็จ' : 'เพิ่มการจองสำเร็จ');
        setModalOpen(false);
        setEditReservation(null);
        fetchReservations();
      } else {
        throw new Error(response.data.message || 'ไม่สามารถบันทึกข้อมูลการจองได้');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error(`บันทึกไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'รอยืนยัน';
      case 'confirmed': return 'ยืนยันแล้ว';
      case 'cancelled': return 'ยกเลิกแล้ว';
      case 'completed': return 'เสร็จสิ้น';
      case 'no_show': return 'ไม่มาตามนัด';
      default: return status || 'ไม่ทราบ';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#52c41a';
      case 'cancelled': return '#e74c3c';
      case 'completed': return '#6c757d';
      case 'no_show': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getAvailableActions = (status) => {
    switch (status) {
      case 'pending': 
        return [
          { label: 'ยืนยัน', value: 'confirmed', color: '#52c41a' },
          { label: 'ยกเลิก', value: 'cancelled', color: '#e74c3c' }
        ];
      case 'confirmed': 
        return [
          { label: 'เสร็จสิ้น', value: 'completed', color: '#6c757d' },
          { label: 'ไม่มาตามนัด', value: 'no_show', color: '#dc3545' },
          { label: 'ยกเลิก', value: 'cancelled', color: '#e74c3c' }
        ];
      default: 
        return [];
    }
  };

  // Filter reservations
  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = !searchTerm || 
      reservation.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.table_number?.toString().includes(searchTerm) ||
      reservation.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="reservation-page">
      <ToastNotify />
      
      <ConfirmDialog
        open={confirmOpen}
        title={actionData?.action === 'delete' ? 'ยืนยันการลบการจอง' : 'ยืนยันการเปลี่ยนสถานะ'}
        message={
          actionData?.action === 'delete' 
            ? 'คุณต้องการลบการจองนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้'
            : `คุณต้องการเปลี่ยนสถานะเป็น "${getStatusLabel(actionData?.newStatus)}" หรือไม่?`
        }
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setConfirmOpen(false);
          setActionData(null);
        }}
      />

      <div className="reservation-container">
        <div className="reservation-header">
          <h2 className="reservation-title">จัดการการจองโต๊ะ</h2>
          <div className="reservation-user-info">
            <span>พนักงาน: {user?.first_name} {user?.last_name}</span>
          </div>
        </div>

        <div className="reservation-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="ค้นหา (ชื่อลูกค้า, เบอร์โทร, หมายเลขโต๊ะ)"
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
              <option value="pending">รอยืนยัน</option>
              <option value="confirmed">ยืนยันแล้ว</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="cancelled">ยกเลิกแล้ว</option>
              <option value="no_show">ไม่มาตามนัด</option>
            </select>
          </div>
          <div className="action-section">
            <button onClick={handleAdd} className="add-btn">
              ➕ เพิ่มการจอง
            </button>
            <button onClick={fetchReservations} className="refresh-btn">
              🔄 รีเฟรช
            </button>
          </div>
        </div>

        {error && <div className="reservation-error">{error}</div>}

        <div className="reservation-content">
          {loading ? (
            <div className="reservation-loading">กำลังโหลด...</div>
          ) : filteredReservations.length === 0 ? (
            <div className="no-reservations">
              <h3>ไม่มีการจอง</h3>
              <p>ไม่พบการจองที่ตรงกับเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <div className="reservations-grid">
              {filteredReservations.map((reservation) => (
                <div key={reservation.id} className="reservation-card">
                  <div className="reservation-card-header">
                    <h3>การจองโต๊ะ {reservation.table_number}</h3>
                    <div 
                      className="reservation-status"
                      style={{ backgroundColor: getStatusColor(reservation.status) }}
                    >
                      {getStatusLabel(reservation.status)}
                    </div>
                  </div>
                  
                  <div className="reservation-card-body">
                    <div className="reservation-info">
                      <p><strong>ลูกค้า:</strong> {reservation.customer_name || '-'}</p>
                      <p><strong>เบอร์โทร:</strong> {reservation.phone || '-'}</p>
                      <p><strong>จำนวนคน:</strong> {reservation.party_size} คน</p>
                      <p><strong>วันที่จอง:</strong> {
                        reservation.reservation_date 
                          ? new Date(reservation.reservation_date).toLocaleDateString('th-TH')
                          : '-'
                      }</p>
                      <p><strong>เวลาจอง:</strong> {reservation.reservation_time || '-'}</p>
                      {reservation.notes && (
                        <p><strong>หมายเหตุ:</strong> {reservation.notes}</p>
                      )}
                    </div>
                    
                    <div className="reservation-actions">
                      {getAvailableActions(reservation.status).map(action => (
                        <button
                          key={action.value}
                          onClick={() => handleStatusChange(reservation, action.value)}
                          className="status-action-btn"
                          style={{ backgroundColor: action.color }}
                        >
                          {action.label}
                        </button>
                      ))}
                      <button 
                        onClick={() => handleEdit(reservation)}
                        className="edit-btn"
                        title="แก้ไข"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(reservation)}
                        className="delete-btn"
                        title="ลบ"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <ReservationForm
          reservation={editReservation}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); fetchReservations(); }}
        />
      )}
    </div>
  );
}

export default ReservationPage;
