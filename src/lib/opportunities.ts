import { supabase } from "./supabase";

export type OpportunityType = "Bounty" | "Grant";

export interface Opportunity {
  id: string;
  sponsor_id: string;
  title: string;
  type: OpportunityType;
  description: string;
  reward?: string | null; // for bounties
  max_amount?: string | null; // for grants
  category?: string | null;
  status: "Active" | "Closed";
  created_at: string;
}

export interface CreateOpportunityInput {
  sponsor_id: string;
  title: string;
  type: OpportunityType;
  description: string;
  reward?: string | null;
  max_amount?: string | null;
  category?: string | null;
  status?: "Active" | "Closed";
}

export const createOpportunity = async (input: CreateOpportunityInput) => {
  const payload = {
    ...input,
    status: input.status ?? "Active",
  };
  const { data, error } = await supabase
    .from("opportunities")
    .insert([payload])
    .select()
    .single();
  return { data, error };
};

export const listOpportunities = async (filters?: {
  type?: OpportunityType;
  sponsor_id?: string;
  status?: "Active" | "Closed";
}) => {
  let query = supabase.from("opportunities").select("*").order("created_at", { ascending: false });
  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.sponsor_id) query = query.eq("sponsor_id", filters.sponsor_id);
  if (filters?.status) query = query.eq("status", filters.status);
  const { data, error } = await query;
  return { data, error };
};

export const deleteOpportunity = async (id: string, sponsorId: string) => {
  const { data, error } = await supabase
    .from("opportunities")
    .delete()
    .eq("id", id)
    .eq("sponsor_id", sponsorId)
    .select()
    .maybeSingle();
  return { data, error };
};

