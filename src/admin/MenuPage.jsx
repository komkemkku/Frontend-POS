import React, { useState, useEffect } from 'react';
import MenuForm from './components/MenuForm';
import axios from '../api/axios';
import './MenuPage.css';

function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMenu, setEditMenu] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/menus');
      setMenus(res.data.data || []);
      setError(null);
    } catch {
      setError('โหลดเมนูไม่สำเร็จ');
    }
    setLoading(false);
  };

  const handleEdit = (menu) => {
    setEditMenu(menu);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบเมนูนี้?')) return;
    await axios.delete(`/admin/menus/${id}`);
    fetchMenus();
  };

  return (
    <div className="menu-page">
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
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu) => (
                <tr key={menu.id}>
                  <td>{menu.name}</td>
                  <td>{menu.category}</td>
                  <td>{menu.price} บาท</td>
                  <td>{menu.image && <img src={menu.image} alt="img" className="menu-img" />}</td>
                  <td>
                    <button onClick={() => handleEdit(menu)} className="menu-edit-btn">แก้ไข</button>
                    <button onClick={() => handleDelete(menu.id)} className="menu-del-btn">ลบ</button>
                  </td>
                </tr>
              ))}
              {menus.length === 0 && <tr><td colSpan={5} style={{textAlign:'center'}}>ไม่มีเมนู</td></tr>}
            </tbody>
          </table>
        )}
      </div>
      {modalOpen && (
        <MenuForm
          menu={editMenu}
          onClose={() => setModalOpen(false)}
          onSuccess={() => { setModalOpen(false); fetchMenus(); }}
        />
      )}
    </div>
  );
}

export default MenuPage;
