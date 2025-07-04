import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import ToastNotify from './components/ToastNotify';
import ConfirmDialog from './components/ConfirmDialog';
import TableForm from './components/TableForm';
import './MenuPage.css';
import QRCode from 'react-qr-code';

function TablePage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/tables');
      // ป้องกันกรณี backend คืน null หรือ array ว่าง
      setTables(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch {
      setError('โหลดข้อมูลโต๊ะไม่สำเร็จ');
    }
    setLoading(false);
  };

  const handleEdit = (table) => {
    setEditTable(table);
    setModalOpen(true);
  };

  // รับ table object แทน id เพื่อความชัวร์
  const handleDelete = (table) => {
    setDeleteId(table && table.id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    if (!deleteId) return;
    try {
      // บาง backend Go ต้องส่ง body ว่างหรือ {{}}
      await axios.delete(`/tables/${deleteId}`, { data: {} });
      toast.success('ลบโต๊ะสำเร็จ!');
      fetchTables();
    } catch {
      toast.error('เกิดข้อผิดพลาดในการลบโต๊ะ');
    }
    setDeleteId(null);
  };

  return (
    <div className="menu-page">
      <ToastNotify />
      <ConfirmDialog
        open={confirmOpen}
        title="ยืนยันการลบโต๊ะ"
        message="คุณต้องการลบโต๊ะนี้หรือไม่?"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
      />
      <div className="menu-header">
        <h2>จัดการโต๊ะ</h2>
        <button className="menu-add-btn" onClick={() => { setEditTable(null); setModalOpen(true); }}>+ เพิ่มโต๊ะ</button>
      </div>
      {error && <div className="menu-error">{error}</div>}
      <div className="menu-table-wrap">
        {loading ? <div className="menu-loading">กำลังโหลด...</div> : (
          <table className="menu-table">
            <thead>
              <tr>
                <th>หมายเลขโต๊ะ</th>
                <th>ชื่อโต๊ะ</th>
                <th>จำนวนที่นั่ง</th>
                <th>สถานะ</th>
                <th>QR Code</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => {
                // Map backend fields to display
                const tableNumber = table.table_number ?? table.number ?? '-';
                const tableName = table.name ?? '-';
                const tableSeats = table.capacity ?? table.seats ?? '-';
                // status: "1" = ว่าง, "2" = ไม่ว่าง, "3" = จอง
                let statusLabel = '-';
                let statusColor = '#e74c3c';
                if (table.status === '1' || table.status === 1) { statusLabel = 'ว่าง'; statusColor = '#52c41a'; }
                else if (table.status === '2' || table.status === 2) { statusLabel = 'ไม่ว่าง'; statusColor = '#e74c3c'; }
                else if (table.status === '3' || table.status === 3) { statusLabel = 'จอง'; statusColor = '#f39c12'; }
                // QR code identifier (ถ้ามี)
                // ใช้ alias domain ที่เสถียร
                const frontendUrl = 'https://frontend-pos-rouge.vercel.app';
                
                const qrValue = table.qr_code_identifier && table.qr_code_identifier !== ''
                  ? `${frontendUrl}/menu?table=${table.qr_code_identifier}`
                  : `${frontendUrl}/menu?table=${table.id}`;
                
                // Debug: แสดง URL ที่สร้างขึ้น
                console.log('QR URL for table', table.id, ':', qrValue);
                console.log('Table data:', table);
                
                return (
                  <tr key={table.id}>
                    <td>{tableNumber}</td>
                    <td>{tableName}</td>
                    <td>{tableSeats}</td>
                    <td>
                      <span style={{
                        background: statusColor,
                        color: '#fff',
                        borderRadius: 6,
                        padding: '2px 12px',
                        fontWeight: 500,
                        fontSize: '0.98rem'
                      }}>
                        {statusLabel}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {table.id && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div id={`qr-table-${table.id}`} style={{ background: '#fff', padding: 4, borderRadius: 8 }}>
                            <QRCode value={qrValue} size={56} />
                          </div>
                          <button
                            style={{ marginTop: 4, fontSize: '0.92rem', padding: '2px 10px', borderRadius: 4, border: '1px solid #eee', background: '#fff', cursor: 'pointer' }}
                            onClick={() => {
                              try {
                                const svg = document.querySelector(`#qr-table-${table.id} svg`);
                                if (!svg) {
                                  alert('ไม่พบ QR Code');
                                  return;
                                }
                                
                                // Clone SVG และเพิ่ม namespace
                                const svgClone = svg.cloneNode(true);
                                svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                                
                                // แปลง SVG เป็น string
                                const svgString = new XMLSerializer().serializeToString(svgClone);
                                
                                // สร้าง HTML สำหรับการพิมพ์
                                const printWindow = window.open('', '_blank');
                                printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>QR Code - โต๊ะ ${tableNumber}</title>
                                      <style>
                                        body { 
                                          margin: 0; 
                                          padding: 20px; 
                                          display: flex; 
                                          flex-direction: column; 
                                          align-items: center; 
                                          font-family: Arial, sans-serif;
                                        }
                                        .qr-container { 
                                          text-align: center; 
                                          page-break-inside: avoid; 
                                        }
                                        .qr-title { 
                                          font-size: 18px; 
                                          font-weight: bold; 
                                          margin-bottom: 10px; 
                                        }
                                        .qr-code { 
                                          width: 200px; 
                                          height: 200px; 
                                          border: 1px solid #ccc; 
                                          padding: 10px; 
                                          background: white; 
                                        }
                                        @media print {
                                          body { margin: 0; padding: 10px; }
                                          .qr-code { width: 150px; height: 150px; }
                                        }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="qr-container">
                                        <div class="qr-title">QR Code - โต๊ะ ${tableNumber}</div>
                                        <div class="qr-code">
                                          ${svgString}
                                        </div>
                                        <p style="margin-top: 10px; font-size: 12px; color: #666;">
                                          สแกนเพื่อดูเมนู
                                        </p>
                                      </div>
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                                
                                // รอให้โหลดเสร็จแล้วพิมพ์
                                setTimeout(() => {
                                  printWindow.print();
                                  printWindow.close();
                                }, 500);
                                
                              } catch (error) {
                                console.error('Print error:', error);
                                alert('เกิดข้อผิดพลาดในการพิมพ์');
                              }
                            }}
                          >
                            ปริ้น QR
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleEdit(table)} className="menu-edit-btn">แก้ไข</button>
                      <button onClick={() => handleDelete(table)} className="menu-del-btn">ลบ</button>
                    </td>
                  </tr>
                );
              })}
              {tables.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center' }}>ไม่มีข้อมูลโต๊ะ</td></tr>}
            </tbody>
          </table>
        )}
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
