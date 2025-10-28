/**
 * Supabase Server Client Configuration
 * Provides server-side access to Supabase services with admin privileges
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qaocitacqxwpxmtoxwmo.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhb2NpdGFjcXh3cHhtdG94d21vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU5MjQ4MiwiZXhwIjoyMDc3MTY4NDgyfQ.Lbw4wzl94kgZs68tYIfI4uLBz-ZS6PCrroqsygecwDg'
const jwtSecret = 'TyneO10A+9KPFAXay5kfFMIqSHpfbUxMy3PaRHKsZDj9CG/eORKYpRPDx6dcSy7i1c21GkglK9h53W//ID4jqA=='

// Create Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Database helper functions
export class SupabaseService {
  constructor() {
    this.client = supabaseAdmin
  }

  // User operations
  async createUser(walletAddress) {
    const { data, error } = await this.client
      .from('users')
      .insert({ wallet_address: walletAddress })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getUserByWallet(walletAddress) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()
    
    if (error) throw error
    return data
  }

  // Transaction operations
  async createTransaction(txData) {
    const { data, error } = await this.client
      .from('transactions')
      .insert(txData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getTransactionsByUser(userId) {
    const { data, error } = await this.client
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async updateTransactionStatus(txId, status) {
    const { data, error } = await this.client
      .from('transactions')
      .update({ status })
      .eq('id', txId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Automation operations
  async createAutomation(automationData) {
    const { data, error } = await this.client
      .from('automations')
      .insert(automationData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getAutomationsByUser(userId) {
    const { data, error } = await this.client
      .from('automations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async updateAutomationStatus(automationId, status) {
    const { data, error } = await this.client
      .from('automations')
      .update({ status })
      .eq('id', automationId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Analytics
  async getTransactionStats(userId) {
    const { data, error } = await this.client
      .from('transactions')
      .select('status, created_at')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }
}

export default new SupabaseService()
