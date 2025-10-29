import { supabase } from "./supabase";
import type { Profile, Stake } from "./supabase";

// Check if Supabase is configured
const checkSupabaseConfig = () => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are not configured");
  }
};

// Email/password sign up with profile creation
export const signUp = async (
  email: string,
  password: string,
  userData?: Partial<Profile>
) => {
  checkSupabaseConfig();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        ...userData,
        // Ensure these are always set
        full_name: userData?.full_name || email.split("@")[0],
        avatar_url: userData?.avatar_url || "",
        username: userData?.username || email.split("@")[0],
        bio: userData?.bio || null,
        role: userData?.role || 'talent', // Default to talent
      },
    },
  });

  // Don't create profile here - let the trigger handle it
  return { data, error };
};

// Email/password sign in
export const signIn = async (email: string, password: string) => {
  checkSupabaseConfig();
  return supabase.auth.signInWithPassword({ email, password });
};

// Social login
export const signInWithProvider = async (provider: "google" | "twitter") => {
  checkSupabaseConfig();
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/opportunities`,
    },
  });
};

// Sign out
export const signOut = async () => {
  checkSupabaseConfig();
  return supabase.auth.signOut();
};

// Get current user
export const getUser = async () => {
  checkSupabaseConfig();
  const { data } = await supabase.auth.getUser();
  return data.user;
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return { data, error };
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Profile>
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();

  return { data, error };
};

// Listen to auth state changes
export const onAuthStateChange = (
  callback: (event: string, session: any) => void
) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Stake management functions
export const createStake = async (
  stakeData: Omit<Stake, "id" | "staked_at" | "last_reward_update">
) => {
  const { data, error } = await supabase
    .from("stakes")
    .insert([stakeData])
    .select()
    .single();

  return { data, error };
};

export const getUserStakes = async (userId: string) => {
  const { data, error } = await supabase
    .from("stakes")
    .select("*")
    .eq("user_id", userId)
    .order("staked_at", { ascending: false });

  return { data, error };
};

export const updateStake = async (stakeId: string, updates: Partial<Stake>) => {
  const { data, error } = await supabase
    .from("stakes")
    .update(updates)
    .eq("id", stakeId)
    .select()
    .single();

  return { data, error };
};

export const createUserProfile = async (profile: Partial<Profile>) => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(profile, { onConflict: "id" }) // Use upsert instead of insert
    .select()
    .single();

  return { data, error };
};

// Upload profile image to Supabase Storage
export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<{ data: { publicUrl: string } | null; error: Error | null }> => {
  try {
    checkSupabaseConfig();

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { data: null, error: new Error('File must be an image') };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { data: null, error: new Error('Image size must be less than 5MB') };
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { data: null, error: new Error(uploadError.message) };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return { data: null, error: new Error('Failed to get public URL') };
    }

    return { data: { publicUrl: urlData.publicUrl }, error: null };
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Failed to upload image') 
    };
  }
};
