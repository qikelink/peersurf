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
      
      // Check if profile exists, if not create one with user data
      const createProfileIfNeeded = async () => {
        const { data: existingProfile, error } = await getUserProfile(user.id);
        console.log('Existing Profile:', existingProfile);
        console.log('Profile Error:', error);
        
        // CRITICAL FIX: Only create profile if it truly doesn't exist (no error AND no data)
        // Don't create on network/database errors - that would overwrite existing data!
        if (!existingProfile && !error) {
          // Profile doesn't exist and no error - safe to create
          const profileData = {
            id: user.id,
            username: user.user_metadata?.username || user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'user',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
            bio: user.user_metadata?.bio || null,
            // Use role from user_metadata if available, otherwise default to 'talent'
            role: (user.user_metadata?.role as 'talent' | 'SPE' | 'admin' | undefined) || 'talent' as const
          };
          
          console.log('Creating profile with data:', profileData);
          const { data: createdProfile, error: createError } = await createUserProfile(profileData);
          console.log('Profile creation result:', createdProfile);
          console.log('Profile creation error:', createError);
        } else if (existingProfile) {
          // Profile exists - only backfill missing data, NEVER overwrite existing data
          const oauthAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
          const updates: Partial<typeof existingProfile> = {};
          
          // Only update if field is MISSING in existing profile
          if (!existingProfile.avatar_url && oauthAvatar) {
            updates.avatar_url = oauthAvatar;
          }
          
          // Only update role if it's MISSING (don't overwrite existing role)
          if (!existingProfile.role && user.user_metadata?.role) {
            updates.role = user.user_metadata.role as 'talent' | 'SPE' | 'admin';
          }
          
          if (Object.keys(updates).length > 0) {
            console.log('Backfilling profile data...', updates);
            const { data: updatedProfile, error: updateError } = await updateUserProfile(user.id, updates);
            console.log('Profile update result:', updatedProfile);
            console.log('Profile update error:', updateError);
          }
        } else if (error) {
          // There was an error fetching profile - DON'T create/overwrite!
          // The profile might exist but we couldn't fetch it due to network/DB issues
          console.error('Error fetching profile:', error);
          console.warn('Profile might exist but could not be fetched. Will not create new profile to avoid data loss.');
          // Don't call createUserProfile here - it would overwrite existing data!
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

  // Wrap signUp to also create a profile (only if user is confirmed)
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
    
    // Always create profile immediately - don't wait for email confirmation
    // This ensures users can log in right after signup
    if (!error && data?.user) {
      const { error: profileError } = await createUserProfile({
        id: data.user.id,
        role: role ?? null,
        username: data.user.user_metadata?.username || email.split('@')[0],
        full_name: data.user.user_metadata?.full_name || email.split('@')[0],
      });
      
      if (profileError) {
        console.error('Error creating profile during signup:', profileError);
        // Don't fail signup if profile creation fails - it will be created on first login
      }
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
