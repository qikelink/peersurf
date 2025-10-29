-- Create submissions table for bounties
CREATE TABLE IF NOT EXISTS bounty_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bounty_id UUID NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  project_url TEXT,
  description TEXT NOT NULL,
  attachments TEXT[], -- Array of file URLs
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one submission per user per bounty
  UNIQUE(bounty_id, user_id)
);

-- Create submissions table for grants
CREATE TABLE IF NOT EXISTS grant_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  grant_id UUID NOT NULL REFERENCES grants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  project_url TEXT,
  description TEXT NOT NULL,
  attachments TEXT[], -- Array of file URLs
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one submission per user per grant
  UNIQUE(grant_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_bounty_id ON bounty_submissions(bounty_id);
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_user_id ON bounty_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_status ON bounty_submissions(status);
CREATE INDEX IF NOT EXISTS idx_bounty_submissions_created_at ON bounty_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_grant_submissions_grant_id ON grant_submissions(grant_id);
CREATE INDEX IF NOT EXISTS idx_grant_submissions_user_id ON grant_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_grant_submissions_status ON grant_submissions(status);
CREATE INDEX IF NOT EXISTS idx_grant_submissions_created_at ON grant_submissions(created_at);

-- Add triggers to update updated_at timestamp
CREATE TRIGGER update_bounty_submissions_updated_at 
    BEFORE UPDATE ON bounty_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grant_submissions_updated_at 
    BEFORE UPDATE ON grant_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE bounty_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view own bounty submissions" ON bounty_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own grant submissions" ON grant_submissions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create submissions
CREATE POLICY "Users can create bounty submissions" ON bounty_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can create grant submissions" ON grant_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bounty/Grant owners can view all submissions for their opportunities
CREATE POLICY "Bounty owners can view submissions" ON bounty_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bounties 
            WHERE bounties.id = bounty_submissions.bounty_id 
            AND bounties.created_by = auth.uid()
        )
    );

CREATE POLICY "Grant owners can view submissions" ON grant_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM grants 
            WHERE grants.id = grant_submissions.grant_id 
            AND grants.created_by = auth.uid()
        )
    );

-- Bounty/Grant owners can update submission status
CREATE POLICY "Bounty owners can update submissions" ON bounty_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM bounties 
            WHERE bounties.id = bounty_submissions.bounty_id 
            AND bounties.created_by = auth.uid()
        )
    );

CREATE POLICY "Grant owners can update submissions" ON grant_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM grants 
            WHERE grants.id = grant_submissions.grant_id 
            AND grants.created_by = auth.uid()
        )
    );
