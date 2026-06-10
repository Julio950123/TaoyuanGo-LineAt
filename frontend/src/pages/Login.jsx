import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" name="password"
          style={{ width: '100%', padding: 10, marginBottom: 24, border: '1px solid #ddd', borderRadius: 4 }} />
        <button type="submit" style={{ width: '100%', padding: 12, background: '#4fc3f7', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>
          登入
        </button>
      </form>
    </div>
  );
}
