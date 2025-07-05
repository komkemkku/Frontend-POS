import React, { useState, useEffect } from 'react';
import StaffForm from './components/StaffForm';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import ToastNotify from './components/ToastNotify';
import ConfirmDialog from './components/ConfirmDialog';
import './StaffPage.css';
import { useAuth } from '../hooks/useAuth';

function StaffPage() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchStaffs();
    // อัปเดตข้อมูลทุก 30 วินาที
    const interval = setInterval(fetchStaffs, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStaffs = async () => {
    try {
      setError(null);
      console.log('Fetching staff...');
      
      const response = await axios.get('/staff');
      console.log('Staff response:', response.data);
      
      if (response.data.success) {
        setStaffs(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'ไม่สามารถโหลดข้อมูลพนักงานได้');
      }
    } catch (err) {
      console.error('Staff fetch error:', err);
      setError(`ไม่สามารถโหลดข้อมูลพนักงานได้: ${err.response?.data?.message || err.message}`);
      toast.error(err.response?.data?.message || 'โหลดข้อมูลพนักงานไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditStaff(null);
    setModalOpen(true);
  };

  const handleEdit = (staff) => {
    setEditStaff(staff);
    setModalOpen(true);
  };

  const handleDelete = (staff) => {
    setDeleteId(staff.id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await axios.delete(`/staff/${deleteId}`);
      if (response.data.success) {
        toast.success('ลบพนักงานสำเร็จ');
        fetchStaffs();
      } else {
        throw new Error(response.data.message || 'ไม่สามารถลบพนักงานได้');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(`ลบพนักงานไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleSave = async (staffData) => {
    try {
      let response;
      if (editStaff) {
        // Update existing staff
        response = await axios.put(`/staff/${editStaff.id}`, staffData);
      } else {
        // Create new staff
        response = await axios.post('/staff', staffData);
      }
      
      if (response.data.success) {
        toast.success(editStaff ? 'อัปเดตพนักงานสำเร็จ' : 'เพิ่มพนักงานสำเร็จ');
        setModalOpen(false);
        setEditStaff(null);
        fetchStaffs();
      } else {
        throw new Error(response.data.message || 'ไม่สามารถบันทึกข้อมูลพนักงานได้');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error(`บันทึกไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleToggleStatus = async (staff) => {
    try {
      const newStatus = staff.is_active ? 'inactive' : 'active';
      const response = await axios.patch(`/staff/${staff.id}`, { 
        is_active: !staff.is_active 
      });
      
      if (response.data.success) {
        toast.success(`${newStatus === 'active' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}พนักงานสำเร็จ`);
        fetchStaffs();
      } else {
        throw new Error(response.data.message || 'ไม่สามารถเปลี่ยนสถานะได้');
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      toast.error(`เปลี่ยนสถานะไม่สำเร็จ: ${err.response?.data?.message || err.message}`);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin': return 'ผู้ดูแลระบบ';
      case 'manager': return 'ผู้จัดการ';
      case 'staff': return 'พนักงาน';
      case 'cashier': return 'แคชเชียร์';
      case 'kitchen': return 'ครัว';
      case 'waiter': return 'บริกร';
      default: return role || 'ไม่ระบุ';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#e74c3c';
      case 'manager': return '#9b59b6';
      case 'staff': return '#3498db';
      case 'cashier': return '#f39c12';
      case 'kitchen': return '#e67e22';
      case 'waiter': return '#52c41a';
      default: return '#6c757d';
    }
  };

  // Filter staff
  const filteredStaffs = staffs.filter(staff => {
    const matchesSearch = !searchTerm || 
      staff.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="staff-page">
      <ToastNotify />
      
      <ConfirmDialog
        open={confirmOpen}
        title="ยืนยันการลบพนักงาน"
        message="คุณต้องการลบพนักงานคนนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
      />

      <div className="staff-container">
        <div className="staff-header">
          <h2 className="staff-title">จัดการพนักงาน</h2>
          <div className="staff-user-info">
            <span>ผู้ดูแลระบบ: {user?.first_name} {user?.last_name}</span>
          </div>
        </div>

        <div className="staff-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="ค้นหา (ชื่อ, นามสกุล, อีเมล, ชื่อผู้ใช้)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="role-filter"
            >
              <option value="all">ตำแหน่งทั้งหมด</option>
              <option value="admin">ผู้ดูแลระบบ</option>
              <option value="manager">ผู้จัดการ</option>
              <option value="staff">พนักงาน</option>
              <option value="cashier">แคชเชียร์</option>
              <option value="kitchen">ครัว</option>
              <option value="waiter">บริกร</option>
            </select>
          </div>
          <div className="action-section">
            <button onClick={handleAdd} className="add-btn">
              ➕ เพิ่มพนักงาน
            </button>
            <button onClick={fetchStaffs} className="refresh-btn">
              🔄 รีเฟรช
            </button>
          </div>
        </div>

        {error && <div className="staff-error">{error}</div>}

        <div className="staff-content">
          {loading ? (
            <div className="staff-loading">กำลังโหลด...</div>
          ) : filteredStaffs.length === 0 ? (
            <div className="no-staff">
              <h3>ไม่มีพนักงาน</h3>
              <p>ไม่พบพนักงานที่ตรงกับเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <div className="staff-grid">
              {filteredStaffs.map((staff) => (
                <div key={staff.id} className="staff-card">
                  <div className="staff-card-header">
                    <h3>{staff.first_name} {staff.last_name}</h3>
                    <div className="staff-badges">
                      <div 
                        className="staff-role"
                        style={{ backgroundColor: getRoleColor(staff.role) }}
                      >
                        {getRoleLabel(staff.role)}
                      </div>
                      <div 
                        className={`staff-status ${staff.is_active ? 'active' : 'inactive'}`}
                      >
                        {staff.is_active ? 'ใช้งาน' : 'ปิดใช้งาน'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="staff-card-body">
                    <div className="staff-info">
                      <p><strong>ชื่อผู้ใช้:</strong> {staff.username || '-'}</p>
                      <p><strong>อีเมล:</strong> {staff.email || '-'}</p>
                      <p><strong>เบอร์โทร:</strong> {staff.phone || '-'}</p>
                      <p><strong>วันที่เข้าทำงาน:</strong> {
                        staff.hire_date 
                          ? new Date(staff.hire_date).toLocaleDateString('th-TH')
                          : '-'
                      }</p>
                      {staff.last_login && (
                        <p><strong>เข้าใช้งานล่าสุด:</strong> {
                          new Date(staff.last_login).toLocaleString('th-TH')
                        }</p>
                      )}
                    </div>
                    
                    <div className="staff-actions">
                      <button
                        onClick={() => handleToggleStatus(staff)}
                        className={`status-toggle-btn ${staff.is_active ? 'deactivate' : 'activate'}`}
                        title={staff.is_active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                      >
                        {staff.is_active ? '⏸️' : '▶️'}
                      </button>
                      <button 
                        onClick={() => handleEdit(staff)}
                        className="edit-btn"
                        title="แก้ไข"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(staff)}
                        className="delete-btn"
                        title="ลบ"
                        disabled={staff.id === user?.id}
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
        <StaffForm
          staff={editStaff}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); fetchStaffs(); }}
        />
      )}
    </div>
  );
}

export default StaffPage;
