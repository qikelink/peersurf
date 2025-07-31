-- Add privy_id column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privy_id TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_privy_id ON profiles(privy_id);

-- Add wallet_address column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Update existing profiles to have a default privy_id if needed
-- This is optional and can be removed if you don't want to set default values
-- UPDATE profiles SET privy_id = id WHERE privy_id IS NULL; 