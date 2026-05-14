/* eslint-disable @typescript-eslint/no-explicit-any */
export function generateState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function storeState(state: string): void {
  localStorage.setItem('oauth_state', state)
}

export function verifyState(state: string): boolean {
  const storedState = localStorage.getItem('oauth_state')
  localStorage.removeItem('oauth_state')
  return storedState === state
}

export function storeTokens(provider: string, tokens: any): void {
  localStorage.setItem(`oauth_tokens_${provider}`, JSON.stringify(tokens))
}

export function getTokens(provider: string): any | null {
  const tokens = localStorage.getItem(`oauth_tokens_${provider}`)
  return tokens ? JSON.parse(tokens) : null
}

export function isTokenExpired(tokens: any): boolean {
  return Date.now() >= tokens.expiresAt
}

export function clearTokens(provider: string): void {
  localStorage.removeItem(`oauth_tokens_${provider}`)
}

export function clearAllTokens(): void {
  Object.keys(localStorage)
    .filter(key => key.startsWith('oauth_tokens_'))
    .forEach(key => localStorage.removeItem(key))
}
