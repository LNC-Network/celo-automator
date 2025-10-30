import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables - Supabase features disabled')
}

export const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null

export class SupabaseService {
  constructor() {
    this.client = supabaseAdmin
  }

  isAvailable() {
    return this.client !== null
  }

  async createUser(walletAddress) {
    if (!this.isAvailable()) return null
    const { data, error } = await this.client
      .from('users')
      .insert({ wallet_address: walletAddress })
      .select()
      .single()
    if (error) throw error
    return data
  }

  async getUserByWallet(walletAddress) {
    if (!this.isAvailable()) return null
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()
    if (error) throw error
    return data
  }

  async createTransaction(txData) {
    if (!this.isAvailable()) return null
    const { data, error } = await this.client
      .from('transactions')
      .insert(txData)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async getTransactionsByUser(userId) {
    if (!this.isAvailable()) return []
    const { data, error } = await this.client
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  async updateTransactionStatus(txId, status) {
    if (!this.isAvailable()) return null
    const { data, error } = await this.client
      .from('transactions')
      .update({ status })
      .eq('id', txId)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async createAutomation(automationData) {
    if (!this.isAvailable()) return null
    const { data, error } = await this.client
      .from('automations')
      .insert(automationData)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async getAutomationsByUser(userId) {
    if (!this.isAvailable()) return []
    const { data, error } = await this.client
      .from('automations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }

  async updateAutomationStatus(automationId, status) {
    if (!this.isAvailable()) return null
    const { data, error } = await this.client
      .from('automations')
      .update({ status })
      .eq('id', automationId)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async getTransactionStats(userId) {
    if (!this.isAvailable()) return []
    const { data, error } = await this.client
      .from('transactions')
      .select('status, created_at')
      .eq('user_id', userId)
    if (error) throw error
    return data
  }
}

export default new SupabaseService()
