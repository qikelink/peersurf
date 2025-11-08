import { supabase } from './supabase';
import type { Referral } from './supabase';

/**
 * Process a referral when a new user signs up with a referral code
 * @param referralCode The referral code used
 * @param referredUserId The ID of the user who was referred
 * @returns Success status and referral details
 */
export const processReferral = async (
  referralCode: string,
  referredUserId: string
): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    const { data, error } = await supabase.rpc('process_referral', {
      p_referral_code: referralCode.toUpperCase().trim(),
      p_referred_user_id: referredUserId,
    });

    if (error) {
      console.error('Error processing referral:', error);
      return {
        success: false,
        error: error.message || 'Failed to process referral',
      };
    }

    if (data && !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to process referral',
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (err) {
    console.error('Exception processing referral:', err);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
};

/**
 * Get referral code for a user
 * @param userId The user ID
 * @returns The referral code or null
 */
export const getUserReferralCode = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching referral code:', error);
      return null;
    }

    return data?.referral_code || null;
  } catch (err) {
    console.error('Exception fetching referral code:', err);
    return null;
  }
};

/**
 * Get user's referral statistics
 * @param userId The user ID
 * @returns Referral stats including total referrals and points
 */
export const getUserReferralStats = async (userId: string) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('points, referral_code')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError);
      return null;
    }

    return {
      points: profile?.points || 0,
      referralCode: profile?.referral_code || null,
      totalReferrals: referrals?.length || 0,
      referrals: referrals || [],
    };
  } catch (err) {
    console.error('Exception fetching referral stats:', err);
    return null;
  }
};

/**
 * Get all referrals for a user (people they referred)
 * @param userId The user ID
 * @returns Array of referrals
 */
export const getUserReferrals = async (userId: string): Promise<Referral[]> => {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching referrals:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Exception fetching referrals:', err);
    return [];
  }
};

