# Update Supabase Schema for Privy Integration

You need to add the `privy_id` column to your `profiles` table in Supabase. Here are the steps:

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project
3. Go to **SQL Editor**
4. Run the following SQL:

```sql
-- Add privy_id column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privy_id TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_privy_id ON profiles(privy_id);

-- Add wallet_address column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;
```

## Option 2: Using Supabase CLI

If you have Supabase CLI installed:

1. Run the migration:
```bash
supabase db push
```

## Option 3: Direct SQL Execution

You can also run the SQL directly in your Supabase SQL Editor:

```sql
-- Add privy_id column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privy_id TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_privy_id ON profiles(privy_id);

-- Add wallet_address column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;
```

## Verify the Changes

After running the migration, you can verify the changes by:

1. Going to **Table Editor** in your Supabase Dashboard
2. Selecting the `profiles` table
3. Checking that the `privy_id` and `wallet_address` columns exist

## What This Does

- **`privy_id`**: Stores the Privy user ID to link Privy users with your Supabase profiles
- **`wallet_address`**: Stores the user's wallet address from Privy
- **Index**: Improves query performance when searching by `privy_id`

After running this migration, your Privy integration should work correctly! 