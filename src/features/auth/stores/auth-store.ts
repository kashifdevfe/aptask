import { create } from 'zustand'

export interface OAuthTokens {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  tokenType: string
  scope: string
}

export interface EmailAccount {
  id: string
  provider: 'gmail' | 'office365' | 'imap'
  email: string
  name: string
  picture?: string
  tokens?: OAuthTokens
  isActive: boolean
}

interface AuthState {
  accounts: EmailAccount[]
  activeAccountId: string | null
  isAuthenticated: boolean
  addAccount: (account: EmailAccount) => void
  removeAccount: (accountId: string) => void
  setActiveAccount: (accountId: string) => void
  getActiveAccount: () => EmailAccount | null
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accounts: [],
  activeAccountId: null,
  isAuthenticated: false,
  
  addAccount: (account) => set((state) => {
    const existingAccounts = state.accounts.map(a => ({
      ...a,
      isActive: false
    }))
    return {
      accounts: [...existingAccounts, { ...account, isActive: true }],
      activeAccountId: account.id,
      isAuthenticated: true,
    }
  }),
  
  removeAccount: (accountId) => set((state) => {
    const remainingAccounts = state.accounts.filter(a => a.id !== accountId)
    let newActiveAccountId = state.activeAccountId
    
    if (newActiveAccountId === accountId && remainingAccounts.length > 0) {
      newActiveAccountId = remainingAccounts[0].id
      remainingAccounts[0].isActive = true
    }
    
    return {
      accounts: remainingAccounts,
      activeAccountId: newActiveAccountId,
      isAuthenticated: remainingAccounts.length > 0,
    }
  }),
  
  setActiveAccount: (accountId) => set((state) => ({
    accounts: state.accounts.map(a => ({
      ...a,
      isActive: a.id === accountId
    })),
    activeAccountId: accountId,
  })),
  
  getActiveAccount: () => {
    const state = get()
    return state.accounts.find(a => a.id === state.activeAccountId) || null
  },
  
  logout: () => set({
    accounts: [],
    activeAccountId: null,
    isAuthenticated: false,
  }),
}))
