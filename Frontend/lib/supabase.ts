

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https:
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhb2NpdGFjcXh3cHhtdG94d21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTI0ODIsImV4cCI6MjA3NzE2ODQ4Mn0.7lAM3nEtHFOA4S6Q52enuL7geOI89Id_BodBIiCUUsc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export interface User {
  id: string
  wallet_address: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  tx_hash: string
  type: 'swap' | 'send' | 'receive'
  token_address: string
  amount: string
  status: 'pending' | 'success' | 'failed'
  created_at: string
}

export interface Automation {
  id: string
  user_id: string
  name: string
  type: string
  status: 'active' | 'paused' | 'completed'
  config: Record<string, any>
  created_at: string
  updated_at: string
}
