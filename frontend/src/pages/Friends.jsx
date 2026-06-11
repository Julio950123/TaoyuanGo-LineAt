import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ real_name: '', phone: '' });
  const [noteId, setNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [footprintUid, setFootprintUid] = useState(null);
  const [footprints, setFootprints] = useState([]);

  useEffect(() => { api.getFriends().then(d => setFriends(Array.isArray(d) ? d : [])); }, []);

  const viewFootprints = async (c) => {
    setFootprintUid(c.line_user_id);
    const data = await api.getFootprints(c.line_user_id);
    setFootprints(Array.isArray(data) ? data : []);
  };

  const startEdit = (c) => { setEditingId(c.id); setEditForm({ real_name: c.real_name || '', phone: c.phone || '' }); };
  const saveEdit = async () => {
    await api.updateFriend(editingId, editForm);
    setFriends(prev => prev.map(c => c.id === editingId ? { ...c, ...editForm } : c));
    setEditingId(null);
  };
  const startNote = (c) => { setNoteId(c.id); setNoteText(c.note || ''); };
  const saveNote = async () => {
    await api.updateFriend(noteId, { note: noteText });
    setFriends(prev => prev.map(c => c.id === noteId ? { ...c, note: noteText } : c));
    setNoteId(null);
  };

  const followed = friends.filter(c => c.follow_status === 'followed');

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>好友管理 <span style={{ fontSize: 14, fontWeight: 400, color: '#888' }}>共 {friends.length} 人 / 追蹤中 {followed.length} 人</span></h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={s.header}>
          <span style={{ flex: 0.5 }}></span>
          <span style={{ flex: 1.5, fontSize: 12, fontWeight: 600 }}>LINE 名稱</span>
          <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>姓名</span>
          <span style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>電話</span>
          <span style={{ flex: 0.8, fontSize: 12, fontWeight: 600 }}>狀態</span>
          <span style={{ flex: 1.2, fontSize: 12, fontWeight: 600 }}>加入時間</span>
          <span style={{ flex: 1, fontSize: 12, fontWeight: 600, textAlign: 'center' }}>操作</span>
        </div>
        {friends.map(c => (
          <div key={c.id} style={s.row}>
            <span style={{ flex: 0.5 }}>
              {c.picture_url ? <img src={c.picture_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ddd' }} />}
            </span>
            <span style={{ flex: 1.5, fontWeight: 500 }}>{c.display_name || '未知用戶'}</span>
            <span style={{ flex: 1, fontSize: 12, color: c.real_name ? '#333' : '#ccc' }}>{c.real_name || '—'}</span>
            <span style={{ flex: 1, fontSize: 12, color: c.phone ? '#333' : '#ccc' }}>{c.phone || '—'}</span>
            <span style={{ flex: 0.8 }}>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: c.follow_status === 'followed' ? '#e8f5e9' : '#fce4ec', color: c.follow_status === 'followed' ? '#06C755' : '#e53935' }}>
                {c.follow_status === 'followed' ? '追蹤中' : '已封鎖'}
              </span>
            </span>
            <span style={{ flex: 1.2, fontSize: 12, color: '#666' }}>{c.followed_at ? new Date(c.followed_at).toLocaleDateString('zh-TW') : '—'}</span>
            <span style={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 4 }}>
              <button onClick={() => startNote(c)} title="備註" style={s.iconBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.note ? '#92400E' : '#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </button>
              <button onClick={() => startEdit(c)} title="編輯" style={s.iconBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button onClick={() => viewFootprints(c)} title="足跡" style={s.iconBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
              </button>
            </span>
          </div>
        ))}
      </div>
      {!friends.length && <p style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>尚無好友，使用者加入 LINE OA 後會自動出現在這裡</p>}

      {editingId && (
        <div style={s.overlay} onClick={() => setEditingId(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>編輯好友資訊</h3>
              <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="關閉">&times;</button>
            </div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>姓名</label>
            <input value={editForm.real_name} onChange={e => setEditForm({ ...editForm, real_name: e.target.value })} style={s.input} placeholder="真實姓名" />
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12 }}>電話</label>
            <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={s.input} placeholder="09xxxxxxxx" type="tel" />
            <button onClick={saveEdit} style={{ width: '100%', marginTop: 16, padding: 12, background: '#4fc3f7', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>儲存</button>
          </div>
        </div>
      )}

      {noteId && (
        <div style={s.overlay} onClick={() => setNoteId(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>好友備註</h3>
              <button onClick={() => setNoteId(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="關閉">&times;</button>
            </div>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} style={{ ...s.input, minHeight: 120, resize: 'vertical' }} placeholder="輸入備註…" />
            <button onClick={saveNote} style={{ width: '100%', marginTop: 12, padding: 12, background: '#4fc3f7', color: '#fff', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>儲存</button>
          </div>
        </div>
      )}

      {footprintUid && (
        <div style={s.overlay} onClick={() => setFootprintUid(null)}>
          <div style={{ ...s.modal, width: 500 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>用戶足跡</h3>
              <button onClick={() => setFootprintUid(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }} aria-label="關閉">&times;</button>
            </div>
            {footprints.length === 0 ? <p style={{ color: '#888', textAlign: 'center', padding: 20 }}>尚無足跡記錄</p> : (
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {footprints.map(fp => (
                  <div key={fp.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0', gap: 12 }}>
                    <span style={{ fontSize: 11, color: '#999', minWidth: 120 }}>{new Date(fp.created_at).toLocaleString('zh-TW')}</span>
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, background: fp.page === 'news' ? '#e3f2fd' : fp.page === 'stores' ? '#e8f5e9' : '#fff3e0', color: fp.page === 'news' ? '#1976d2' : fp.page === 'stores' ? '#388e3c' : '#f57c00' }}>{fp.page === 'news' ? '最新消息' : fp.page === 'stores' ? '合作店家' : '店家優惠'}</span>
                    <span style={{ fontSize: 12, color: '#666' }}>{fp.action || ''}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  header: { display: 'flex', alignItems: 'center', padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#555', background: '#f8f8f8', borderRadius: '8px 8px 0 0', border: '1px solid #e8e8e8' },
  row: { display: 'flex', alignItems: 'center', padding: '10px 16px', border: '1px solid #e8e8e8', borderTop: 'none', fontSize: 13 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, padding: 24, width: 400, maxWidth: '90vw' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  iconBtn: { padding: 5, background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex' },
};
