import { NextResponse } from 'next/server'
import { generateAuthorizationUrl } from '@/lib/oauth/server'

export async function GET() {
  const state = crypto.randomUUID()
  
  const authUrl = generateAuthorizationUrl('google', state)
  
  const response = NextResponse.redirect(authUrl)
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
  })
  
  return response
}
