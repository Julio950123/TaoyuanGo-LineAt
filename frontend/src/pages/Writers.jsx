import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const emptyForm = { name: '', brand: '', avatar_url: '', bio: '', link_url: '', link_type: 'blog', active: true };

export default function Writers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const handleSort = (key) => { if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };
  const sorted = [...items].sort((a, b) => { if (!sortKey) return 0; let va = a[sortKey] ?? '', vb = b[sortKey] ?? ''; if (va < vb) return sortDir === 'asc' ? -1 : 1; if (va > vb) return sortDir === 'asc' ? 1 : -1; return 0; });
  const SortIcon = ({ k }) => sortKey === k ? <span style={{ marginLeft: 4, fontSize: 10 }}>{sortDir === 'asc' ? '▲' : '▼'}</span> : null;

  const load = () => api.getWriters().then(d => setItems(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item) => { setEditId(item.id); setForm(item); setShowModal(true); };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    const token = localStorage.getItem('token');
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json();
    if (data.url) setForm(prev => ({ ...prev, avatar_url: data.url }));
    else alert('上傳失敗：' + (data.error || '未知錯誤'));
    setUploading(false);
    e.target.value = '';
  };

  const save = async () => {
    if (!form.name.trim()) return alert('請輸入作家名稱');
    if (editId) await api.updateWriter(editId, form);
    else await api.createWriter(form);
    setShowModal(false); load();
  };

  const remove = async (id) => { if (confirm('確定刪除？')) { await api.deleteWriter(id); load(); } };

  const toggleActive = async (item) => {
    await api.updateWriter(item.id, { active: !item.active });
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>好文推薦管理</h1>
        <button onClick={openNew} style={s.addBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增作家
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
        <div style={s.header}>
          <span style={{ flex: 0.5 }}></span>
          <span style={{ flex: 1.5, cursor: 'pointer' }} onClick={() => handleSort('name')}>作家名稱<SortIcon k="name"/></span>
          <span style={{ flex: 1, cursor: 'pointer' }} onClick={() => handleSort('brand')}>品牌<SortIcon k="brand"/></span>
          <span style={{ flex: 0.8, textAlign: 'center', cursor: 'pointer' }} onClick={() => handleSort('active')}>狀態<SortIcon k="active"/></span>
          <span style={{ flex: 1, textAlign: 'center' }}>操作</span>
        </div>
        {sorted.map(item => (
          <div key={item.id} style={s.row}>
            <span style={{ flex: 0.5 }}>
              {item.avatar_url ? <img src={item.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eee' }} />}
            </span>
            <span style={{ flex: 1.5, fontWeight: 500 }}>{item.name}</span>
            <span style={{ flex: 1, fontSize: 12, color: '#666' }}>{item.brand || '—'}</span>
            <span style={{ flex: 0.8, textAlign: 'center' }}>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 10, background: item.active ? '#dcfce7' : '#f3f4f6', color: item.active ? '#16a34a' : '#6b7280', fontWeight: 500 }}>{item.active ? '上架' : '下架'}</span>
            </span>
            <span style={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 6 }}>
              <button onClick={() => openEdit(item)} style={s.actionBtn} title="修改">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button onClick={() => toggleActive(item)} style={s.actionBtn} title={item.active ? '下架' : '上架'}>
                {item.active
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                }
              </button>
              <button onClick={() => remove(item.id)} style={s.actionBtn} title="刪除">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
              </button>
            </span>
          </div>
        ))}
        {!items.length && <p style={{ textAlign: 'center', color: '#888', padding: 40 }}>尚無作家，點擊右上角新增</p>}
      </div>

      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{editId ? '編輯作家' : '新增作家'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }} aria-label="關閉">&times;</button>
            </div>
            <label style={s.label}>作家名稱</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={s.input} placeholder="作家名稱…" />
            <label style={s.label}>品牌名稱（選填）</label>
            <input value={form.brand || ''} onChange={e => setForm({ ...form, brand: e.target.value })} style={s.input} placeholder="品牌名稱…" />
            <label style={s.label}>頭像</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              {form.avatar_url ? <img src={form.avatar_url} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eee' }} />}
              <label style={{ padding: '6px 14px', background: '#f3f4f6', border: '1px solid #ddd', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
                {uploading ? '上傳中…' : '上傳圖片'}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <input value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} style={s.input} placeholder="或貼上頭像網址 https://..." />
            <label style={s.label}>簡介</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={2} style={{ ...s.input, resize: 'vertical' }} placeholder="作家簡介…" />
            <label style={s.label}>文章連結</label>
            <input value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} style={s.input} placeholder="https://..." />
            <button onClick={save} style={s.saveBtn}>{editId ? '更新' : '新增'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  addBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#ab47bc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  header: { display: 'flex', alignItems: 'center', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#555', background: '#f8f8f8', borderBottom: '1px solid #e8e8e8' },
  row: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 13 },
  actionBtn: { padding: 6, background: 'none', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, padding: 24, width: 500, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12, color: '#333' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  saveBtn: { width: '100%', marginTop: 20, padding: 12, background: '#ab47bc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};
