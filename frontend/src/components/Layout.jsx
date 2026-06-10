import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', label: '總覽' },
  { path: '/news', label: '最新消息' },
  { path: '/stores', label: '合作店家' },
  { path: '/offers', label: '店家優惠' },
  { path: '/writers', label: '好文推薦' },
  { path: '/settings', label: '設定' },
];

export default function Layout() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('token'); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, background: '#1a1a2e', color: '#fff', padding: '24px 0', flexShrink: 0 }}>
        <h2 style={{ textAlign: 'center', fontSize: 16, marginBottom: 32, padding: '0 16px' }}>桃園購LINE@</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'block', padding: '10px 24px', color: isActive ? '#4fc3f7' : '#ccc',
                background: isActive ? 'rgba(79,195,247,0.1)' : 'transparent',
                textDecoration: 'none', fontSize: 14, borderLeft: isActive ? '3px solid #4fc3f7' : '3px solid transparent'
              })}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} style={{ margin: '32px 24px', padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', width: 'calc(100% - 48px)' }}>
          登出
        </button>
      </aside>
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
