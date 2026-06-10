import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const inputStyle = { width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, marginBottom: 8 };
const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500 };

const emptyForm = { store_id: '', title: '', description: '', image_url: '', start_date: '', end_date: '', active: true };

export default function Offers() {
  const [items, setItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const load = () => { api.getOffers().then(setItems); api.getStores().then(setStores); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editId) await api.updateOffer(editId, form);
    else await api.createOffer(form);
    setForm(emptyForm); setEditId(null); load();
  };

  const edit = (item) => { setForm(item); setEditId(item.id); };
  const remove = async (id) => { if (confirm('確定刪除？')) { await api.deleteOffer(id); load(); } };

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>店家優惠管理</h1>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>{editId ? '編輯' : '新增'}優惠</h3>
        <select value={form.store_id} onChange={e => setForm({ ...form, store_id: e.target.value })} style={{ ...inputStyle, width: 'auto', marginRight: 8 }}>
          <option value="">選擇店家</option>
          {stores?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <input placeholder="優惠標題" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
        <textarea placeholder="優惠描述" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
        <input placeholder="圖片網址" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} style={inputStyle} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="date" placeholder="開始日期" value={form.start_date || ''} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
          <input type="date" placeholder="結束日期" value={form.end_date || ''} onChange={e => setForm({ ...form, end_date: e.target.value })} style={inputStyle} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button onClick={save} style={{ ...btnStyle, background: '#ffa726', color: '#fff', marginRight: 8 }}>{editId ? '更新' : '新增'}</button>
          {editId && <button onClick={() => { setEditId(null); setForm(emptyForm); }} style={{ ...btnStyle, background: '#ccc' }}>取消</button>}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>店家</th><th style={{ padding: 12 }}>優惠</th><th style={{ padding: 12 }}>期間</th><th style={{ padding: 12 }}>操作</th>
          </tr></thead>
          <tbody>
            {items?.map(item => (
              <tr key={item.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{item.stores?.name || '-'}</td>
                <td style={{ padding: 12 }}>{item.title}</td>
                <td style={{ padding: 12, fontSize: 12 }}>{item.start_date || '?'} ~ {item.end_date || '?'}</td>
                <td style={{ padding: 12 }}>
                  <button onClick={() => edit(item)} style={{ ...btnStyle, background: '#4fc3f7', color: '#fff', marginRight: 4, fontSize: 12 }}>編輯</button>
                  <button onClick={() => remove(item.id)} style={{ ...btnStyle, background: '#e74c3c', color: '#fff', fontSize: 12 }}>刪除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
