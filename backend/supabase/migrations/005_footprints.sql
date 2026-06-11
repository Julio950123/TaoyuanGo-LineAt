CREATE TABLE footprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id text NOT NULL,
  page text NOT NULL,
  action text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_footprints_user ON footprints(line_user_id);
CREATE INDEX idx_footprints_created ON footprints(created_at DESC);
