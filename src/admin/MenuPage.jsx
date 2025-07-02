import React, { useState, useEffect } from 'react';
import MenuForm from './components/MenuForm';
import axios from '../api/axios';
import './MenuPage.css';
import { toast } from 'react-toastify';
import ToastNotify from './components/ToastNotify';
import ConfirmDialog from './components/ConfirmDialog';



function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMenu, setEditMenu] = useState(null);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/menu-items');
      setMenus(res.data.data || []);
      setError(null);
    } catch {
      setError('โหลดเมนูไม่สำเร็จ');
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/categories');
      setCategories(res.data.data || []);
    } catch {
      setCategories([]);
    }
  };

  const handleEdit = (menu) => {
    setEditMenu(menu);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    if (!deleteId) return;
    try {
      await axios.delete(`/menu-items/${deleteId}`);
      toast.success('ลบเมนูสำเร็จ!');
      fetchMenus();
    } catch {
      toast.error('เกิดข้อผิดพลาดในการลบเมนู');
    }
    setDeleteId(null);
  };

  const handleToggleAvailable = async (menu) => {
    try {
      await axios.patch(`/menu-items/${menu.id}`, { is_available: !menu.is_available });
      fetchMenus();
    } catch {}
  };

  return (
    <div className="menu-page">
      <ToastNotify />
      <ConfirmDialog
        open={confirmOpen}
        title="ยืนยันการลบเมนู"
        message="คุณต้องการลบเมนูนี้หรือไม่?"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
      />
      <div className="menu-header">
        <h2>จัดการเมนูอาหาร</h2>
        <button className="menu-add-btn" onClick={() => { setEditMenu(null); setModalOpen(true); }}>+ เพิ่มเมนู</button>
      </div>
      {error && <div className="menu-error">{error}</div>}
      <div className="menu-table-wrap">
        {loading ? <div className="menu-loading">กำลังโหลด...</div> : (
          <table className="menu-table">
            <thead>
              <tr>
                <th>ชื่อเมนู</th>
                <th>หมวดหมู่</th>
                <th>ราคา</th>
                <th>รูป</th>
                <th>สถานะ</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu) => (
                <tr key={menu.id}>
                  <td>{menu.name}</td>
                  <td>{categories.find(c => c.id === menu.category_id)?.name || '-'}</td>
                  <td>{menu.price} บาท</td>
                  <td>{menu.image_url && <img src={menu.image_url} alt="img" className="menu-img" />}</td>
                  <td>
                    <button onClick={() => handleToggleAvailable(menu)} style={{background: menu.is_available ? '#52c41a' : '#ccc', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 10px', cursor: 'pointer'}}>
                      {menu.is_available ? 'เปิด' : 'ปิด'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(menu)} className="menu-edit-btn">แก้ไข</button>
                    <button onClick={() => handleDelete(menu.id)} className="menu-del-btn">ลบ</button>
                  </td>
                </tr>
              ))}
              {menus.length === 0 && <tr><td colSpan={6} style={{textAlign:'center'}}>ไม่มีเมนู</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {modalOpen && (
        <MenuForm
          menu={editMenu}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); fetchMenus(); }}
        />
      )}
    </div>
  );
}

export default MenuPage;
