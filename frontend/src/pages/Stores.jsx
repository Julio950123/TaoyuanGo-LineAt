import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const emptyForm = { name: '', description: '', image_url: '', address: '', phone: '', business_hours: '', website_url: '', button_text: '', category: '', active: null };

export default function Stores() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = () => api.getStores().then(d => setItems(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  // Collect unique categories from existing items
  const categories = [...new Set(items.map(i => i.category).filter(Boolean))];

  const openNew = () => { setEditId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (item) => { setEditId(item.id); setForm(item); setShowModal(true); };

  const savePublish = async () => {
    if (!form.name.trim()) return alert('請輸入店家名稱');
    const payload = { ...form, active: true };
    if (editId) await api.updateStore(editId, payload);
    else await api.createStore(payload);
    setShowModal(false); load();
  };

  const saveDraft = async () => {
    if (!form.name.trim()) return alert('請輸入店家名稱');
    const payload = { ...form, active: null };
    if (editId) await api.updateStore(editId, payload);
    else await api.createStore(payload);
    setShowModal(false); load();
  };

  const toggleActive = async (item) => {
    const newActive = item.active === true ? false : true;
    await api.updateStore(item.id, { active: newActive });
    load();
  };

  const remove = async (id) => { if (confirm('確定刪除？')) { await api.deleteStore(id); load(); } };

  const getStatus = (item) => {
    if (item.active === null) return { label: '草稿', bg: '#f3f4f6', color: '#6b7280' };
    if (item.active === true) return { label: '上架', bg: '#dcfce7', color: '#16a34a' };
    return { label: '下架', bg: '#fee2e2', color: '#dc2626' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>合作店家管理</h1>
        <button onClick={openNew} style={s.addBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增店家
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
        <div style={s.header}>
          <span style={{ flex: 2 }}>店家名稱</span>
          <span style={{ flex: 2 }}>地址</span>
          <span style={{ flex: 1 }}>電話</span>
          <span style={{ flex: 0.8, textAlign: 'center' }}>狀態</span>
          <span style={{ flex: 1.2, textAlign: 'center' }}>操作</span>
        </div>
        {items.map(item => {
          const status = getStatus(item);
          return (
            <div key={item.id} style={s.row}>
              <span style={{ flex: 2, fontWeight: 500 }}>{item.name}</span>
              <span style={{ flex: 2, fontSize: 12, color: '#666' }}>{item.address || '—'}</span>
              <span style={{ flex: 1, fontSize: 12, color: '#666' }}>{item.phone || '—'}</span>
              <span style={{ flex: 0.8, textAlign: 'center' }}>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 10, background: status.bg, color: status.color, fontWeight: 500 }}>{status.label}</span>
              </span>
              <span style={{ flex: 1.2, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 6 }}>
                <button onClick={() => openEdit(item)} style={s.actionBtn} title="修改">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => toggleActive(item)} style={s.actionBtn} title={item.active ? '下架' : '上架'}>
                  {item.active
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d="M18.36 6.64A9 9 0 0 1 12 21a9 9 0 0 1-6.36-2.64"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  }
                </button>
                <button onClick={() => remove(item.id)} style={s.actionBtn} title="刪除">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
              </span>
            </div>
          );
        })}
        {!items.length && <p style={{ textAlign: 'center', color: '#888', padding: 40 }}>尚無店家，點擊右上角新增</p>}
      </div>

      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{editId ? '編輯店家' : '新增店家'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }} aria-label="關閉">&times;</button>
            </div>
            <label style={s.label}>店家名稱</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={s.input} placeholder="店家名稱…" />
            <label style={s.label}>簡介</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...s.input, resize: 'vertical' }} placeholder="店家簡介…" />
            <label style={s.label}>圖片網址</label>
            <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={s.input} placeholder="https://..." />
            <label style={s.label}>地址</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={s.input} placeholder="地址…" />
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={s.label}>電話</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={s.input} placeholder="03-XXXXXXX" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={s.label}>分類</label>
                {categories.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                    {categories.map(cat => (
                      <button key={cat} type="button" onClick={() => setForm({ ...form, category: cat })}
                        style={{ padding: '3px 10px', fontSize: 12, borderRadius: 12, border: form.category === cat ? '1px solid #66bb6a' : '1px solid #ddd', background: form.category === cat ? '#dcfce7' : '#fff', color: form.category === cat ? '#16a34a' : '#555', cursor: 'pointer' }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                <input value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} style={s.input} placeholder="餐飲、美容…" />
              </div>
            </div>
            <label style={s.label}>營業時間</label>
            <input value={form.business_hours || ''} onChange={e => setForm({ ...form, business_hours: e.target.value })} style={s.input} placeholder="週一至週五 10:00-21:00" />
            <label style={s.label}>網站連結</label>
            <input value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })} style={s.input} placeholder="https://..." />
            <label style={s.label}>按鈕文字</label>
            <input value={form.button_text || ''} onChange={e => setForm({ ...form, button_text: e.target.value })} style={s.input} placeholder="查看詳情（預設）" />

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={saveDraft} style={{ flex: 1, padding: 12, background: '#f3f4f6', color: '#555', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>儲存草稿</button>
              <button onClick={savePublish} style={{ flex: 1, padding: 12, background: '#66bb6a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{editId ? '更新並上架' : '新增並上架'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  addBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#66bb6a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  header: { display: 'flex', alignItems: 'center', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#555', background: '#f8f8f8', borderBottom: '1px solid #e8e8e8' },
  row: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 13 },
  actionBtn: { padding: 6, background: 'none', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, padding: 24, width: 500, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12, color: '#333' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
};
