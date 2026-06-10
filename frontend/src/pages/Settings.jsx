import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const inputStyle = { width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, marginBottom: 8 };

export default function Settings() {
  const [settings, setSettings] = useState({ facebook_url: '', house_strategy_url: '', stores_page_url: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.getSettings().then(s => setSettings(prev => ({ ...prev, ...s }))); }, []);

  const save = async () => {
    await api.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>系統設定</h1>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 600 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 }}>Facebook 社群連結（格4）</label>
        <input value={settings.facebook_url} onChange={e => setSettings({ ...settings, facebook_url: e.target.value })} placeholder="https://facebook.com/..." style={inputStyle} />

        <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500, marginTop: 16 }}>好宅攻略連結（格5）</label>
        <input value={settings.house_strategy_url} onChange={e => setSettings({ ...settings, house_strategy_url: e.target.value })} placeholder="https://facebook.com/..." style={inputStyle} />

        <label style={{ display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500, marginTop: 16 }}>合作店家頁面連結（更多商家按鈕）</label>
        <input value={settings.stores_page_url} onChange={e => setSettings({ ...settings, stores_page_url: e.target.value })} placeholder="https://..." style={inputStyle} />

        <button onClick={save} style={{ marginTop: 16, padding: '10px 24px', background: '#4fc3f7', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500 }}>
          儲存設定
        </button>
        {saved && <span style={{ marginLeft: 12, color: '#66bb6a', fontSize: 14 }}>已儲存！</span>}
      </div>
    </div>
  );
}
