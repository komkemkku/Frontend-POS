import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { tablesApi } from '../api/customerApi';
import './QRCodeManagePage.css';

function QRCodeManagePage() {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            const response = await tablesApi.getTables();
            setTables(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading tables:', error);
            setLoading(false);
        }
    };

    const generateQRCode = (table) => {
        setSelectedTable(table);
        // สร้าง URL สำหรับลูกค้าเข้าเมนู
        const customerUrl = `${window.location.origin}/customer/table/${table.id}`;
        setQrCodeUrl(customerUrl);
    };

    const printQRCode = () => {
        const printWindow = window.open('', '_blank');
        const qrCodeElement = document.getElementById('qr-code-print');
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>QR Code - โต๊ะ ${selectedTable.name}</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            font-family: Arial, sans-serif;
                            text-align: center;
                        }
                        .qr-print-container {
                            border: 2px solid #333;
                            padding: 30px;
                            margin: 20px auto;
                            max-width: 400px;
                            border-radius: 10px;
                        }
                        .restaurant-name {
                            font-size: 24px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            color: #333;
                        }
                        .table-name {
                            font-size: 32px;
                            font-weight: bold;
                            color: #e53e3e;
                            margin-bottom: 20px;
                        }
                        .qr-code {
                            margin: 20px 0;
                        }
                        .instructions {
                            font-size: 16px;
                            color: #666;
                            margin-top: 20px;
                            line-height: 1.5;
                        }
                        @media print {
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-print-container">
                        <div class="restaurant-name">🍽️ ระบบสั่งอาหาร</div>
                        <div class="table-name">โต๊ะ ${selectedTable.name}</div>
                        <div class="qr-code">${qrCodeElement.innerHTML}</div>
                        <div class="instructions">
                            สแกน QR Code เพื่อดูเมนูและสั่งอาหาร<br>
                            ไม่ต้องเข้าสู่ระบบ สะดวก รวดเร็ว
                        </div>
                    </div>
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const downloadQRCode = () => {
        const svg = document.querySelector('#qr-code-print svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const link = document.createElement('a');
            link.download = `qr-code-table-${selectedTable.name}.png`;
            link.href = canvas.toDataURL();
            link.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    if (loading) {
        return <div className="loading">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="qrcode-manage-page">
            <div className="page-header">
                <h1>จัดการ QR Code สำหรับลูกค้า</h1>
                <p>สร้างและพิมพ์ QR Code สำหรับให้ลูกค้าสแกนสั่งอาหาร</p>
            </div>

            <div className="qrcode-content">
                <div className="tables-section">
                    <h2>เลือกโต๊ะ</h2>
                    <div className="tables-grid">
                        {tables.map(table => (
                            <div 
                                key={table.id} 
                                className={`table-card ${selectedTable?.id === table.id ? 'selected' : ''}`}
                                onClick={() => generateQRCode(table)}
                            >
                                <div className="table-name">โต๊ะ {table.name}</div>
                                <div className="table-capacity">ที่นั่ง: {table.capacity} ที่</div>
                                <div className={`table-status ${table.status}`}>
                                    {table.status === 'available' ? 'ว่าง' : 
                                     table.status === 'occupied' ? 'มีลูกค้า' : 'จอง'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedTable && (
                    <div className="qrcode-section">
                        <h2>QR Code สำหรับโต๊ะ {selectedTable.name}</h2>
                        
                        <div className="qrcode-preview">
                            <div className="qr-card">
                                <div className="restaurant-info">
                                    <h3>🍽️ ระบบสั่งอาหาร</h3>
                                    <h2>โต๊ะ {selectedTable.name}</h2>
                                </div>
                                
                                <div id="qr-code-print" className="qr-code">
                                    <QRCodeSVG 
                                        value={qrCodeUrl}
                                        size={200}
                                        level={'M'}
                                        includeMargin={true}
                                    />
                                </div>
                                
                                <div className="qr-instructions">
                                    <p>สแกน QR Code เพื่อดูเมนูและสั่งอาหาร</p>
                                    <p>ไม่ต้องเข้าสู่ระบบ สะดวก รวดเร็ว</p>
                                </div>
                            </div>
                            
                            <div className="qr-url">
                                <label>URL สำหรับลูกค้า:</label>
                                <input 
                                    type="text" 
                                    value={qrCodeUrl} 
                                    readOnly 
                                    onClick={(e) => e.target.select()}
                                />
                            </div>
                        </div>

                        <div className="qrcode-actions">
                            <button className="btn-primary" onClick={printQRCode}>
                                🖨️ พิมพ์ QR Code
                            </button>
                            <button className="btn-secondary" onClick={downloadQRCode}>
                                📥 ดาวน์โหลด QR Code
                            </button>
                            <button 
                                className="btn-secondary" 
                                onClick={() => navigator.clipboard.writeText(qrCodeUrl)}
                            >
                                📋 คัดลอก URL
                            </button>
                        </div>

                        <div className="qr-features">
                            <h3>คุณสมบัติสำหรับลูกค้า:</h3>
                            <ul>
                                <li>✅ ไม่ต้องเข้าสู่ระบบ</li>
                                <li>✅ ดูเมนูและราคาแบบเรียลไทม์</li>
                                <li>✅ สั่งอาหารผ่านระบบ</li>
                                <li>✅ ดูประวัติการสั่งในวันนั้น</li>
                                <li>✅ ระบุโต๊ะอัตโนมัติ</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QRCodeManagePage;