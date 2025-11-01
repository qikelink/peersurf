import { supabase } from "./supabase";
import { 
  BountySubmission, 
  GrantSubmission, 
  CreateBountySubmissionInput, 
  CreateGrantSubmissionInput,
  UpdateSubmissionStatusInput 
} from "../types/submissions";

// Bounty Submissions
export const createBountySubmission = async (input: CreateBountySubmissionInput) => {
  const { data, error } = await supabase
    .from("bounty_submissions")
    .insert([input])
    .select()
    .single();
  return { data, error };
};

export const listBountySubmissions = async (bountyId: string) => {
  const { data, error } = await supabase
    .from("bounty_submissions")
    .select(`
      *,
      profiles:user_id(username, full_name, avatar_url)
    `)
    .eq("bounty_id", bountyId)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const getUserBountySubmissions = async (userId: string) => {
  const { data, error } = await supabase
    .from("bounty_submissions")
    .select(`
      *,
      bounties:bounty_id(title, status)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const updateBountySubmissionStatus = async (
  submissionId: string, 
  input: UpdateSubmissionStatusInput
) => {
  const { data, error } = await supabase
    .from("bounty_submissions")
    .update(input)
    .eq("id", submissionId)
    .select()
    .single();
  return { data, error };
};

// Grant Submissions
export const createGrantSubmission = async (input: CreateGrantSubmissionInput) => {
  const { data, error } = await supabase
    .from("grant_submissions")
    .insert([input])
    .select()
    .single();
  return { data, error };
};

export const listGrantSubmissions = async (grantId: string) => {
  const { data, error } = await supabase
    .from("grant_submissions")
    .select(`
      *,
      profiles:user_id(username, full_name, avatar_url)
    `)
    .eq("grant_id", grantId)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const getUserGrantSubmissions = async (userId: string) => {
  const { data, error } = await supabase
    .from("grant_submissions")
    .select(`
      *,
      grants:grant_id(title, status)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data, error };
};

export const checkUserBountySubmission = async (bountyId: string, userId: string) => {
  const { data, error } = await supabase
    .from("bounty_submissions")
    .select("id, status")
    .eq("bounty_id", bountyId)
    .eq("user_id", userId)
    .maybeSingle();
  return { data, error };
};

export const checkUserGrantSubmission = async (grantId: string, userId: string) => {
  const { data, error } = await supabase
    .from("grant_submissions")
    .select("id, status")
    .eq("grant_id", grantId)
    .eq("user_id", userId)
    .maybeSingle();
  return { data, error };
};

// Legacy support for existing opportunity-based submissions
export interface Submission {
  id: string;
  opportunity_id: string;
  user_id: string;
  proposal: string;
  links?: string | null;
  created_at: string;
}

export interface CreateSubmissionInput {
  opportunity_id: string;
  user_id: string;
  proposal: string;
  links?: string | null;
}

export const createSubmission = async (input: CreateSubmissionInput) => {
  const { data, error } = await supabase
    .from("submissions")
    .insert([input])
    .select()
    .single();
  return { data, error };
};

export const listSubmissionsForOpportunity = async (opportunityId: string, opportunityType?: string) => {
  // Try new tables first based on opportunity type
  if (opportunityType === "Grant") {
    const { data, error } = await supabase
      .from("grant_submissions")
      .select("*")
      .eq("grant_id", opportunityId)
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      return { data, error };
    }
    
    // If new table doesn't exist or has error, fall back to legacy
    if (error && (error.message.includes('relation "grant_submissions" does not exist') || error.message.includes('permission denied'))) {
      // Fall back to legacy submissions table
      const { data: legacyData, error: legacyError } = await supabase
        .from("submissions")
        .select("*")
        .eq("opportunity_id", opportunityId)
        .order("created_at", { ascending: false });
      return { data: legacyData, error: legacyError };
    }
    
    return { data, error };
  } else if (opportunityType === "Bounty" || opportunityType === "RFP") {
    // For Bounty and RFP, check bounty_submissions
    const { data, error } = await supabase
      .from("bounty_submissions")
      .select("*")
      .eq("bounty_id", opportunityId)
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      return { data, error };
    }
    
    // If new table doesn't exist or has error, fall back to legacy
    if (error && (error.message.includes('relation "bounty_submissions" does not exist') || error.message.includes('permission denied'))) {
      // Fall back to legacy submissions table
      const { data: legacyData, error: legacyError } = await supabase
        .from("submissions")
        .select("*")
        .eq("opportunity_id", opportunityId)
        .order("created_at", { ascending: false });
      return { data: legacyData, error: legacyError };
    }
    
    return { data, error };
  } else {
    // Legacy: query the old submissions table
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("opportunity_id", opportunityId)
      .order("created_at", { ascending: false });
    return { data, error };
  }
};


