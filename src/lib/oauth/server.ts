import { googleOAuthConfig, azureOAuthConfig, OAuthTokens, UserInfo } from './config'

export function generateAuthorizationUrl(provider: 'google' | 'azure-ad', state: string): string {
  const config = provider === 'google' ? googleOAuthConfig : azureOAuthConfig
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scope,
    state: state,
    access_type: 'offline',
    prompt: 'consent',
  })

  return `${config.authorizationUrl}?${params.toString()}`
}

export async function exchangeCodeForTokens(
  provider: 'google' | 'azure-ad',
  code: string
): Promise<OAuthTokens> {
  const config = provider === 'google' ? googleOAuthConfig : azureOAuthConfig
  
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code: code,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code',
  })

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`Failed to exchange code: ${response.statusText}`)
  }

  const data = await response.json()
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (data.expires_in * 1000),
    tokenType: data.token_type,
    scope: data.scope,
  }
}

export async function refreshAccessToken(
  provider: 'google' | 'azure-ad',
  refreshToken: string
): Promise<OAuthTokens> {
  const config = provider === 'google' ? googleOAuthConfig : azureOAuthConfig
  
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  })

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`)
  }

  const data = await response.json()
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresAt: Date.now() + (data.expires_in * 1000),
    tokenType: data.token_type,
    scope: data.scope,
  }
}

export async function getUserInfo(
  provider: 'google' | 'azure-ad',
  accessToken: string
): Promise<UserInfo> {
  let url: string
  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
  }

  if (provider === 'google') {
    url = 'https://www.googleapis.com/oauth2/v2/userinfo'
  } else {
    url = 'https://graph.microsoft.com/v1.0/me'
  }

  const response = await fetch(url, { headers })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.statusText}`)
  }

  const data = await response.json()
  
  if (provider === 'google') {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
    }
  } else {
    return {
      id: data.id,
      email: data.mail || data.userPrincipalName,
      name: data.displayName,
    }
  }
}
