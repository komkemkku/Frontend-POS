import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import CategoryForm from './components/CategoryForm';
import ConfirmDialog from './components/ConfirmDialog';
import { toast } from 'react-toastify';
import ToastNotify from './components/ToastNotify';
import './MenuPage.css';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/categories');
      setCategories(res.data.data || []);
    } catch {
      setCategories([]);
    }
    setLoading(false);
  };

  const handleEdit = (cat) => {
    setEditCategory(cat);
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
      await axios.delete(`/categories/${deleteId}`);
      toast.success('ลบประเภทสินค้าสำเร็จ!');
      fetchCategories();
    } catch {
      toast.error('เกิดข้อผิดพลาดในการลบประเภทสินค้า');
    }
    setDeleteId(null);
  };

  return (
    <div className="menu-page">
      <ToastNotify />
      <ConfirmDialog
        open={confirmOpen}
        title="ยืนยันการลบประเภทสินค้า"
        message="คุณต้องการลบประเภทสินค้านี้หรือไม่?"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
      />
      <div className="menu-header">
        <h2>จัดการประเภทสินค้า</h2>
        <button className="menu-add-btn" onClick={() => { setEditCategory(null); setModalOpen(true); }}>+ เพิ่มประเภทสินค้า</button>
      </div>
      <div className="menu-table-wrap">
        {loading ? <div className="menu-loading">กำลังโหลด...</div> : (
          <table className="menu-table">
            <thead>
              <tr>
                <th>ชื่อประเภทสินค้า</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>
                    <button onClick={() => handleEdit(cat)} className="menu-edit-btn">แก้ไข</button>
                    <button onClick={() => handleDelete(cat.id)} className="menu-del-btn">ลบ</button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan={2} style={{textAlign:'center'}}>ไม่มีประเภทสินค้า</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {modalOpen && (
        <CategoryForm
          editCategory={editCategory}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); fetchCategories(); }}
        />
      )}
    </div>
  );
}
