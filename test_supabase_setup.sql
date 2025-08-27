-- Test Script for Supabase Setup
-- Run this after the main setup script to verify everything is working

-- ========================================
-- 1. CHECK IF TABLES EXIST
-- ========================================
SELECT 
    table_name,
    CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'projects', 'submissions', 'payments', 'bounties', 'role_requests', 'bounty_applications')
ORDER BY table_name;

-- ========================================
-- 2. CHECK RLS POLICIES
-- ========================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'projects', 'submissions', 'payments', 'bounties', 'role_requests', 'bounty_applications')
ORDER BY tablename, policyname;

-- ========================================
-- 3. CHECK INDEXES
-- ========================================
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'projects', 'submissions', 'payments', 'bounties', 'role_requests', 'bounty_applications')
ORDER BY tablename, indexname;

-- ========================================
-- 4. CHECK FUNCTIONS
-- ========================================
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_name IN ('get_user_stats', 'get_user_contributions', 'update_updated_at_column')
ORDER BY routine_name;

-- ========================================
-- 5. CHECK VIEWS
-- ========================================
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'VIEW'
AND table_name IN ('user_dashboard', 'admin_dashboard')
ORDER BY table_name;

-- ========================================
-- 6. TEST DATA INSERTION (if you have a user)
-- ========================================
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
-- Uncomment and run these after creating a user:

/*
-- Test profile creation
INSERT INTO profiles (id, username, full_name, bio, role) 
VALUES ('YOUR_USER_ID', 'testuser', 'Test User', 'This is a test bio', 'talent')
ON CONFLICT (id) DO UPDATE SET 
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    bio = EXCLUDED.bio,
    role = EXCLUDED.role;

-- Test project creation
INSERT INTO projects (name, description, status, progress, assigned_to, created_by, budget) 
VALUES ('Test Project', 'This is a test project', 'active', 50, 'YOUR_USER_ID', 'YOUR_USER_ID', 1000);

-- Test submission creation
INSERT INTO submissions (user_id, project_id, title, description, status, amount) 
VALUES ('YOUR_USER_ID', (SELECT id FROM projects WHERE created_by = 'YOUR_USER_ID' LIMIT 1), 'Test Submission', 'This is a test submission', 'approved', 500);

-- Test payment creation
INSERT INTO payments (user_id, submission_id, amount, status, completed_at) 
VALUES ('YOUR_USER_ID', (SELECT id FROM submissions WHERE user_id = 'YOUR_USER_ID' LIMIT 1), 500, 'completed', NOW());

-- Test bounty creation
INSERT INTO bounties (title, description, budget, created_by, deadline) 
VALUES ('Test Bounty', 'This is a test bounty', 2000, 'YOUR_USER_ID', NOW() + INTERVAL '30 days');

-- Test role request creation
INSERT INTO role_requests (user_id, requested_role, reason) 
VALUES ('YOUR_USER_ID', 'SPE', 'Testing role requests');
*/

-- ========================================
-- 7. VERIFY DATA (if test data was inserted)
-- ========================================
-- Uncomment and run these after inserting test data:

/*
-- Check profiles
SELECT * FROM profiles WHERE id = 'YOUR_USER_ID';

-- Check projects
SELECT * FROM projects WHERE created_by = 'YOUR_USER_ID';

-- Check submissions
SELECT * FROM submissions WHERE user_id = 'YOUR_USER_ID';

-- Check payments
SELECT * FROM payments WHERE user_id = 'YOUR_USER_ID';

-- Check bounties
SELECT * FROM bounties WHERE created_by = 'YOUR_USER_ID';

-- Check role requests
SELECT * FROM role_requests WHERE user_id = 'YOUR_USER_ID';

-- Test user stats function
SELECT * FROM get_user_stats('YOUR_USER_ID');

-- Test user dashboard view
SELECT * FROM user_dashboard WHERE user_id = 'YOUR_USER_ID';
*/

-- ========================================
-- 8. CHECK FOR ERRORS
-- ========================================
-- If you see any errors in the results above, here are common fixes:

-- If tables don't exist: Run the main setup script again
-- If RLS policies are missing: Check that RLS is enabled and policies were created
-- If functions don't exist: Check that the function creation didn't fail
-- If views don't exist: Check that the view creation didn't fail

-- ========================================
-- 9. COMMON ISSUES AND SOLUTIONS
-- ========================================

-- Issue: "relation does not exist" errors
-- Solution: Make sure you ran the main setup script completely

-- Issue: "permission denied" errors
-- Solution: Check that RLS policies are correctly configured

-- Issue: "function does not exist" errors  
-- Solution: Re-run the function creation parts of the setup script

-- Issue: "duplicate key value violates unique constraint"
-- Solution: Use ON CONFLICT clauses or check for existing data

-- Issue: "foreign key constraint fails"
-- Solution: Make sure referenced records exist before inserting

-- ========================================
-- 10. FINAL VERIFICATION
-- ========================================
-- If all the above checks pass, your setup should be working correctly.
-- You can now test the profile page functionality in your React app.

-- To get your user ID for testing:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';
