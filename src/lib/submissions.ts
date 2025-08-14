import { supabase } from "./supabase";

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

export const listSubmissionsForOpportunity = async (opportunityId: string) => {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false });
  return { data, error };
};


