-- Fixed Supabase Setup Script
-- Run this in your Supabase SQL Editor to fix the 500 errors

-- ========================================
-- 1. DROP EXISTING TABLES (if they exist)
-- ========================================
DROP TABLE IF EXISTS bounty_applications CASCADE;
DROP TABLE IF EXISTS role_requests CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS bounties CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ========================================
-- 2. CREATE PROFILES TABLE (Enhanced)
-- ========================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    wallet_address TEXT,
    role TEXT DEFAULT 'talent' CHECK (role IN ('talent', 'SPE', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. CREATE PROJECTS TABLE
-- ========================================
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    budget DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. CREATE SUBMISSIONS TABLE
-- ========================================
CREATE TABLE submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    bounty_id UUID, -- Will reference bounties table
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
    amount DECIMAL(10,2),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. CREATE PAYMENTS TABLE
-- ========================================
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
    bounty_id UUID, -- Will reference bounties table
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    payment_method TEXT,
    transaction_hash TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. CREATE BOUNTIES TABLE
-- ========================================
CREATE TABLE bounties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    budget DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'expired')),
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    deadline TIMESTAMP WITH TIME ZONE,
    requirements TEXT,
    skills_required TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. CREATE ROLE_REQUESTS TABLE
-- ========================================
CREATE TABLE role_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    requested_role TEXT NOT NULL CHECK (requested_role IN ('SPE', 'admin')),
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. CREATE BOUNTY_APPLICATIONS TABLE
-- ========================================
CREATE TABLE bounty_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bounty_id UUID REFERENCES bounties(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    proposal TEXT,
    proposed_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bounty_id, user_id)
);

-- ========================================
-- 9. UPDATE TRIGGERS
-- ========================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bounties_updated_at BEFORE UPDATE ON bounties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_role_requests_updated_at BEFORE UPDATE ON role_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bounty_applications_updated_at BEFORE UPDATE ON bounty_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounty_applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies - SIMPLIFIED
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Projects policies - SIMPLIFIED
CREATE POLICY "Users can view assigned projects" ON projects FOR SELECT USING (
    assigned_to = auth.uid() OR created_by = auth.uid()
);
CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Project creators can update projects" ON projects FOR UPDATE USING (created_by = auth.uid());

-- Submissions policies - SIMPLIFIED
CREATE POLICY "Users can view their own submissions" ON submissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create submissions" ON submissions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own submissions" ON submissions FOR UPDATE USING (user_id = auth.uid());

-- Payments policies - SIMPLIFIED
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create payments" ON payments FOR INSERT WITH CHECK (user_id = auth.uid());

-- Bounties policies - SIMPLIFIED
CREATE POLICY "Users can view active bounties" ON bounties FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view their own bounties" ON bounties FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Users can create bounties" ON bounties FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Bounty creators can update bounties" ON bounties FOR UPDATE USING (created_by = auth.uid());

-- Role requests policies - SIMPLIFIED
CREATE POLICY "Users can view their own role requests" ON role_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create role requests" ON role_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all role requests" ON role_requests FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update role requests" ON role_requests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Bounty applications policies - SIMPLIFIED
CREATE POLICY "Users can view their own applications" ON bounty_applications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create applications" ON bounty_applications FOR INSERT WITH CHECK (user_id = auth.uid());

-- ========================================
-- 11. INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_bounties_created_by ON bounties(created_by);
CREATE INDEX IF NOT EXISTS idx_bounties_status ON bounties(status);
CREATE INDEX IF NOT EXISTS idx_role_requests_user_id ON role_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_role_requests_status ON role_requests(status);
CREATE INDEX IF NOT EXISTS idx_bounty_applications_bounty_id ON bounty_applications(bounty_id);
CREATE INDEX IF NOT EXISTS idx_bounty_applications_user_id ON bounty_applications(user_id);

-- ========================================
-- 12. SAMPLE DATA FOR TESTING
-- ========================================

-- Insert sample projects (run after creating a user)
-- Replace 'YOUR_USER_ID' with your actual user ID
-- INSERT INTO projects (name, description, status, progress, assigned_to, created_by, budget) VALUES
-- ('Video Streaming Protocol', 'Develop a decentralized video streaming protocol', 'active', 75, 'YOUR_USER_ID', 'YOUR_USER_ID', 5000),
-- ('Content Moderation System', 'AI-powered content moderation for user-generated content', 'active', 90, 'YOUR_USER_ID', 'YOUR_USER_ID', 3000);

-- Insert sample bounties (run after creating a user)
-- INSERT INTO bounties (title, description, budget, created_by, deadline) VALUES
-- ('Mobile SDK Development', 'Create a mobile SDK for the platform', 2500, 'YOUR_USER_ID', NOW() + INTERVAL '30 days'),
-- ('Analytics Dashboard', 'Build a comprehensive analytics dashboard', 1800, 'YOUR_USER_ID', NOW() + INTERVAL '15 days');

