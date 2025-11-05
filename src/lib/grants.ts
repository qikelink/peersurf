import { supabase } from './supabase';

export interface GrantFormData {
  title: string;
  category: string;
  amount: number;
  currency: string;
  duration: string;
  repository_url?: string;
  overview: string;
  team_size: string;
  payment_schedule: string;
}

export interface Grant extends GrantFormData {
  id: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const createGrant = async (grantData: GrantFormData, userId: string): Promise<Grant> => {
  const { data, error } = await supabase
    .from('grants')
    .insert({
      ...grantData,
      created_by: userId,
      status: 'submitted'
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Grant;
};

export const getAllGrants = async (): Promise<Grant[]> => {
  try {
    const { data, error } = await supabase
      .from('grants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch grants: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching grants:', error);
    throw error;
  }
};

// Delete a grant
export const deleteGrant = async (grantId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('grants')
      .delete()
      .eq('id', grantId);

    if (error) {
      throw new Error(`Failed to delete grant: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting grant:', error);
    throw error;
  }
};


