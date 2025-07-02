import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    if (!username || !password) {
      setTouched({ username: true, password: true });
      return;
    }
    try {
      await login(username, password);
      // ไม่ต้อง navigate ที่นี่ ให้ useEffect จัดการ
    } catch (err) {
      setApiError(err?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="12" fill="#1890ff"/>
            <text x="50%" y="56%" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold" fontFamily="sans-serif" dy=".3em">DEV</text>
          </svg>
        </div>
        <h2 className="login-title">DEV POS</h2>
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="login-group">
            <label htmlFor="username">Username</label>
            <div className="login-input-wrapper">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, username: true }))}
                className={`login-input${touched.username && !username ? ' login-input-error' : ''}`}
                placeholder="Enter your username"
                autoFocus
              />
            </div>
            {touched.username && !username && (
              <span className="login-error">กรุณากรอกชื่อผู้ใช้</span>
            )}
          </div>
          <div className="login-group">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                className={`login-input${touched.password && !password ? ' login-input-error' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="login-toggle-password"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#888" strokeWidth="2" d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z"/><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2"/></svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#888" strokeWidth="2" d="M17.94 17.94A9.97 9.97 0 0 1 12 19c-5.4 0-9-7-9-7a18.6 18.6 0 0 1 4.06-5.94M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .42-.09.82-.24 1.18"/><path stroke="#888" strokeWidth="2" d="m1 1 22 22"/></svg>
                )}
              </button>
            </div>
            {touched.password && !password && (
              <span className="login-error">กรุณากรอกรหัสผ่าน</span>
            )}
          </div>
          {(error || apiError) && <div className="login-error login-error-server">{error || apiError}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
      <style>{`
        .login-input-wrapper {
          display: flex;
          align-items: center;
          position: relative;
        }
        .login-bg {
          min-height: 100vh;
          background: linear-gradient(120deg, #e0e7ff 0%, #f0f2f5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(24, 144, 255, 0.10), 0 1.5px 4px rgba(0,0,0,0.04);
          padding: 40px 32px 32px 32px;
          width: 100%;
          max-width: 370px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .login-logo {
          margin-bottom: 16px;
        }
        .login-title {
          font-size: 1.6rem;
          font-weight: 600;
          color: #222;
          margin-bottom: 28px;
          text-align: center;
          letter-spacing: 1px;
        }
        .login-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .login-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .login-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 6px;
          border: 1.5px solid #d9d9d9;
          font-size: 1rem;
          background: #fafcff;
          transition: border 0.2s;
        }
        .login-input:focus {
          outline: none;
          border-color: #1890ff;
          background: #fff;
        }
        .login-input-error {
          border-color: #ff4d4f;
          background: #fff1f0;
        }
        .login-toggle-password {
          background: none;
          border: none;
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          padding: 0 2px;
          display: flex;
          align-items: center;
        }
        .login-btn {
          width: 100%;
          padding: 12px 0;
          background: linear-gradient(90deg, #1890ff 60%, #40a9ff 100%);
          color: #fff;
          font-size: 1.1rem;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 8px;
          box-shadow: 0 2px 8px rgba(24,144,255,0.08);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .login-btn:disabled {
          background: #b5d6fa;
          cursor: not-allowed;
        }
        .login-error {
          color: #ff4d4f;
          font-size: 0.97rem;
          margin-top: 2px;
          text-align: left;
        }
        .login-error-server {
          text-align: center;
          margin-bottom: 2px;
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 28px 8px 20px 8px;
            max-width: 98vw;
          }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;