-- Insert sample submissions (run after creating a user)
-- INSERT INTO submissions (user_id, project_id, title, description, status, amount) VALUES
-- ('YOUR_USER_ID', 'PROJECT_ID_HERE', 'UI Component Library', 'Created reusable UI components', 'approved', 500),
-- ('YOUR_USER_ID', 'PROJECT_ID_HERE', 'API Documentation', 'Comprehensive API documentation', 'approved', 300);

-- Insert sample payments (run after creating submissions)
-- INSERT INTO payments (user_id, submission_id, amount, status, completed_at) VALUES
-- ('YOUR_USER_ID', 'SUBMISSION_ID_HERE', 500, 'completed', NOW()),
-- ('YOUR_USER_ID', 'SUBMISSION_ID_HERE', 300, 'completed', NOW());

-- ========================================
-- 13. FUNCTIONS FOR COMMON OPERATIONS
-- ========================================

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_earned DECIMAL,
    total_submissions INTEGER,
    total_won INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(p.amount), 0) as total_earned,
        COUNT(s.id) as total_submissions,
        COUNT(s.id) FILTER (WHERE s.status = 'approved') as total_won
    FROM profiles pr
    LEFT JOIN submissions s ON pr.id = s.user_id
    LEFT JOIN payments p ON s.id = p.submission_id AND p.status = 'completed'
    WHERE pr.id = user_uuid
    GROUP BY pr.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user contributions by time period
CREATE OR REPLACE FUNCTION get_user_contributions(user_uuid UUID, period_days INTEGER)
RETURNS INTEGER AS $$
DECLARE
    contribution_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO contribution_count
    FROM submissions
    WHERE user_id = user_uuid
    AND created_at >= NOW() - INTERVAL '1 day' * period_days;
    
    RETURN contribution_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 14. VIEWS FOR COMMON QUERIES
-- ========================================

-- View for user dashboard data
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
    p.id as user_id,
    p.username,
    p.full_name,
    p.role,
    COUNT(DISTINCT pr.id) as assigned_projects_count,
    COUNT(DISTINCT s.id) as total_submissions,
    COUNT(DISTINCT s.id) FILTER (WHERE s.status = 'approved') as approved_submissions,
    COALESCE(SUM(pay.amount), 0) as total_earned
FROM profiles p
LEFT JOIN projects pr ON p.id = pr.assigned_to
LEFT JOIN submissions s ON p.id = s.user_id
LEFT JOIN payments pay ON s.id = pay.submission_id AND pay.status = 'completed'
GROUP BY p.id, p.username, p.full_name, p.role;

-- View for admin dashboard
CREATE OR REPLACE VIEW admin_dashboard AS
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE role = 'talent') as talent_users,
    COUNT(*) FILTER (WHERE role = 'SPE') as spe_users,
    COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as new_users_week,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_month
FROM profiles;

-- ========================================
-- 15. COMMENTS FOR DOCUMENTATION
-- ========================================
COMMENT ON TABLE profiles IS 'User profiles with role-based access control';
COMMENT ON TABLE projects IS 'Projects that users can be assigned to';
COMMENT ON TABLE submissions IS 'User submissions for projects or bounties';
COMMENT ON TABLE payments IS 'Payment records for completed work';
COMMENT ON TABLE bounties IS 'Bounties that can be created by SPE users';
COMMENT ON TABLE role_requests IS 'Role upgrade requests from users';
COMMENT ON TABLE bounty_applications IS 'Applications for bounties';

COMMENT ON COLUMN profiles.role IS 'User role: talent (default), SPE, or admin';
COMMENT ON COLUMN projects.status IS 'Project status: active, completed, paused, cancelled';
COMMENT ON COLUMN submissions.status IS 'Submission status: pending, approved, rejected, in_review';
COMMENT ON COLUMN payments.status IS 'Payment status: pending, completed, failed, cancelled';
COMMENT ON COLUMN bounties.status IS 'Bounty status: active, completed, cancelled, expired';
COMMENT ON COLUMN role_requests.status IS 'Request status: pending, approved, denied';

-- ========================================
-- 16. FINAL SETUP NOTES
-- ========================================
-- After running this script:
-- 1. Create a user through your app's auth system
-- 2. The user will automatically get a profile with role 'talent'
-- 3. Test the role upgrade functionality
-- 4. Add sample data using the commented INSERT statements above
-- 5. Verify RLS policies are working correctly

-- To test the setup:
-- 1. Create a user account
-- 2. Try editing the profile
-- 3. Request a role upgrade
-- 4. Create some test projects/bounties
-- 5. Verify all dashboard data loads correctly

-- If you still get 500 errors, check:
-- 1. That all tables were created successfully
-- 2. That RLS policies are working
-- 3. That your user has the correct permissions
-- 4. The Supabase logs for more detailed error information
