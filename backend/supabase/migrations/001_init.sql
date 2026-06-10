-- 最新消息
CREATE TABLE news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'activity', -- 'activity' | 'winner'
  image_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 合作店家
CREATE TABLE stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  address text,
  phone text,
  website_url text,
  category text,
  sort_order int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 店家優惠
CREATE TABLE store_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  start_date date,
  end_date date,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 好文推薦作家
CREATE TABLE writers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar_url text,
  bio text,
  link_url text NOT NULL, -- FB or Blog
  link_type text DEFAULT 'blog', -- 'facebook' | 'blog'
  sort_order int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 系統設定 (key-value)
CREATE TABLE settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- 預設設定
INSERT INTO settings (key, value) VALUES
  ('facebook_url', 'https://facebook.com/your-page'),
  ('house_strategy_url', 'https://facebook.com/house-strategy');

-- 管理員 (簡單帳密驗證)
CREATE TABLE admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);
