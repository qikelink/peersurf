-- Enforce Email Uniqueness
-- This script helps ensure no duplicate emails can exist
-- NOTE: Supabase already enforces email uniqueness in auth.users via a unique constraint
-- This script is mainly for documentation and optional cleanup

-- ============================================================================
-- IMPORTANT: You cannot directly modify auth.users without admin access
-- Supabase already enforces email uniqueness at the database level
-- The code handles duplicate email errors gracefully
-- ============================================================================

-- Optional: Query to find duplicate emails (for manual cleanup via Supabase Dashboard)
-- Run this to see if there are any duplicates (usually there shouldn't be)
SELECT 
  LOWER(email) as email_lower,
  COUNT(*) as duplicate_count,
  array_agg(id ORDER BY created_at DESC) as user_ids,
  array_agg(email_confirmed_at ORDER BY created_at DESC) as confirmation_status
FROM auth.users
GROUP BY LOWER(email)
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- If you find duplicates, you'll need to delete them manually via Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Find duplicate accounts
-- 3. Delete the older/unconfirmed ones, keeping the most recent confirmed one

-- ============================================================================
-- Note about email uniqueness:
-- ============================================================================
-- Supabase's auth.users table has a UNIQUE constraint on the email column
-- This means:
-- 1. Database-level enforcement: Duplicate emails are prevented automatically
-- 2. Application-level: The code in src/lib/auth.ts handles duplicate email errors
-- 3. User experience: Clear error messages guide users to sign in instead

-- ============================================================================
-- If you need to clean up duplicates (requires admin/service role access):
-- ============================================================================
-- You would need to use the Supabase Admin API or Dashboard:
-- 1. Use Supabase Dashboard > Authentication > Users to manually delete duplicates
-- 2. Or use the Admin API with service role key (not recommended for this)
-- 
-- The following SQL would work, but requires service role/admin access:
-- (Only use if you have admin access and need to clean up duplicates)
/*
DO $$
DECLARE
  duplicate_record RECORD;
BEGIN
  FOR duplicate_record IN 
    SELECT 
      LOWER(email) as email_lower,
      array_agg(id ORDER BY 
        CASE WHEN email_confirmed_at IS NOT NULL THEN 0 ELSE 1 END,
        created_at DESC
      ) as user_ids
    FROM auth.users
    GROUP BY LOWER(email)
    HAVING COUNT(*) > 1
  LOOP
    -- Delete all but the first (most recent confirmed) user
    DELETE FROM auth.users
    WHERE id = ANY(duplicate_record.user_ids[2:]);
  END LOOP;
END $$;
*/

-- ============================================================================
-- What the application code does:
-- ============================================================================
-- The code in src/lib/auth.ts already handles duplicate email errors:
-- - Catches Supabase's duplicate email errors (status 422, 400, etc.)
-- - Shows user-friendly messages: "An account with this email already exists..."
-- - Guides users to sign in instead of creating duplicates

-- No additional database enforcement is needed since Supabase already enforces it!

