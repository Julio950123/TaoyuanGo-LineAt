import { Router } from 'express';
import { supabase } from '../supabase';

export const pagesRouter = Router();

// 最新消息頁面
pagesRouter.get('/news', async (_req, res) => {
  const { data } = await supabase.from('news').select('*').eq('published', true).order('created_at', { ascending: false });
  const items = data || [];

  res.send(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>最新消息 - 桃園購</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans TC',sans-serif;background:#f5f5f5;padding:16px;max-width:600px;margin:0 auto}
h1{font-size:20px;padding:12px 0;border-bottom:2px solid #4fc3f7;margin-bottom:16px;color:#1a1a2e}
.item{background:#fff;border-radius:8px;margin-bottom:12px;border-left:4px solid #4fc3f7;overflow:hidden}
.item.winner{border-left-color:#ffa726}
.item-img{width:100%;aspect-ratio:6/5;object-fit:cover;display:block}
.item-body{padding:16px}
.item-type{font-size:11px;color:#888;margin-bottom:4px}
.item-title{font-size:15px;font-weight:700;margin-bottom:6px;color:#1a1a2e}
.item-content{font-size:13px;color:#555;line-height:1.6;white-space:pre-wrap}
.item-date{font-size:11px;color:#aaa;margin-top:8px}
.empty{text-align:center;color:#888;padding:40px 0}
</style>
</head>
<body>
<h1>最新消息</h1>
${items.length === 0 ? '<p class="empty">目前沒有最新消息</p>' : items.map(item => `
<div class="item ${item.type === 'winner' ? 'winner' : ''}">
  ${item.image_url ? `<img class="item-img" src="${esc(item.image_url)}" alt="${esc(item.title)}">` : ''}
  <div class="item-body">
    <div class="item-type">${item.type === 'winner' ? '🎉 中獎名單' : '📢 活動資訊'}</div>
    <div class="item-title">${esc(item.title)}</div>
    <div class="item-content">${esc(item.content)}</div>
    <div class="item-date">${[item.start_date, item.end_date].filter(Boolean).join(' ~ ') || new Date(item.created_at).toLocaleDateString('zh-TW')}</div>
  </div>
</div>`).join('')}
</body></html>`);
});

// 店家優惠頁面
pagesRouter.get('/offers', async (req, res) => {
  const category = req.query.category as string | undefined;

  const { data: categories } = await supabase.from('stores').select('category').eq('active', true);
  const uniqueCategories = [...new Set((categories || []).map(s => s.category).filter(Boolean))];

  let query = supabase.from('store_offers').select('*, stores(name, category)').eq('active', true).order('created_at', { ascending: false });
  const { data } = await query;
  const items = category ? (data || []).filter(o => o.stores?.category === category) : (data || []);

  res.send(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>店家優惠 - 桃園購</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans TC',sans-serif;background:#f5f5f5;padding:16px;max-width:600px;margin:0 auto}
h1{font-size:20px;padding:12px 0;border-bottom:2px solid #ffa726;margin-bottom:16px;color:#1a1a2e}
.cats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.cat-btn{padding:6px 14px;border-radius:20px;border:1px solid #ddd;background:#fff;font-size:13px;text-decoration:none;color:#333;cursor:pointer}
.cat-btn.active{background:#ffa726;color:#fff;border-color:#ffa726}
.item{background:#fff;border-radius:8px;padding:16px;margin-bottom:12px;border-left:4px solid #ffa726}
.item-store{font-size:11px;color:#ffa726;font-weight:600;margin-bottom:4px}
.item-title{font-size:15px;font-weight:700;margin-bottom:6px;color:#1a1a2e}
.item-desc{font-size:13px;color:#555;line-height:1.6}
.item-date{font-size:11px;color:#aaa;margin-top:8px}
.empty{text-align:center;color:#888;padding:40px 0}
</style>
</head>
<body>
<h1>店家優惠</h1>
<div class="cats">
  <a href="?${''}" class="cat-btn ${!category ? 'active' : ''}">全部</a>
  ${uniqueCategories.map(c => `<a href="?category=${encodeURIComponent(c)}" class="cat-btn ${category === c ? 'active' : ''}">${esc(c)}</a>`).join('')}
</div>
${items.length === 0 ? '<p class="empty">目前沒有優惠資訊</p>' : items.map(item => `
<div class="item">
  <div class="item-store">${esc(item.stores?.name || '')}</div>
  <div class="item-title">${esc(item.title)}</div>
  <div class="item-desc">${esc(item.description || '')}</div>
  <div class="item-date">${item.start_date || ''} ~ ${item.end_date || ''}</div>
</div>`).join('')}
</body></html>`);
});

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 合作店家頁面
pagesRouter.get('/stores', async (req, res) => {
  const category = req.query.category as string | undefined;
  const { data } = await supabase.from('stores').select('*').eq('active', true).order('created_at', { ascending: false });
  const items = data || [];

  const categories = [...new Set(items.map(s => s.category).filter(Boolean))];
  const filtered = category ? items.filter(s => s.category === category) : items;

  res.send(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>合作店家 - 桃園購</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Noto Sans TC',sans-serif;background:#f5f5f5;padding:16px;max-width:600px;margin:0 auto}
h1{font-size:20px;padding:12px 0;border-bottom:2px solid #66bb6a;margin-bottom:16px;color:#1a1a2e}
.cats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.cat-btn{padding:6px 14px;border-radius:20px;border:1px solid #ddd;background:#fff;font-size:13px;text-decoration:none;color:#333}
.cat-btn.active{background:#66bb6a;color:#fff;border-color:#66bb6a}
.item{background:#fff;border-radius:8px;margin-bottom:12px;border-left:4px solid #66bb6a;overflow:hidden}
.item-img{width:100%;aspect-ratio:3/2;object-fit:cover;display:block}
.item-body{padding:16px}
.item-name{font-size:15px;font-weight:700;margin-bottom:6px;color:#1a1a2e}
.item-info{font-size:12px;color:#666;margin-bottom:4px}
.item-cat{display:inline-block;font-size:11px;padding:2px 8px;border-radius:10px;background:#e8f5e9;color:#388e3c;margin-top:6px}
.item-link{display:inline-block;margin-top:8px;font-size:13px;color:#1a73e8;text-decoration:none}
.empty{text-align:center;color:#888;padding:40px 0}
</style>
</head>
<body>
<h1>合作店家</h1>
<div class="cats">
  <a href="?" class="cat-btn ${!category ? 'active' : ''}">全部</a>
  ${categories.map(c => `<a href="?category=${encodeURIComponent(c)}" class="cat-btn ${category === c ? 'active' : ''}">${esc(c)}</a>`).join('')}
</div>
${filtered.length === 0 ? '<p class="empty">目前沒有合作店家</p>' : filtered.map(item => `
<div class="item">
  ${item.image_url ? `<img class="item-img" src="${esc(item.image_url)}" alt="${esc(item.name)}">` : ''}
  <div class="item-body">
    <div class="item-name">${esc(item.name)}</div>
    <div class="item-info">${esc(item.address || '')}</div>
    <div class="item-info">營業時間：${esc(item.business_hours || '未提供')}</div>
    ${item.phone ? `<div class="item-info">電話：${esc(item.phone)}</div>` : ''}
    ${item.category ? `<span class="item-cat">${esc(item.category)}</span>` : ''}
    ${item.website_url ? `<br><a class="item-link" href="${esc(item.website_url)}" target="_blank">${esc(item.button_text || '查看詳情')} →</a>` : ''}
  </div>
</div>`).join('')}
</body></html>`);
});
