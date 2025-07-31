-- Fix profiles table for Privy integration

-- 1. Add missing columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privy_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_privy_id ON profiles(privy_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 3. Update the id column to allow TEXT (for Privy DIDs)
-- First, create a backup of the current data
CREATE TABLE IF NOT EXISTS profiles_backup AS SELECT * FROM profiles;

-- Drop the primary key constraint temporarily
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_pkey;

-- Change the id column type to TEXT
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;

-- Add back the primary key constraint
ALTER TABLE profiles ADD PRIMARY KEY (id);

-- 4. Add a trigger to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, privy_id, email, full_name, username, avatar_url, wallet_address, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'privy_id',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'wallet_address', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    privy_id = EXCLUDED.privy_id,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url,
    wallet_address = EXCLUDED.wallet_address,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user(); 