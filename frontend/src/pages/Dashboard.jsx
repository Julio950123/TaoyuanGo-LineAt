import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ news: 0, stores: 0, offers: 0, writers: 0 });

  useEffect(() => {
    Promise.all([api.getNews(), api.getStores(), api.getOffers(), api.getWriters()]).then(([n, s, o, w]) => {
      setStats({ news: n?.length || 0, stores: s?.length || 0, offers: o?.length || 0, writers: w?.length || 0 });
    });
  }, []);

  const cards = [
    { label: '最新消息', count: stats.news, color: '#4fc3f7' },
    { label: '合作店家', count: stats.stores, color: '#66bb6a' },
    { label: '店家優惠', count: stats.offers, color: '#ffa726' },
    { label: '好文作家', count: stats.writers, color: '#ab47bc' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>總覽</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 8, padding: 24, borderTop: `4px solid ${c.color}` }}>
            <p style={{ fontSize: 14, color: '#666' }}>{c.label}</p>
            <p style={{ fontSize: 32, fontWeight: 700, marginTop: 8 }}>{c.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
