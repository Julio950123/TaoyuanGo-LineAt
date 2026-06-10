import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const inputStyle = { width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, marginBottom: 8 };
const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500 };

const emptyForm = { name: '', avatar_url: '', bio: '', link_url: '', link_type: 'blog', active: true };

export default function Writers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const load = () => api.getWriters().then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editId) await api.updateWriter(editId, form);
    else await api.createWriter(form);
    setForm(emptyForm); setEditId(null); load();
  };

  const edit = (item) => { setForm(item); setEditId(item.id); };
  const remove = async (id) => { if (confirm('確定刪除？')) { await api.deleteWriter(id); load(); } };

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>好文推薦 - 作家管理</h1>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>{editId ? '編輯' : '新增'}作家</h3>
        <input placeholder="作家名稱" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
        <input placeholder="頭像網址" value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} style={inputStyle} />
        <textarea placeholder="作家簡介" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
        <input placeholder="文章連結 (FB / Blog)" value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} style={inputStyle} />
        <select value={form.link_type} onChange={e => setForm({ ...form, link_type: e.target.value })} style={{ ...inputStyle, width: 'auto' }}>
          <option value="blog">Blog</option>
          <option value="facebook">Facebook</option>
        </select>
        <div style={{ marginTop: 12 }}>
          <button onClick={save} style={{ ...btnStyle, background: '#ab47bc', color: '#fff', marginRight: 8 }}>{editId ? '更新' : '新增'}</button>
          {editId && <button onClick={() => { setEditId(null); setForm(emptyForm); }} style={{ ...btnStyle, background: '#ccc' }}>取消</button>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {items?.map(item => (
          <div key={item.id} style={{ background: '#fff', borderRadius: 8, padding: 20, textAlign: 'center', border: '1px solid #eee' }}>
            {item.avatar_url && <img src={item.avatar_url} alt={item.name} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 12 }} />}
            <h4>{item.name}</h4>
            <p style={{ fontSize: 12, color: '#666', margin: '8px 0' }}>{item.bio}</p>
            <p style={{ fontSize: 11, color: '#999' }}>{item.link_type === 'facebook' ? 'Facebook' : 'Blog'}</p>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => edit(item)} style={{ ...btnStyle, background: '#4fc3f7', color: '#fff', marginRight: 4, fontSize: 12 }}>編輯</button>
              <button onClick={() => remove(item.id)} style={{ ...btnStyle, background: '#e74c3c', color: '#fff', fontSize: 12 }}>刪除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
