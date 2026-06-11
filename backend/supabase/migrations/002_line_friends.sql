-- LINE 好友
CREATE TABLE line_friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id text UNIQUE NOT NULL,
  display_name text,
  picture_url text,
  real_name text,
  phone text,
  note text,
  follow_status text DEFAULT 'followed', -- 'followed' | 'blocked'
  followed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
