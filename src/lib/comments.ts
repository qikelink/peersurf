import { supabase } from "./supabase";

export interface OpportunityComment {
  id: string;
  opportunity_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CreateOpportunityCommentInput {
  opportunity_id: string;
  user_id: string;
  content: string;
}

export const listCommentsForOpportunity = async (opportunityId: string) => {
  const { data, error } = await supabase
    .from("opportunity_comments")
    .select("*")
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false });
  return { data, error } as { data: OpportunityComment[] | null; error: any };
};

export const createCommentForOpportunity = async (
  input: CreateOpportunityCommentInput
) => {
  const { data, error } = await supabase
    .from("opportunity_comments")
    .insert([input])
    .select()
    .single();
  return { data, error } as { data: OpportunityComment | null; error: any };
};


