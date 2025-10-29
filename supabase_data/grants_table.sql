-- Create grants table
CREATE TABLE IF NOT EXISTS grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(80) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  duration VARCHAR(32) NOT NULL,
  repository_url TEXT,
  overview TEXT NOT NULL,
  team_size VARCHAR(32) NOT NULL,
  payment_schedule VARCHAR(32) NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'submitted',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_grants_created_by ON grants(created_by);
CREATE INDEX IF NOT EXISTS idx_grants_status ON grants(status);
CREATE INDEX IF NOT EXISTS idx_grants_category ON grants(category);
CREATE INDEX IF NOT EXISTS idx_grants_created_at ON grants(created_at);

-- Trigger to maintain updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_grants_updated_at
BEFORE UPDATE ON grants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


