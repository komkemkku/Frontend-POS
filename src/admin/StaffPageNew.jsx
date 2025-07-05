import React, { useState, useEffect } from 'react';
import StaffForm from './components/StaffForm';
import { adminApi } from '../api';
import ToastNotify from './components/ToastNotify';
import ConfirmDialog from './components/ConfirmDialog';
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
    const interval = setInterval(fetchStaffs, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStaffs = async () => {
    try {
      setError(null);
      const data = await adminApi.staff.getList();
      setStaffs(data || []);
    } catch (err) {
      console.error('Staff fetch error:', err);
      setError(`ไม่สามารถโหลดข้อมูลพนักงานได้: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staff) => {
    setEditStaff(staff);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditStaff(null);
    setModalOpen(true);
  };

  const handleDelete = (staff) => {
    if (staff.id === user?.id) {
      setError('ไม่สามารถลบบัญชีของตัวเองได้');
      return;
    }
    setDeleteId(staff.id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await adminApi.staff.delete(deleteId);
      fetchStaffs();
    } catch (err) {
      console.error('Delete error:', err);
      setError(`ลบพนักงานไม่สำเร็จ: ${err.message}`);
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'admin': 'bg-error',
      'manager': 'bg-warning', 
      'staff': 'bg-primary',
      'cashier': 'bg-success'
    };
    return roleColors[role] || 'bg-secondary';
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      'admin': 'ผู้ดูแลระบบ',
      'manager': 'ผู้จัดการ',
      'staff': 'พนักงาน',
      'cashier': 'แคชเชียร์'
    };
    return roleLabels[role] || role;
  };

  const filteredStaffs = staffs.filter(staff => {
    const matchesSearch = !searchTerm || 
      staff.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    total: staffs.length,
    admin: staffs.filter(s => s.role === 'admin').length,
    manager: staffs.filter(s => s.role === 'manager').length,
    staff: staffs.filter(s => s.role === 'staff').length,
    cashier: staffs.filter(s => s.role === 'cashier').length
  };

  return (
    <div className="page-container">
      <ToastNotify />
      <ConfirmDialog
        open={confirmOpen}
        title="ยืนยันการลบพนักงาน"
        message="คุณต้องการลบพนักงานคนนี้หรือไม่?"
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
      />
      
      {/* Header */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">จัดการพนักงาน</h1>
              <p className="text-secondary">เพิ่ม แก้ไข และจัดการพนักงานทั้งหมด</p>
            </div>
            <div className="flex gap-2">
              <button onClick={fetchStaffs} className="btn btn-outline">
                <span className="text-xl mr-2">🔄</span>
                รีเฟรช
              </button>
              <button onClick={handleAdd} className="btn btn-primary">
                <span className="text-xl mr-2">+</span>
                เพิ่มพนักงาน
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-primary">{roleCounts.total}</div>
            <div className="text-secondary text-sm">พนักงานทั้งหมด</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-error">{roleCounts.admin}</div>
            <div className="text-secondary text-sm">ผู้ดูแลระบบ</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-warning">{roleCounts.manager}</div>
            <div className="text-secondary text-sm">ผู้จัดการ</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-primary">{roleCounts.staff}</div>
            <div className="text-secondary text-sm">พนักงาน</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-success">{roleCounts.cashier}</div>
            <div className="text-secondary text-sm">แคชเชียร์</div>
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
                placeholder="ค้นหาพนักงาน (ชื่อ, นามสกุล, username, email)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input w-48"
            >
              <option value="all">ตำแหน่งทั้งหมด</option>
              <option value="admin">ผู้ดูแลระบบ</option>
              <option value="manager">ผู้จัดการ</option>
              <option value="staff">พนักงาน</option>
              <option value="cashier">แคชเชียร์</option>
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

      {/* Staff Grid */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-bold">รายการพนักงานทั้งหมด ({filteredStaffs.length})</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-lg">กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredStaffs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">ไม่มีพนักงาน</h3>
              <p className="text-secondary">
                {searchTerm || roleFilter !== 'all' 
                  ? 'ไม่พบพนักงานที่ตรงกับเงื่อนไขการค้นหา' 
                  : 'กรุณาเพิ่มพนักงานคนแรกของคุณ'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaffs.map((staff) => (
                <div key={staff.id} className="card hover-lift">
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
                          {staff.first_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <h4 className="font-bold">{staff.first_name} {staff.last_name}</h4>
                          <p className="text-sm text-secondary">@{staff.username}</p>
                        </div>
                      </div>
                      <span className={`status-badge ${getRoleColor(staff.role)} text-white`}>
                        {getRoleLabel(staff.role)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-4">
                      {staff.email && (
                        <div className="flex items-center gap-2">
                          <span>📧</span>
                          <span className="text-xs">{staff.email}</span>
                        </div>
                      )}
                      {staff.phone && (
                        <div className="flex items-center gap-2">
                          <span>📞</span>
                          <span>{staff.phone}</span>
                        </div>
                      )}
                      {staff.position && (
                        <div className="flex items-center gap-2">
                          <span>💼</span>
                          <span>{staff.position}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>สมัครเมื่อ {new Date(staff.created_at).toLocaleDateString('th-TH')}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(staff)}
                        className="btn btn-outline flex-1"
                      >
                        ✏️ แก้ไข
                      </button>
                      {staff.id !== user?.id && (
                        <button 
                          onClick={() => handleDelete(staff)}
                          className="btn btn-error flex-1"
                        >
                          🗑️ ลบ
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

      {modalOpen && (
        <StaffForm
          staff={editStaff}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); fetchStaffs(); }}
        />
      )}
    </div>
  );
}

export default StaffPage;
