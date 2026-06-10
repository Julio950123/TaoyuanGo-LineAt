# 桃園購LINE@ 後台管理系統

LINE@ 圖文選單後台管理系統，提供最新消息、合作店家、店家優惠、好文推薦的 CRUD 管理。

## Tech Stack
- **Backend**: Express + TypeScript + LINE Bot SDK
- **Frontend**: React + Vite + React Router
- **Database**: Supabase
- **Deploy**: Railway (backend) + Vercel (frontend)

## 圖文選單功能對應

| 格 | 功能 | 實作方式 |
|----|------|---------|
| 1 | 最新消息 | Flex Message (postback/keyword) |
| 2 | 店家優惠 | Flex Message carousel |
| 3 | 合作店家 | Flex Message + 更多商家按鈕 |
| 4 | 社群連結 | URI action → Facebook |
| 5 | 好宅攻略 | URI action → Facebook |
| 6 | 好文推薦 | Flex Message 作家卡片 |

## 部署步驟

### 1. Supabase
1. 到 [supabase.com](https://supabase.com) 新建 project
2. 到 SQL Editor 執行 `backend/supabase/migrations/001_init.sql`
3. 新增管理員帳號：
```sql
INSERT INTO admins (email, password_hash) VALUES (
  'admin@example.com',
  encode(sha256('你的密碼'::bytea), 'hex')
);
```

### 2. Railway (Backend)
1. 到 [railway.app](https://railway.app) 新建 project
2. 連結 GitHub repo，選 backend 資料夾
3. 設定環境變數：
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `LINE_CHANNEL_SECRET`
   - `LINE_CHANNEL_ACCESS_TOKEN`
   - `FRONTEND_URL` (Vercel 的 URL)
   - `PORT=3000`
4. Root Directory 設為 `backend`

### 3. Vercel (Frontend)
1. 到 [vercel.com](https://vercel.com) import repo
2. Root Directory 設為 `frontend`
3. 環境變數：`VITE_API_URL` = Railway backend URL

### 4. LINE 設定
1. 到 LINE Developers Console
2. Webhook URL 設為 Railway URL + `/webhook`
3. 圖文選單格4設 URI: settings 中的 facebook_url
4. 圖文選單格5設 URI: settings 中的 house_strategy_url
5. 格1/2/3/6 設 postback 或關鍵字回應

## 本地開發
```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```
