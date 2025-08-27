-- Complete Supabase Setup for Profile Page
-- This script creates all necessary tables, functions, and policies

-- Drop existing tables to ensure clean setup
DROP TABLE IF EXISTS bounty_applications CASCADE;
DROP TABLE IF EXISTS role_requests CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS bounties CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  wallet_address TEXT,
  role TEXT DEFAULT 'talent' CHECK (role IN ('talent', 'SPE', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bounties table
CREATE TABLE bounties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  budget DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_by UUID REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role_requests table
CREATE TABLE role_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('SPE', 'admin')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bounty_applications table
CREATE TABLE bounty_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id UUID REFERENCES bounties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bounties_updated_at BEFORE UPDATE ON bounties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_role_requests_updated_at BEFORE UPDATE ON role_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bounty_applications_updated_at BEFORE UPDATE ON bounty_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounty_applications ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Projects RLS Policies
CREATE POLICY "Users can view projects they're assigned to" ON projects FOR SELECT USING (
  assigned_to = auth.uid() OR created_by = auth.uid()
);
CREATE POLICY "Users can update projects they created" ON projects FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "SPE and Admin can create projects" ON projects FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SPE', 'admin'))
);
CREATE POLICY "Admins can view all projects" ON projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Submissions RLS Policies
CREATE POLICY "Users can view their own submissions" ON submissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create submissions" ON submissions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own submissions" ON submissions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Project creators can view submissions for their projects" ON submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE id = submissions.project_id AND created_by = auth.uid())
);
CREATE POLICY "Admins can view all submissions" ON submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payments RLS Policies
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create payments" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Bounties RLS Policies
CREATE POLICY "Users can view all active bounties" ON bounties FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view bounties they created" ON bounties FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Users can view bounties they're assigned to" ON bounties FOR SELECT USING (assigned_to = auth.uid());
CREATE POLICY "SPE and Admin can create bounties" ON bounties FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('SPE', 'admin'))
);
CREATE POLICY "Bounty creators can update their bounties" ON bounties FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Admins can view all bounties" ON bounties FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Role Requests RLS Policies
CREATE POLICY "Users can view their own role requests" ON role_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create role requests" ON role_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all role requests" ON role_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update role requests" ON role_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Bounty Applications RLS Policies
CREATE POLICY "Users can view their own applications" ON bounty_applications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create applications" ON bounty_applications FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Bounty creators can view applications for their bounties" ON bounty_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM bounties WHERE id = bounty_applications.bounty_id AND created_by = auth.uid())
);
CREATE POLICY "Admins can view all applications" ON bounty_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_project_id ON submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_bounties_created_by ON bounties(created_by);
CREATE INDEX IF NOT EXISTS idx_bounties_status ON bounties(status);
CREATE INDEX IF NOT EXISTS idx_role_requests_user_id ON role_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_role_requests_status ON role_requests(status);
CREATE INDEX IF NOT EXISTS idx_bounty_applications_bounty_id ON bounty_applications(bounty_id);
CREATE INDEX IF NOT EXISTS idx_bounty_applications_user_id ON bounty_applications(user_id);

-- Create function to get user stats
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
  total_earned DECIMAL(10,2),
  total_submissions INTEGER,
  total_won INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(p.amount), 0) as total_earned,
    COUNT(s.id) as total_submissions,
    COUNT(CASE WHEN s.status = 'approved' THEN 1 END) as total_won
  FROM profiles prof
  LEFT JOIN payments p ON prof.id = p.user_id AND p.status = 'completed'
  LEFT JOIN submissions s ON prof.id = s.user_id
  WHERE prof.id = user_uuid
  GROUP BY prof.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user contributions
CREATE OR REPLACE FUNCTION get_user_contributions(user_uuid UUID)
RETURNS TABLE (
  weekly INTEGER,
  monthly INTEGER,
  all_time INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(CASE WHEN s.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as weekly,
    COUNT(CASE WHEN s.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as monthly,
    COUNT(s.id) as all_time
  FROM profiles prof
  LEFT JOIN submissions s ON prof.id = s.user_id
  WHERE prof.id = user_uuid
  GROUP BY prof.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for user dashboard
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.role,
  COUNT(DISTINCT pr.id) as project_count,
  COUNT(DISTINCT s.id) as submission_count,
  COUNT(DISTINCT pay.id) as payment_count,
  COALESCE(SUM(pay.amount), 0) as total_earned
FROM profiles p
LEFT JOIN projects pr ON p.id = pr.assigned_to
LEFT JOIN submissions s ON p.id = s.user_id
LEFT JOIN payments pay ON p.id = pay.user_id AND pay.status = 'completed'
GROUP BY p.id, p.username, p.full_name, p.role;

-- Create view for admin dashboard
CREATE OR REPLACE VIEW admin_dashboard AS
SELECT 
  'users' as category,
  COUNT(*) as count
FROM profiles
UNION ALL
SELECT 
  'projects' as category,
  COUNT(*) as count
FROM projects
UNION ALL
SELECT 
  'pending_requests' as category,
  COUNT(*) as count
FROM role_requests
WHERE status = 'pending'
UNION ALL
SELECT 
  'active_bounties' as category,
  COUNT(*) as count
FROM bounties
WHERE status = 'active';

-- Insert some sample data for testing
INSERT INTO profiles (id, username, full_name, bio, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin_user', 'Admin User', 'System administrator', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'spe_user', 'SPE User', 'Project executive', 'SPE'),
  ('00000000-0000-0000-0000-000000000003', 'talent_user', 'Talent User', 'Skilled contributor', 'talent')
ON CONFLICT (id) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
