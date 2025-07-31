import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { supabase } from '../lib/supabase';

interface PrivyContextType {
  user: any;
  loading: boolean;
  profile: any;
  stakes: any[];
  currency: string;
  setCurrency: (currency: string) => void;
  refreshProfile: () => Promise<void>;
  refreshStakes: () => Promise<void>;
  createUserProfile: () => Promise<any>;
  getUserProfile: (userId: string) => Promise<any>;
  getUserStakes: (userId: string) => Promise<any>;
}

const PrivyContext = createContext<PrivyContextType | undefined>(undefined);

export const PrivyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: privyUser, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stakes, setStakes] = useState<any[]>([]);
  const [currency, setCurrency] = useState<string>("NGN");

  // Sync Privy user with Supabase
  useEffect(() => {
    if (ready && authenticated && privyUser) {
      // Create or get user from Supabase
      const syncUserWithSupabase = async () => {
        try {
          // Check if user exists in Supabase
          const { data: existingUser, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('privy_id', privyUser.id)
            .maybeSingle();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError);
          }

          if (existingUser) {
            setUser(existingUser);
            setProfile(existingUser);
          } else {
            // Create new user profile with UUID
            const newUser = {
              privy_id: privyUser.id,
              email: privyUser.email?.address || '',
              full_name: privyUser.email?.address?.split('@')[0] || 'User',
              username: privyUser.email?.address?.split('@')[0] || 'user',
              avatar_url: '',
              wallet_address: wallets[0]?.address || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
              .from('profiles')
              .upsert([newUser], { onConflict: 'privy_id' })
              .select()
              .single();

            if (!error && data) {
              setUser(data);
              setProfile(data);
            } else if (error) {
              console.error('Error creating user profile:', error);
            }
          }
        } catch (error) {
          console.error('Error syncing user with Supabase:', error);
        }
      };

      syncUserWithSupabase();
    } else if (ready && !authenticated) {
      setUser(null);
      setProfile(null);
      setStakes([]);
    }
    
    setLoading(!ready);
  }, [ready, authenticated, privyUser, wallets]);

  // Fetch profile
  const refreshProfile = async () => {
    if (user && user.id) {
      const { data, error } = await getUserProfile(user.id);
      if (!error) setProfile(data);
    }
  };

  // Fetch stakes
  const refreshStakes = async () => {
    if (user && user.id) {
      const { data, error } = await getUserStakes(user.id);
      if (!error) setStakes(data || []);
    }
  };

  // Fetch profile and stakes after login
  useEffect(() => {
    if (user && user.id) {
      refreshProfile();
      refreshStakes();
    } else {
      setProfile(null);
      setStakes([]);
    }
  }, [user]);

  // Get user profile
  const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    return { data, error };
  };

  // Get user stakes
  const getUserStakes = async (userId: string) => {
    const { data, error } = await supabase
      .from("stakes")
      .select("*")
      .eq("user_id", userId)
      .order("staked_at", { ascending: false });

    return { data, error };
  };

  // Create user profile
  const createUserProfile = async () => {
    if (!privyUser) return;

    const newUser = {
      privy_id: privyUser.id,
      email: privyUser.email?.address || '',
      full_name: privyUser.email?.address?.split('@')[0] || 'User',
      username: privyUser.email?.address?.split('@')[0] || 'user',
      avatar_url: '',
      wallet_address: wallets[0]?.address || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(newUser, { onConflict: "privy_id" })
      .select()
      .single();

    if (!error && data) {
      setUser(data);
      setProfile(data);
    }

    return { data, error };
  };

  return (
    <PrivyContext.Provider
      value={{
        user,
        loading,
        profile,
        stakes,
        currency,
        setCurrency,
        refreshProfile,
        refreshStakes,
        createUserProfile,
        getUserProfile,
        getUserStakes,
      }}
    >
      {children}
    </PrivyContext.Provider>
  );
};

export const usePrivyContext = () => {
  const ctx = useContext(PrivyContext);
  if (!ctx) throw new Error("usePrivyContext must be used within a PrivyProvider");
  return ctx;
}; 