-- Create bounties table
CREATE TABLE IF NOT EXISTS bounties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  budget_amount DECIMAL(10,2) NOT NULL,
  budget_currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  deadline DATE,
  repository_url TEXT,
  description TEXT NOT NULL,
  deliverables TEXT NOT NULL,
  acceptance_criteria TEXT NOT NULL,
  payment_method VARCHAR(20) NOT NULL DEFAULT 'On-chain (crypto)',
  bounty_type VARCHAR(20) NOT NULL DEFAULT 'Solo',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_bounties_created_by ON bounties(created_by);
CREATE INDEX IF NOT EXISTS idx_bounties_status ON bounties(status);
CREATE INDEX IF NOT EXISTS idx_bounties_category ON bounties(category);
CREATE INDEX IF NOT EXISTS idx_bounties_created_at ON bounties(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bounties_updated_at 
    BEFORE UPDATE ON bounties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
