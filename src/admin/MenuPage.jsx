import React, { useState, useEffect } from 'react';
import MenuForm from './components/MenuForm';
import { adminApi } from '../api';
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
      const data = await adminApi.menuItems.getList();
      setMenus(data || []);
      setError(null);
    } catch (err) {
      console.error('Menu fetch error:', err);
      setError(`โหลดเมนูไม่สำเร็จ: ${err.message}`);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const data = await adminApi.categories.getList();
      setCategories(data || []);
    } catch (err) {
      console.error('Categories fetch error:', err);
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
      await adminApi.menuItems.delete(deleteId);
      fetchMenus();
    } catch (err) {
      console.error('Delete menu error:', err);
    }
    setDeleteId(null);
  };

  const handleToggleAvailable = async (menu) => {
    try {
      await adminApi.menuItems.update(menu.id, { 
        is_available: !menu.is_available 
      });
      fetchMenus();
    } catch (err) {
      console.error('Toggle menu availability error:', err);
    }
  };

  return (
    <div className="page-container">
      <ToastNotify />
      <ConfirmDialog
        open={confirmOpen}
        title="ยืนยันการลบเมนู"
        message="คุณต้องการลบเมนูนี้หรือไม่?"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
      />
      
      {/* Header */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">จัดการเมนูอาหาร</h1>
              <p className="text-secondary">เพิ่ม แก้ไข และจัดการเมนูทั้งหมด</p>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => { setEditMenu(null); setModalOpen(true); }}
            >
              <span className="text-xl mr-2">+</span>
              เพิ่มเมนู
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <h4 className="font-bold">เกิดข้อผิดพลาด</h4>
          <p>{error}</p>
        </div>
      )}

      {/* Menu Cards */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-xl font-bold">รายการเมนูทั้งหมด</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-12">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-lg">กำลังโหลดข้อมูล...</p>
            </div>
          ) : menus.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold mb-2">ไม่มีเมนู</h3>
              <p className="text-secondary">กรุณาเพิ่มเมนูแรกของคุณ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <div key={menu.id} className="card hover-lift">
                  <div className="relative">
                    {menu.image_url ? (
                      <img 
                        src={menu.image_url} 
                        alt={menu.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleAvailable(menu)}
                        className={`status-badge ${menu.is_available ? 'bg-success' : 'bg-secondary'} text-white`}
                      >
                        {menu.is_available ? 'เปิดขาย' : 'ปิดขาย'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h4 className="text-lg font-bold mb-2">{menu.name}</h4>
                    <p className="text-secondary mb-2">
                      {categories.find(c => c.id === menu.category_id)?.name || 'ไม่มีหมวดหมู่'}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ฿{menu.price?.toLocaleString()}
                      </span>
                    </div>
                    {menu.description && (
                      <p className="text-sm text-secondary mb-4 line-clamp-2">
                        {menu.description}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(menu)}
                        className="btn btn-outline flex-1"
                      >
                        แก้ไข
                      </button>
                      <button 
                        onClick={() => handleDelete(menu.id)}
                        className="btn btn-error flex-1"
                      >
                        ลบ
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
