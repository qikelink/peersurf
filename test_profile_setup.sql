-- Test Script for Profile Page Setup
-- Run this after executing supabase_setup_complete.sql

-- Test 1: Check if all tables exist
SELECT 
  table_name,
  CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'projects', 'submissions', 'payments', 'bounties', 'role_requests', 'bounty_applications')
ORDER BY table_name;

-- Test 2: Check if all functions exist
SELECT 
  routine_name,
  CASE WHEN routine_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_user_stats', 'get_user_contributions', 'update_updated_at_column')
ORDER BY routine_name;

-- Test 3: Check if all views exist
SELECT 
  table_name,
  CASE WHEN table_name IS NOT NULL THEN '✅ EXISTS' ELSE '❌ MISSING' END as status
FROM information_schema.views 
WHERE table_schema = 'public' 
  AND table_name IN ('user_dashboard', 'admin_dashboard')
ORDER BY table_name;

-- Test 4: Check RLS policies
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
ORDER BY tablename, policyname;

-- Test 5: Check indexes
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Test 6: Verify role constraints
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass
  AND contype = 'c';

-- Test 7: Test the get_user_stats function (replace with actual user ID)
-- SELECT * FROM get_user_stats('your-user-id-here');

-- Test 8: Test the get_user_contributions function (replace with actual user ID)
-- SELECT * FROM get_user_contributions('your-user-id-here');

-- Test 9: Check sample data
SELECT 
  username,
  full_name,
  role,
  created_at
FROM profiles 
WHERE username IN ('admin_user', 'spe_user', 'talent_user')
ORDER BY role;

-- Test 10: Verify triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table, trigger_name;

-- Summary report
SELECT 
  'Tables' as category,
  COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'projects', 'submissions', 'payments', 'bounties', 'role_requests', 'bounty_applications')
UNION ALL
SELECT 
  'Functions' as category,
  COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_user_stats', 'get_user_contributions', 'update_updated_at_column')
UNION ALL
SELECT 
  'Views' as category,
  COUNT(*) as count
FROM information_schema.views 
WHERE table_schema = 'public' 
  AND table_name IN ('user_dashboard', 'admin_dashboard')
UNION ALL
SELECT 
  'Policies' as category,
  COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public'
UNION ALL
SELECT 
  'Indexes' as category,
  COUNT(*) as count
FROM pg_indexes 
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%';
