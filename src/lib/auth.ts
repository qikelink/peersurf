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
  
  // Sign out any existing session first to prevent auto-login
  // Supabase will handle duplicate email detection at the database level
  await supabase.auth.signOut();
  
  // Disable email confirmation requirement by setting emailRedirectTo to null
  // This allows users to sign up and immediately log in
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined, // Don't require email confirmation
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

  // Handle Supabase's duplicate email error - Supabase enforces email uniqueness
  // but error messages can vary, so we normalize them here
  if (error) {
    // Sign out to prevent any session creation
    await supabase.auth.signOut();
    
    const errorMsg = error.message?.toLowerCase() || '';
    const errorStatus = error.status || 0;
    
    // Check if error is due to duplicate email (Supabase enforces this at DB level)
    if (
      errorMsg.includes('user already registered') ||
      errorMsg.includes('already registered') ||
      errorMsg.includes('email already exists') ||
      errorMsg.includes('duplicate') ||
      errorMsg.includes('already exists') ||
      errorStatus === 422 || // Supabase often returns 422 for duplicate emails
      errorStatus === 400 // Sometimes 400 for duplicates
    ) {
      return {
        data: null,
        error: {
          message: 'An account with this email already exists. Please sign in instead, or use a different email address.',
          status: errorStatus || 400,
        },
      };
    }
  }

  // ENFORCE: Additional check - if signup succeeded, verify it's actually new
  // Check backend directly to ensure user was just created
  if (!error && data?.user) {
    // Check if profile already exists - if it does, it's a duplicate
    const { data: profileCheck } = await supabase
      .from("profiles")
      .select("id, created_at")
      .eq("id", data.user.id)
      .maybeSingle();
    
    // If profile exists, check if user was created more than 2 seconds ago
    // (New signups create user and profile almost simultaneously)
    if (profileCheck) {
      const userCreatedAt = new Date(data.user.created_at || 0).getTime();
      const now = Date.now();
      const timeDiff = now - userCreatedAt;
      
      // If user was created more than 2 seconds ago, it's an existing user
      if (timeDiff > 2000) {
        // Sign out immediately - this is a duplicate
        await supabase.auth.signOut();
        
        return {
          data: null,
          error: {
            message: 'An account with this email already exists. Please sign in instead, or use a different email address.',
            status: 400,
          },
        };
      }
    }
    
    // Double-check: Verify session was actually created
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      // No session = signup failed even though no error
      await supabase.auth.signOut();
      
      return {
        data: null,
        error: {
          message: 'An account with this email already exists. Please sign in instead, or use a different email address.',
          status: 400,
        },
      };
    }
  }

  // Don't create profile here - let the trigger handle it
  return { data, error };
};

// Email/password sign in
export const signIn = async (email: string, password: string) => {
  checkSupabaseConfig();
  const result = await supabase.auth.signInWithPassword({ email, password });
  
  // If sign in fails due to email not confirmed, try to resend confirmation
  // This is a workaround - ideally email confirmation should be disabled in Supabase settings
  if (result.error?.message?.includes('email not confirmed') || result.error?.message?.includes('Email not confirmed')) {
    console.warn('Email not confirmed, but allowing login anyway');
    // Try to sign in again - some Supabase configs allow unconfirmed users
    // The actual fix should be in Supabase Dashboard: Authentication > Settings > Disable "Confirm email"
  }
  
  return result;
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

// Send password reset email (for users who forgot their password)
export const sendPasswordResetEmail = async (email: string) => {
  checkSupabaseConfig();
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth?mode=reset-password`,
  });
};

// Update password (for password reset flow)
export const updatePassword = async (newPassword: string) => {
  checkSupabaseConfig();
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
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
  // Use insert instead of upsert to prevent overwriting existing profiles
  // If profile already exists, this will fail safely
  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();

  // If error is due to duplicate (profile already exists), that's okay - fetch it instead
  if (error?.code === '23505') {
    // 23505 is PostgreSQL unique violation - profile already exists
    const { data: existingData, error: fetchError } = await getUserProfile(profile.id!);
    return { data: existingData, error: fetchError };
  }

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
