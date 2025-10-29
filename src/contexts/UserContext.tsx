import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signIn,
  signUp as supabaseSignUp,
  signOut,
  signInWithProvider,
  getUser,
  onAuthStateChange,
  createUserProfile,
  getUserProfile,
  getUserStakes,
  updateUserProfile,
} from "../lib/auth";

interface UserContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    email: string,
    password: string,
    role?: "talent" | "SPE" | "admin"
  ) => Promise<any>;
  signOut: () => Promise<any>;
  signInWithProvider: (
    provider: "google" | "github" | "twitter" | "discord"
  ) => Promise<any>;
  profile: any;
  stakes: any[];
  refreshProfile: () => Promise<void>;
  refreshStakes: () => Promise<void>;
  currency: string;
  setCurrency: (currency: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stakes, setStakes] = useState<any[]>([]);
  const [currency, setCurrency] = useState<string>("NGN");

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
      // Console log user details for debugging
      console.log('=== USER SIGN-IN DETAILS ===');
      console.log('User ID:', user.id);
      console.log('User Email:', user.email);
      console.log('User Metadata:', user.user_metadata);
      console.log('Avatar URL (metadata.avatar_url):', user.user_metadata?.avatar_url);
      console.log('Picture (metadata.picture):', user.user_metadata?.picture);
      console.log('Full Name:', user.user_metadata?.full_name);
      console.log('Provider:', user.app_metadata?.provider);
      console.log('================================');
      
      // Check if profile exists, if not create one with OAuth data
      const createProfileIfNeeded = async () => {
        const { data: existingProfile, error } = await getUserProfile(user.id);
        console.log('Existing Profile:', existingProfile);
        console.log('Profile Error:', error);
        
        if (error || !existingProfile) {
          // Profile doesn't exist, create one with OAuth data
          const profileData = {
            id: user.id,
            username: user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'user',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
            bio: null,
            role: 'talent' as const
          };
          
          console.log('Creating profile with data:', profileData);
          const { data: createdProfile, error: createError } = await createUserProfile(profileData);
          console.log('Profile creation result:', createdProfile);
          console.log('Profile creation error:', createError);
        } else {
          // Backfill missing avatar_url from OAuth metadata
          const oauthAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
          console.log('OAuth Avatar URL:', oauthAvatar);
          console.log('Existing Profile Avatar URL:', existingProfile.avatar_url);
          
          if (!existingProfile.avatar_url && oauthAvatar) {
            console.log('Backfilling avatar URL...');
            const { data: updatedProfile, error: updateError } = await updateUserProfile(user.id, { avatar_url: oauthAvatar });
            console.log('Avatar update result:', updatedProfile);
            console.log('Avatar update error:', updateError);
          }
        }
        
        // Refresh profile after potential creation/backfill
        refreshProfile();
      };
      
      createProfileIfNeeded();
      refreshStakes();
    } else {
      setProfile(null);
      setStakes([]);
    }
  }, [user]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if Supabase is configured
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.warn("Supabase environment variables are not configured - running without authentication");
          setLoading(false);
          return;
        }

        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.warn("Error initializing auth - running without authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Only set up auth listener if Supabase is configured
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      const { data: listener } = onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      
      return () => {
        listener?.subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  // Wrap signUp to also create a profile
  const signUp = async (
    email: string,
    password: string,
    role?: "talent" | "SPE" | "admin"
  ) => {
    // Check if Supabase is configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return { 
        data: null, 
        error: { message: "Authentication not configured" } 
      };
    }

    const { data, error } = await supabaseSignUp(email, password, { role });
    if (!error && data?.user) {
      // Create profile row
      await createUserProfile({
        id: data.user.id,
        role: role ?? null,
        // Optionally add username: data.user.user_metadata?.username
      });
    }
    return { data, error };
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithProvider: (provider) => {
          if (provider !== "google" && provider !== "twitter") {
            return Promise.reject(
              new Error(
                'Provider not supported. Only "google" and "twitter" are allowed.'
              )
            );
          }
          return signInWithProvider(provider);
        },
        profile,
        stakes,
        refreshProfile,
        refreshStakes,
        currency,
        setCurrency,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};
