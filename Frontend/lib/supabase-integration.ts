

import { supabase, type User, type Transaction, type Automation } from './supabase'
import { getCurrentUser } from './auth-service'

export class SupabaseIntegration {
  private currentUser: User | null = null

  constructor() {
    this.initializeUser()
  }

  private async initializeUser() {
    const authUser = getCurrentUser()
    if (authUser) {
      await this.ensureUserExists(authUser.address)
    }
  }

  async ensureUserExists(walletAddress: string): Promise<User> {
    try {

      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single()

      if (existingUser && !fetchError) {
        this.currentUser = existingUser
        return existingUser
      }

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ wallet_address: walletAddress })
        .select()
        .single()

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`)
      }

      this.currentUser = newUser
      return newUser
    } catch (error) {
      console.error('Error ensuring user exists:', error)
      throw error
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser
    }

    const authUser = getCurrentUser()
    if (authUser) {
      return await this.ensureUserExists(authUser.address)
    }

    return null
  }

  async storeTransaction(transactionData: {
    txHash: string
    type: 'swap' | 'send' | 'receive'
    tokenAddress?: string
    amount: string
    status?: 'pending' | 'success' | 'failed'
  }): Promise<Transaction> {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        tx_hash: transactionData.txHash,
        type: transactionData.type,
        token_address: transactionData.tokenAddress || '0x0000000000000000000000000000000000000000',
        amount: transactionData.amount,
        status: transactionData.status || 'pending'
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to store transaction: ${error.message}`)
    }

    return data
  }

  async getUserTransactions(limit = 50): Promise<Transaction[]> {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`)
    }

    return data || []
  }

  async storeAutomation(automationData: {
    name: string
    type: string
    status?: 'active' | 'paused' | 'completed'
    config: Record<string, any>
  }): Promise<Automation> {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('automations')
      .insert({
        user_id: user.id,
        name: automationData.name,
        type: automationData.type,
        status: automationData.status || 'active',
        config: automationData.config
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to store automation: ${error.message}`)
    }

    return data
  }

  async getUserAutomations(): Promise<Automation[]> {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch automations: ${error.message}`)
    }

    return data || []
  }

  async updateTransactionStatus(txId: string, status: 'pending' | 'success' | 'failed'): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', txId)

    if (error) {
      throw new Error(`Failed to update transaction status: ${error.message}`)
    }
  }

  async updateAutomationStatus(automationId: string, status: 'active' | 'paused' | 'completed'): Promise<void> {
    const { error } = await supabase
      .from('automations')
      .update({ status })
      .eq('id', automationId)

    if (error) {
      throw new Error(`Failed to update automation status: ${error.message}`)
    }
  }

  async getTransactionStats(): Promise<{
    total: number
    successful: number
    failed: number
    pending: number
  }> {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('status')
      .eq('user_id', user.id)

    if (error) {
      throw new Error(`Failed to fetch transaction stats: ${error.message}`)
    }

    const stats = {
      total: data?.length || 0,
      successful: data?.filter(tx => tx.status === 'success').length || 0,
      failed: data?.filter(tx => tx.status === 'failed').length || 0,
      pending: data?.filter(tx => tx.status === 'pending').length || 0
    }

    return stats
  }

  subscribeToTransactions(callback: (transaction: Transaction) => void) {
    const user = this.currentUser
    if (!user) return

    return supabase
      .channel('transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          callback(payload.new as Transaction)
        }
      )
      .subscribe()
  }

  subscribeToAutomations(callback: (automation: Automation) => void) {
    const user = this.currentUser
    if (!user) return

    return supabase
      .channel('automations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'automations',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          callback(payload.new as Automation)
        }
      )
      .subscribe()
  }
}

export const supabaseIntegration = new SupabaseIntegration()

