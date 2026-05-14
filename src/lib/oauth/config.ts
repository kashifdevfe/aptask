export interface OAuthProvider {
  name: string
  clientId: string
  clientSecret: string
  authorizationUrl: string
  tokenUrl: string
  scope: string
  redirectUri: string
}

export const googleOAuthConfig: OAuthProvider = {
  name: 'Google',
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google',
}

export const azureOAuthConfig: OAuthProvider = {
  name: 'Microsoft',
  clientId: process.env.AZURE_AD_CLIENT_ID || '',
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
  authorizationUrl: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || 'common'}/oauth2/v2.0/authorize`,
  tokenUrl: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || 'common'}/oauth2/v2.0/token`,
  scope: 'https://outlook.office.com/mail.read https://outlook.office.com/mail.send offline_access openid profile email',
  redirectUri: process.env.AZURE_AD_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/azure-ad',
}

export interface OAuthTokens {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  tokenType: string
  scope: string
}

export interface UserInfo {
  id: string
  email: string
  name: string
  picture?: string
}
