import { supabase } from './supabase';

export interface BountyFormData {
  title: string;
  category: string;
  budget_amount: number;
  budget_currency: string;
  deadline?: string;
  repository_url?: string;
  description: string;
  deliverables: string;
  acceptance_criteria: string;
  payment_method: string;
  bounty_type: string;
}

export interface Bounty extends BountyFormData {
  id: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Create a new bounty
export const createBounty = async (bountyData: BountyFormData, userId: string): Promise<Bounty> => {
  try {
    const { data, error } = await supabase
      .from('bounties')
      .insert({
        ...bountyData,
        created_by: userId,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create bounty: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating bounty:', error);
    throw error;
  }
};

// Get bounties created by a user
export const getUserBounties = async (userId: string): Promise<Bounty[]> => {
  try {
    const { data, error } = await supabase
      .from('bounties')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch bounties: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching bounties:', error);
    throw error;
  }
};

// Get all active bounties
export const getAllActiveBounties = async (): Promise<Bounty[]> => {
  try {
    const { data, error } = await supabase
      .from('bounties')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch active bounties: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching active bounties:', error);
    throw error;
  }
};

// Update bounty status
export const updateBountyStatus = async (bountyId: string, status: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bounties')
      .update({ status })
      .eq('id', bountyId);

    if (error) {
      throw new Error(`Failed to update bounty status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating bounty status:', error);
    throw error;
  }
};

// Delete a bounty
export const deleteBounty = async (bountyId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bounties')
      .delete()
      .eq('id', bountyId);

    if (error) {
      throw new Error(`Failed to delete bounty: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting bounty:', error);
    throw error;
  }
};
