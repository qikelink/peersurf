import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

// Privy configuration
export const privyConfig = {
  appId: import.meta.env.VITE_PRIVY_APP_ID || 'your-privy-app-id',
  config: {
    loginMethods: ['email', 'google', 'apple', 'sms'] as ('email' | 'google' | 'apple' | 'sms')[],
    appearance: {
      theme: 'light' as const,
      accentColor: '#006400' as const,
      showWalletLoginFirst: false,
    },
    // Enable embedded wallets
    embeddedWallets: {
      createOnLogin: 'users-without-wallets' as const,
      noPromptOnSignature: true,
    },
    // Enable onramp/funding
    onramp: {
      enabled: true,
    },
  },
};

// Privy provider wrapper component
export const PrivyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={privyConfig.config}
    >
      {children}
    </PrivyProvider>
  );
}; 