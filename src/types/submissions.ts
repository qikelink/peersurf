// Updated submission interfaces for better type safety

export interface BountySubmission {
  id: string;
  bounty_id: string;
  user_id: string;
  project_name: string;
  project_url?: string | null;
  description: string;
  attachments?: string[] | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface GrantSubmission {
  id: string;
  grant_id: string;
  user_id: string;
  project_name: string;
  project_url?: string | null;
  description: string;
  attachments?: string[] | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateBountySubmissionInput {
  bounty_id: string;
  user_id: string;
  project_name: string;
  project_url?: string | null;
  description: string;
  attachments?: string[] | null;
}

export interface CreateGrantSubmissionInput {
  grant_id: string;
  user_id: string;
  project_name: string;
  project_url?: string | null;
  description: string;
  attachments?: string[] | null;
}

export interface UpdateSubmissionStatusInput {
  status: 'pending' | 'approved' | 'rejected';
}
