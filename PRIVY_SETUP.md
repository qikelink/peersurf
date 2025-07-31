# Privy Integration Setup

This project has been integrated with Privy for user authentication and wallet management. Here's how to set it up:

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Privy Configuration
VITE_PRIVY_APP_ID=your-privy-app-id-here

# Supabase Configuration (keep existing)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Getting Your Privy App ID

1. Go to [Privy Console](https://console.privy.io/)
2. Create a new app or select an existing one
3. Copy your App ID from the dashboard
4. Replace `your-privy-app-id-here` in the `.env` file with your actual App ID

## Database Schema Updates

You'll need to add a `privy_id` column to your `profiles` table in Supabase:

```sql
ALTER TABLE profiles ADD COLUMN privy_id TEXT;
CREATE INDEX idx_profiles_privy_id ON profiles(privy_id);
```

## Features Added

### Authentication
- **Privy Auth Page**: New authentication page at `/auth` using Privy's authentication system
- **Wallet Connection**: Users can connect with MetaMask, WalletConnect, or other wallets
- **Email Sign-in**: Users can also sign in with email addresses
- **Automatic Wallet Creation**: When users register, a wallet is automatically created for them

### Funding
- **Privy Funding Page**: New funding page at `/funding` using Privy's onramp solution
- **Fiat to Crypto**: Users can buy crypto using fiat (cards and bank transfers)
- **Multiple Tokens**: Support for ETH, USDC, MATIC, and OP tokens
- **Wallet Integration**: Direct integration with user's Privy wallet

### Changes Made

1. **Commented out Paystack**: The old Paystack funding has been commented out but preserved
2. **New Context**: Created `PrivyContext` to replace `UserContext` for Privy integration
3. **Updated Routes**: Added new Privy pages to the routing system
4. **Updated Components**: All existing pages now use the new Privy context

## Usage

### For Users
1. Visit `/auth` to sign in with wallet or email
2. Visit `/funding` to buy crypto with fiat
3. Use `/wallet` to view your crypto balance and transactions

### For Developers
- The old Paystack integration is preserved in comments
- You can easily switch back by updating the routes
- All existing functionality works with the new Privy system

## Next Steps

1. Set up your Privy App ID in the environment variables
2. Update your Supabase database schema
3. Test the authentication and funding flows
4. Customize the UI and branding as needed

## Troubleshooting

- Make sure your Privy App ID is correctly set in the environment variables
- Ensure your Supabase database has the `privy_id` column
- Check the browser console for any authentication errors
- Verify that your Privy app is configured for the correct domains 