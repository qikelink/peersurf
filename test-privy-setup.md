# Testing Privy Integration

After updating your Supabase schema, follow these steps to test your Privy integration:

## 1. Environment Setup

Make sure you have your Privy App ID in your `.env` file:

```env
VITE_PRIVY_APP_ID=your-actual-privy-app-id
```

## 2. Database Schema

Run the SQL migration in your Supabase dashboard:

```sql
-- Add privy_id column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS privy_id TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_privy_id ON profiles(privy_id);

-- Add wallet_address column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;
```

## 3. Test Steps

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to your app** (usually `http://localhost:5173`)

3. **Test Authentication:**
   - Go to `/auth`
   - Try connecting with a wallet (MetaMask, etc.)
   - Try signing in with email
   - Verify you're redirected to `/wallet` after successful authentication

4. **Test Wallet Page:**
   - Check that your wallet information is displayed
   - Verify the PrivyWalletInfo component shows your connected wallet

5. **Test Funding:**
   - Go to `/funding`
   - Try the Privy onramp functionality
   - Verify the wallet integration works

## 4. Debugging

If you encounter issues:

### Check Browser Console
- Open Developer Tools (F12)
- Look for any JavaScript errors
- Check the Network tab for failed requests

### Check Supabase Logs
- Go to your Supabase Dashboard
- Check the Logs section for any database errors

### Common Issues

1. **"privy_id column doesn't exist"**
   - Run the SQL migration above

2. **"Privy App ID not found"**
   - Check your `.env` file has the correct App ID

3. **"Authentication not working"**
   - Verify your Privy App ID is correct
   - Check that your domain is whitelisted in Privy Console

## 5. Verify Database

After successful authentication, check your Supabase `profiles` table:

1. Go to Supabase Dashboard → Table Editor → profiles
2. Look for a new row with:
   - `privy_id`: Should contain the Privy user ID
   - `wallet_address`: Should contain the user's wallet address
   - Other profile information

## 6. Success Indicators

✅ **Working correctly if:**
- You can authenticate with Privy
- You're redirected to `/wallet` after login
- Your wallet information is displayed
- A new profile is created in Supabase with `privy_id`
- No console errors

❌ **Needs fixing if:**
- Authentication fails
- You get database errors
- Wallet information doesn't load
- Console shows errors

## 7. Next Steps

Once everything is working:
1. Test the funding functionality
2. Customize the UI as needed
3. Deploy to production
4. Update your production environment variables 