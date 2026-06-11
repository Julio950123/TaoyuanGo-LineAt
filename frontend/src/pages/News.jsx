import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { api } from '../services/api';

const BANNER_W = 1200;
const BANNER_H = 1000;
const ASPECT = BANNER_W / BANNER_H;

export default function News() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', type: 'activity', published: false, start_date: '', end_date: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Sort state
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = [...items].sort((a, b) => {
    if (!sortKey) return 0;
    let va = a[sortKey] ?? '', vb = b[sortKey] ?? '';
    if (sortKey === 'published') { va = va ? 1 : 0; vb = vb ? 1 : 0; }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ k }) => <span style={{ marginLeft: 4, fontSize: 10, color: sortKey === k ? '#333' : '#ccc' }}>{sortKey === k ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}</span>;

  // Image & crop state
  const [imageFile, setImageFile] = useState(null); // final cropped blob
  const [imagePreview, setImagePreview] = useState(null); // preview URL for display
  const [rawUrl, setRawUrl] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);

  const load = () => api.getNews().then(d => setItems(Array.isArray(d) ? d : []));
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ title: '', content: '', type: 'activity', published: false, start_date: '', end_date: '' });
    setEditId(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const openNew = () => { resetForm(); setShowModal(true); };
  const openEdit = (item) => {
    setEditId(item.id);
    setForm({ title: item.title, content: item.content, type: item.type, published: item.published, start_date: item.start_date || '', end_date: item.end_date || '' });
    setImagePreview(item.image_url || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setRawUrl(URL.createObjectURL(f));
      setShowCrop(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
    e.target.value = '';
  };

  const onCropComplete = useCallback((_, area) => { setCroppedArea(area); }, []);

  const handleCropApply = async () => {
    if (!rawUrl || !croppedArea) return;
    const img = new Image();
    img.src = rawUrl;
    await new Promise(r => { img.onload = r; });
    const canvas = document.createElement('canvas');
    canvas.width = BANNER_W;
    canvas.height = BANNER_H;
    canvas.getContext('2d').drawImage(img, croppedArea.x, croppedArea.y, croppedArea.width, croppedArea.height, 0, 0, BANNER_W, BANNER_H);
    canvas.toBlob(blob => {
      setImageFile(blob);
      setImagePreview(URL.createObjectURL(blob));
      setShowCrop(false);
    }, 'image/jpeg', 0.85);
  };

  const save = async () => {
    if (!form.title.trim()) return alert('請輸入標題');
    setSaving(true);
    try {
      let image_url = imagePreview && !imageFile ? (editId ? undefined : null) : null;

      // Upload image if new file selected
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile, 'banner.jpg');
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const data = await res.json();
        if (data.url) image_url = data.url;
        else { alert('圖片上傳失敗：' + (data.error || '未知錯誤')); setSaving(false); return; }
      }

      const payload = {
        title: form.title,
        content: form.content || '',
        type: form.type,
        published: form.published,
      };
      if (form.start_date) payload.start_date = form.start_date;
      if (form.end_date) payload.end_date = form.end_date;
      if (image_url !== undefined) payload.image_url = image_url;

      let result;
      if (editId) result = await api.updateNews(editId, payload);
      else result = await api.createNews(payload);

      if (result?.error) {
        alert('儲存失敗：' + result.error);
      } else {
        setShowModal(false);
        resetForm();
        load();
      }
    } catch (e) {
      alert('儲存失敗：' + e.message);
    }
    setSaving(false);
  };

  const togglePublish = async (item) => {
    await api.updateNews(item.id, { published: !item.published });
    load();
  };

  const remove = async (id) => { if (confirm('確定刪除？')) { await api.deleteNews(id); load(); } };

  const getStatus = (item) => {
    if (!item.published) return { label: '草稿', bg: '#f3f4f6', color: '#6b7280' };
    return { label: '發布中', bg: '#dcfce7', color: '#16a34a' };
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('zh-TW') : '';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>最新消息管理</h1>
        <button onClick={openNew} style={s.addBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新增消息
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8e8e8', overflow: 'hidden' }}>
        <div style={s.header}>
          <span style={{ flex: 2, cursor: 'pointer' }} onClick={() => handleSort('title')}>標題<SortIcon k="title"/></span>
          <span style={{ flex: 1.5, cursor: 'pointer' }} onClick={() => handleSort('start_date')}>日期區間<SortIcon k="start_date"/></span>
          <span style={{ flex: 0.8, textAlign: 'center', cursor: 'pointer' }} onClick={() => handleSort('published')}>狀態<SortIcon k="published"/></span>
          <span style={{ flex: 1.2, textAlign: 'center' }}>操作</span>
        </div>
        {sorted.map(item => {
          const status = getStatus(item);
          return (
            <div key={item.id} style={s.row}>
              <span style={{ flex: 2, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.image_url && <img src={item.image_url} alt="" style={{ width: 48, height: 16, objectFit: 'cover', borderRadius: 3 }} />}
                {item.title}
              </span>
              <span style={{ flex: 1.5, fontSize: 12, color: '#666' }}>
                {formatDate(item.start_date)}{item.start_date && item.end_date ? ' ~ ' : ''}{formatDate(item.end_date)}
                {!item.start_date && !item.end_date && '—'}
              </span>
              <span style={{ flex: 0.8, textAlign: 'center' }}>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 10, background: status.bg, color: status.color, fontWeight: 500 }}>{status.label}</span>
              </span>
              <span style={{ flex: 1.2, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 6 }}>
                <button onClick={() => openEdit(item)} style={s.actionBtn} title="修改">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => togglePublish(item)} style={s.actionBtn} title={item.published ? '下架' : '上架'}>
                  {item.published
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                  }
                </button>
                <button onClick={() => remove(item.id)} style={s.actionBtn} title="刪除">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                </button>
              </span>
            </div>
          );
        })}
        {!items.length && <p style={{ textAlign: 'center', color: '#888', padding: 40 }}>尚無消息，點擊右上角新增</p>}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>{editId ? '編輯消息' : '新增消息'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', lineHeight: 1 }} aria-label="關閉">&times;</button>
            </div>

            {/* Banner image upload area */}
            <label style={s.bannerArea}>
              {imagePreview ? (
                <img src={imagePreview} alt="橫幅預覽" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span style={{ fontSize: 13, color: '#999', marginTop: 6 }}>點擊上傳橫幅圖片</span>
                </div>
              )}
              <input type="file" accept="image/png,image/jpeg" onChange={handleFile} style={{ display: 'none' }} />
            </label>
            <p style={{ fontSize: 11, color: '#888', textAlign: 'center', margin: '4px 0 12px' }}>建議尺寸：{BANNER_W} × {BANNER_H} px（3:2.5 比例）</p>

            <label style={s.label}>標題</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={s.input} placeholder="輸入標題…" />

            <label style={s.label}>內容</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} style={{ ...s.input, resize: 'vertical' }} placeholder="輸入內容…" />

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={s.label}>類型</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={s.input}>
                  <option value="activity">活動資訊</option>
                  <option value="winner">中獎名單</option>
                </select>
              </div>
            </div>

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

            <button onClick={save} disabled={saving} style={{ ...s.saveBtn, opacity: saving ? 0.6 : 1 }}>
              {saving ? '儲存中…' : (editId ? '更新' : '新增')}
            </button>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCrop && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, width: 600, maxWidth: '95vw', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>裁切橫幅圖片</span>
              <span style={{ fontSize: 12, color: '#888' }}>{BANNER_W} × {BANNER_H} px</span>
            </div>
            <div style={{ position: 'relative', height: 300, background: '#222' }}>
              <Cropper image={rawUrl} crop={crop} zoom={zoom} aspect={ASPECT} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
            </div>
            <div style={{ padding: '12px 16px' }}>
              <label style={{ fontSize: 12, color: '#666' }}>縮放</label>
              <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={e => setZoom(Number(e.target.value))} style={{ width: '100%' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button onClick={() => setShowCrop(false)} style={{ padding: '8px 20px', border: '1px solid #ddd', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>取消</button>
                <button onClick={handleCropApply} style={{ padding: '8px 20px', border: 'none', borderRadius: 6, background: '#4fc3f7', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>套用裁切</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  addBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: '#4fc3f7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  header: { display: 'flex', alignItems: 'center', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#555', background: '#f8f8f8', borderBottom: '1px solid #e8e8e8' },
  row: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 13 },
  actionBtn: { padding: 6, background: 'none', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: 12, padding: 24, width: 520, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' },
  bannerArea: { display: 'block', width: '100%', aspectRatio: '6/5', maxHeight: 260, background: '#f5f5f5', border: '2px dashed #ddd', borderRadius: 8, cursor: 'pointer', overflow: 'hidden' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12, color: '#333' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' },
  saveBtn: { width: '100%', marginTop: 20, padding: 12, background: '#4fc3f7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};
