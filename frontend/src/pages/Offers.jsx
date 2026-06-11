import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const emptyForm = { store_id: '', title: '', description: '', image_url: '', start_date: '', end_date: '', active: true };

export default function Offers() {
  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const handleSort = (key) => { if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(key); setSortDir('asc'); } };
  const sorted = [...items].sort((a, b) => { if (!sortKey) return 0; let va = sortKey === 'store_name' ? (a.stores?.name ?? '') : (a[sortKey] ?? ''); let vb = sortKey === 'store_name' ? (b.stores?.name ?? '') : (b[sortKey] ?? ''); if (va < vb) return sortDir === 'asc' ? -1 : 1; if (va > vb) return sortDir === 'asc' ? 1 : -1; return 0; });
  const SortIcon = ({ k }) => <span style={{ marginLeft: 4, fontSize: 10, color: sortKey === k ? '#333' : '#ccc' }}>{sortKey === k ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</span>;

  const load = () => { api.getOffers().then(d => setItems(Array.isArray(d) ? d : [])); api.getStores().then(d => setStores(Array.isArray(d) ? d : [])); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item) => { setEditId(item.id); setForm({ store_id: item.store_id, title: item.title, description: item.description || '', image_url: item.image_url || '', start_date: item.start_date || '', end_date: item.end_date || '', active: item.active }); setShowModal(true); };

  const save = async () => {
    if (!form.title.trim()) return alert('請輸入優惠標題');
    if (editId) await api.updateOffer(editId, form);
    else await api.createOffer(form);
    setShowModal(false); load();
  };

  const remove = async (id) => { if (confirm('確定刪除？')) { await api.deleteOffer(id); load(); } };

  const toggleActive = async (item) => {
    await api.updateOffer(item.id, { active: !item.active });
    load();
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('zh-TW') : '';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>店家優惠管理</h1>
        <button onClick={openNew} style={s.addBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增優惠
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
        <div style={s.header}>
          <span style={{ flex: 1.5, cursor: 'pointer' }} onClick={() => handleSort('store_name')}>店家<SortIcon k="store_name"/></span>
          <span style={{ flex: 2, cursor: 'pointer' }} onClick={() => handleSort('title')}>優惠標題<SortIcon k="title"/></span>
          <span style={{ flex: 1.5, cursor: 'pointer' }} onClick={() => handleSort('start_date')}>日期區間<SortIcon k="start_date"/></span>
          <span style={{ flex: 0.8, textAlign: 'center', cursor: 'pointer' }} onClick={() => handleSort('active')}>狀態<SortIcon k="active"/></span>
          <span style={{ flex: 1, textAlign: 'center' }}>操作</span>
        </div>
        {sorted.map(item => (
          <div key={item.id} style={s.row}>
            <span style={{ flex: 1.5, fontSize: 12, color: '#666' }}>{item.stores?.name || '—'}</span>
            <span style={{ flex: 2, fontWeight: 500 }}>{item.title}</span>
            <span style={{ flex: 1.5, fontSize: 12, color: '#666' }}>
              {formatDate(item.start_date)}{item.start_date && item.end_date ? ' ~ ' : ''}{formatDate(item.end_date)}
              {!item.start_date && !item.end_date && '—'}
            </span>
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
        {!items.length && <p style={{ textAlign: 'center', color: '#888', padding: 40 }}>尚無優惠，點擊右上角新增</p>}
      </div>

      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{editId ? '編輯優惠' : '新增優惠'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }} aria-label="關閉">&times;</button>
            </div>
            <label style={s.label}>所屬店家</label>
            <select value={form.store_id} onChange={e => setForm({ ...form, store_id: e.target.value })} style={s.input}>
              <option value="">選擇店家</option>
              {stores.map(st => <option key={st.id} value={st.id}>{st.name}</option>)}
            </select>
            <label style={s.label}>優惠標題</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={s.input} placeholder="優惠標題…" />
            <label style={s.label}>優惠描述</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...s.input, resize: 'vertical' }} placeholder="優惠描述…" />
            <label style={s.label}>圖片網址</label>
            <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={s.input} placeholder="https://..." />
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={s.label}>開始日期</label>
                <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={s.input} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={s.label}>結束日期</label>
                <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} style={s.input} />
              </div>
            </div>
            <button onClick={save} style={s.saveBtn}>{editId ? '更新' : '新增'}</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  addBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#ffa726', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  header: { display: 'flex', alignItems: 'center', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#555', background: '#f8f8f8', borderBottom: '1px solid #e8e8e8' },
  row: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 13 },
  actionBtn: { padding: 6, background: 'none', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, padding: 24, width: 500, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12, color: '#333' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  saveBtn: { width: '100%', marginTop: 20, padding: 12, background: '#ffa726', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};
