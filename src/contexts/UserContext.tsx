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
} from "../lib/auth";

interface UserContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    email: string,
    password: string,
    role?: "sponsor" | "talent"
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
      refreshProfile();
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
          console.error("Supabase environment variables are not configured");
          setLoading(false);
          return;
        }

        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: listener } = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Wrap signUp to also create a profile
  const signUp = async (
    email: string,
    password: string,
    role?: "sponsor" | "talent"
  ) => {
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
