import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const inputStyle = { width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, marginBottom: 8 };
const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500 };

export default function News() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', type: 'activity', published: true });
  const [editId, setEditId] = useState(null);

  const load = () => api.getNews().then(setItems);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editId) await api.updateNews(editId, form);
    else await api.createNews(form);
    setForm({ title: '', content: '', type: 'activity', published: true });
    setEditId(null);
    load();
  };

  const edit = (item) => { setForm(item); setEditId(item.id); };
  const remove = async (id) => { if (confirm('確定刪除？')) { await api.deleteNews(id); load(); } };

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>最新消息管理</h1>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>{editId ? '編輯' : '新增'}消息</h3>
        <input placeholder="標題" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
        <textarea placeholder="內容" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle, width: 'auto', marginRight: 8 }}>
          <option value="activity">活動資訊</option>
          <option value="winner">中獎名單</option>
        </select>
        <label style={{ fontSize: 14 }}>
          <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> 發布
        </label>
        <div style={{ marginTop: 12 }}>
          <button onClick={save} style={{ ...btnStyle, background: '#4fc3f7', color: '#fff', marginRight: 8 }}>{editId ? '更新' : '新增'}</button>
          {editId && <button onClick={() => { setEditId(null); setForm({ title: '', content: '', type: 'activity', published: true }); }} style={{ ...btnStyle, background: '#ccc' }}>取消</button>}
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
            <th style={{ padding: 12 }}>標題</th><th style={{ padding: 12 }}>類型</th><th style={{ padding: 12 }}>狀態</th><th style={{ padding: 12 }}>操作</th>
          </tr></thead>
          <tbody>
            {items?.map(item => (
              <tr key={item.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{item.title}</td>
                <td style={{ padding: 12 }}>{item.type === 'winner' ? '中獎名單' : '活動資訊'}</td>
                <td style={{ padding: 12 }}>{item.published ? '✅ 已發布' : '⏸ 未發布'}</td>
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
