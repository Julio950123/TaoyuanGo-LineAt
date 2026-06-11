import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await api.login(email, password);
    if (res.token) { localStorage.setItem('token', res.token); navigate('/'); }
    else setError(res.error || '登入失敗');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#1a1a2e' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 40, borderRadius: 8, width: 360 }}>
        <h1 style={{ fontSize: 20, marginBottom: 24, textAlign: 'center' }}>桃園購LINE@ 後台</h1>
        {error && <p style={{ color: '#e74c3c', marginBottom: 12, fontSize: 14 }}>{error}</p>}
        <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" name="email"
          style={{ width: '100%', padding: 10, marginBottom: 16, border: '1px solid #ddd', borderRadius: 4 }} />
        <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>密碼</label>
        <div style={{ position: 'relative' }}>
          <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" name="password"
            style={{ width: '100%', padding: 10, paddingRight: 40, marginBottom: 24, border: '1px solid #ddd', borderRadius: 4 }} />
          <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? '隱藏密碼' : '顯示密碼'}
            style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            {showPw
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            }
          </button>
        </div>
        <button type="submit" style={{ width: '100%', padding: 12, background: '#4fc3f7', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>
          登入
        </button>
      </form>
    </div>
  );
}
