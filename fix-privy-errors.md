# Fix Privy Integration Errors

You're encountering two main issues:

1. **UUID type mismatch**: Your `profiles` table expects UUID but Privy provides DIDs
2. **Missing email column**: The `profiles` table doesn't have an `email` column

## Solution: Update Your Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- 1. Add missing columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privy_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_privy_id ON profiles(privy_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 3. Create a function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, privy_id, email, full_name, username, avatar_url, wallet_address, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    NEW.raw_user_meta_data->>'privy_id',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'wallet_address', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

## What This Does

1. **Adds missing columns**:
   - `privy_id`: Stores the Privy user ID
   - `wallet_address`: Stores the user's wallet address
   - `email`: Stores the user's email address

2. **Creates indexes** for better query performance

3. **Sets up automatic user creation** when someone authenticates with Privy

4. **Keeps UUID primary key** but uses `privy_id` for Privy lookups

## Updated PrivyContext Logic

The PrivyContext has been updated to:
- Use `privy_id` for lookups instead of `id`
- Handle missing email gracefully
- Use proper conflict resolution

## Testing

After running the migration:

1. **Clear your browser cache** and local storage
2. **Restart your development server**: `npm run dev`
3. **Try logging in again** with Privy
4. **Check the browser console** for any remaining errors

## Verify It Works

1. Go to your Supabase Dashboard → Table Editor → profiles
2. Look for a new row with:
   - `privy_id`: Contains the Privy user ID (e.g., "did:privy:...")
   - `email`: Contains the user's email
   - `wallet_address`: Contains the wallet address
   - `id`: A UUID (auto-generated)

## Common Issues

### If you still get UUID errors:
- Make sure you ran the complete SQL migration above
- Check that the `profiles` table has the correct column types

### If you get "email column not found":
- Make sure you added the `email` column
- Check that the migration ran successfully

### If authentication works but wallet doesn't show:
- Check that the `wallet_address` column was added
- Verify the PrivyContext is properly syncing wallet data

## Next Steps

Once the migration is complete:
1. Test the authentication flow
2. Verify wallet information displays correctly
3. Test the funding functionality
4. Deploy to production with the same schema changes 