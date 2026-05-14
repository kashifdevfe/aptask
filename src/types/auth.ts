export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  accounts: EmailAccount[]
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface EmailAccount {
  id: string
  provider: 'gmail' | 'office365' | 'imap'
  email: string
  name: string
}
