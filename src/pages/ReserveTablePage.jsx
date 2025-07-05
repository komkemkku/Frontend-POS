import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import MainLayout from '../components/MainLayout';

function ReserveTablePage() {
    const [tables, setTables] = useState([]);
    const [form, setForm] = useState({
        customer_name: '',
        phone: '',
        party_size: 1,
        reservation_date: '',
        reservation_time: '',
        table_id: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [fetchingTables, setFetchingTables] = useState(true);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            setFetchingTables(true);
            console.log('Fetching tables for reservation...');
            
            const response = await axios.get('/tables');
            console.log('Tables response:', response.data);
            
            if (response.data.success) {
                // Filter available tables for reservation
                const availableTables = (response.data.data || []).filter(
                    table => table.status === 'available'
                );
                setTables(availableTables);
            } else {
                throw new Error(response.data.message || 'ไม่สามารถโหลดรายการโต๊ะได้');
            }
        } catch (err) {
            console.error('Tables fetch error:', err);
            setTables([]);
            toast.error(err.response?.data?.message || 'โหลดรายการโต๊ะไม่สำเร็จ');
        } finally {
            setFetchingTables(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!form.customer_name.trim()) {
            setError('กรุณากรอกชื่อลูกค้า');
            return false;
        }
        if (!form.phone.trim()) {
            setError('กรุณากรอกหมายเลขโทรศัพท์');
            return false;
        }
        if (!form.party_size || form.party_size < 1) {
            setError('กรุณาระบุจำนวนลูกค้า');
            return false;
        }
        if (!form.reservation_date) {
            setError('กรุณาเลือกวันที่จอง');
            return false;
        }
        if (!form.reservation_time) {
            setError('กรุณาเลือกเวลาจอง');
            return false;
        }
        if (!form.table_id) {
            setError('กรุณาเลือกโต๊ะ');
            return false;
        }

        // Validate reservation date (not in the past)
        const reservationDateTime = new Date(`${form.reservation_date}T${form.reservation_time}`);
        const now = new Date();
        if (reservationDateTime < now) {
            setError('ไม่สามารถจองย้อนหลังได้');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            console.log('Creating reservation...', form);

            const reservationData = {
                customer_name: form.customer_name.trim(),
                phone: form.phone.trim(),
                party_size: parseInt(form.party_size, 10),
                table_id: parseInt(form.table_id, 10),
                reservation_date: form.reservation_date,
                reservation_time: form.reservation_time,
                notes: form.notes.trim(),
                status: 'pending' // Default status for new reservations
            };

            const response = await axios.post('/reservations', reservationData);
            console.log('Reservation response:', response.data);

            if (response.data.success) {
                setSuccess(true);
                toast.success('จองโต๊ะสำเร็จ!');
                
                // Reset form after successful reservation
                setForm({
                    customer_name: '',
                    phone: '',
                    party_size: 1,
                    reservation_date: '',
                    reservation_time: '',
                    table_id: '',
                    notes: ''
                });

                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            } else {
                throw new Error(response.data.message || 'ไม่สามารถจองโต๊ะได้');
            }
        } catch (err) {
            console.error('Reservation error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'การจองไม่สำเร็จ';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const getCurrentTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1); // Add 1 hour buffer
        return now.toTimeString().slice(0, 5);
    };

    return (
        <MainLayout>
            <div className="reserve-table-page">
                <div className="reserve-container">
                    <div className="reserve-header">
                        <h2 className="reserve-title">จองโต๊ะ</h2>
                        <p className="reserve-subtitle">กรุณากรอกข้อมูลการจองให้ครบถ้วน</p>
                    </div>

                    {error && (
                        <div className="reserve-error">
                            <span>⚠️ {error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="reserve-success">
                            <span>✅ จองโต๊ะสำเร็จ! เราจะติดต่อกลับเพื่อยืนยันการจอง</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="reserve-form">
                        <div className="form-section">
                            <h3>ข้อมูลลูกค้า</h3>
                            
                            <div className="form-group">
                                <label htmlFor="customer_name">ชื่อลูกค้า *</label>
                                <input
                                    type="text"
                                    id="customer_name"
                                    name="customer_name"
                                    value={form.customer_name}
                                    onChange={handleChange}
                                    placeholder="กรอกชื่อ-นามสกุล"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">หมายเลขโทรศัพท์ *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="กรอกหมายเลขโทรศัพท์"
                                    pattern="[0-9]{9,10}"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="party_size">จำนวนลูกค้า *</label>
                                <select
                                    id="party_size"
                                    name="party_size"
                                    value={form.party_size}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                                        <option key={num} value={num}>
                                            {num} คน
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>วันและเวลาจอง</h3>
                            
                            <div className="form-group">
                                <label htmlFor="reservation_date">วันที่จอง *</label>
                                <input
                                    type="date"
                                    id="reservation_date"
                                    name="reservation_date"
                                    value={form.reservation_date}
                                    onChange={handleChange}
                                    min={getTomorrowDate()}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reservation_time">เวลาจอง *</label>
                                <input
                                    type="time"
                                    id="reservation_time"
                                    name="reservation_time"
                                    value={form.reservation_time}
                                    onChange={handleChange}
                                    min="10:00"
                                    max="21:00"
                                    required
                                    disabled={loading}
                                />
                                <small>เวลาให้บริการ: 10:00 - 21:00 น.</small>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>เลือกโต๊ะ</h3>
                            
                            <div className="form-group">
                                <label htmlFor="table_id">โต๊ะที่ต้องการจอง *</label>
                                {fetchingTables ? (
                                    <div className="loading">กำลังโหลดรายการโต๊ะ...</div>
                                ) : (
                                    <select
                                        id="table_id"
                                        name="table_id"
                                        value={form.table_id}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">-- เลือกโต๊ะ --</option>
                                        {tables.map(table => (
                                            <option key={table.id} value={table.id}>
                                                โต๊ะ {table.table_number} - {table.capacity} ที่นั่ง
                                                {table.name && ` (${table.name})`}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                
                                {tables.length === 0 && !fetchingTables && (
                                    <div className="no-tables">
                                        ขออภัย ไม่มีโต๊ะว่างในขณะนี้
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>หมายเหตุเพิ่มเติม</h3>
                            
                            <div className="form-group">
                                <label htmlFor="notes">หมายเหตุ (ถ้ามี)</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    placeholder="ความต้องการพิเศษ หรือข้อมูลเพิ่มเติม"
                                    rows="3"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={loading || tables.length === 0}
                            >
                                {loading ? 'กำลังจอง...' : 'ยืนยันการจอง'}
                            </button>
                            
                            <button 
                                type="button" 
                                className="reset-btn"
                                onClick={() => {
                                    setForm({
                                        customer_name: '',
                                        phone: '',
                                        party_size: 1,
                                        reservation_date: '',
                                        reservation_time: '',
                                        table_id: '',
                                        notes: ''
                                    });
                                    setError(null);
                                    setSuccess(false);
                                }}
                                disabled={loading}
                            >
                                ล้างข้อมูล
                            </button>
                        </div>
                    </form>

                    <div className="reservation-info">
                        <h3>เงื่อนไขการจอง</h3>
                        <ul>
                            <li>การจองจะมีผลหลังจากได้รับการยืนยันจากทางร้าน</li>
                            <li>กรุณามาถึงตรงเวลาที่จอง หากสายเกิน 15 นาทีจะยกเลิกการจองอัตโนมัติ</li>
                            <li>หากต้องการยกเลิกหรือเปลี่ยนแปลงการจอง กรุณาแจ้งล่วงหน้าอย่างน้อย 2 ชั่วโมง</li>
                            <li>ทางร้านขอสงวนสิทธิ์ในการปฏิเสธการจองในกรณีที่มีลูกค้าเต็ม</li>
                        </ul>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default ReserveTablePage;
