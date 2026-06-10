import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const inputStyle = { width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, marginBottom: 8 };
const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500 };

const emptyForm = { name: '', description: '', image_url: '', address: '', phone: '', website_url: '', category: '', active: true };

export default function Stores() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const load = () => api.getStores().then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editId) await api.updateStore(editId, form);
    else await api.createStore(form);
    setForm(emptyForm); setEditId(null); load();
  };

  const edit = (item) => { setForm(item); setEditId(item.id); };
  const remove = async (id) => { if (confirm('確定刪除？')) { await api.deleteStore(id); load(); } };

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>合作店家管理</h1>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>{editId ? '編輯' : '新增'}店家</h3>
        <input placeholder="店家名稱" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
        <textarea placeholder="店家簡介" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
        <input placeholder="圖片網址" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={inputStyle} />
        <input placeholder="地址" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={inputStyle} />
        <input placeholder="電話" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
        <input placeholder="網站連結 (店家小網站)" value={form.website_url} onChange={e => setForm({ ...form, website_url: e.target.value })} style={inputStyle} />
        <div style={{ marginTop: 12 }}>
          <button onClick={save} style={{ ...btnStyle, background: '#66bb6a', color: '#fff', marginRight: 8 }}>{editId ? '更新' : '新增'}</button>
          {editId && <button onClick={() => { setEditId(null); setForm(emptyForm); }} style={{ ...btnStyle, background: '#ccc' }}>取消</button>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {items?.map(item => (
          <div key={item.id} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
            {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />}
            <div style={{ padding: 16 }}>
              <h4>{item.name}</h4>
              <p style={{ fontSize: 13, color: '#666', margin: '8px 0' }}>{item.description}</p>
              <p style={{ fontSize: 12, color: '#999' }}>{item.address}</p>
              <div style={{ marginTop: 12 }}>
                <button onClick={() => edit(item)} style={{ ...btnStyle, background: '#4fc3f7', color: '#fff', marginRight: 4, fontSize: 12 }}>編輯</button>
                <button onClick={() => remove(item.id)} style={{ ...btnStyle, background: '#e74c3c', color: '#fff', fontSize: 12 }}>刪除</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
