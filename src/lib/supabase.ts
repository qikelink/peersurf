import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
  wallet_address: string | null
  role?: 'sponsor' | 'talent' | null
  total_staked: number
  total_earned: number
  updated_at: string
  created_at: string
}

export interface Stake {
  id: string
  user_id: string
  orchestrator_id: string
  orchestrator_name: string
  amount: number
  apy: number
  staked_at: string
  status: 'active' | 'unstaking' | 'withdrawn'
  earnings: number
  last_reward_update: string
}

export interface Earning {
  id: string
  user_id: string
  stake_id: string
  amount: number
  earned_at: string
  withdrawn: boolean
  withdrawn_at: string | null
}