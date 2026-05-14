import { NextResponse } from 'next/server'
import { exchangeCodeForTokens, getUserInfo } from '@/lib/oauth/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  
  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=${error}`)
  }
  
  if (!code || !state) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=invalid_request`)
  }
  
  try {
    const tokens = await exchangeCodeForTokens('azure-ad', code)
    const userInfo = await getUserInfo('azure-ad', tokens.accessToken)
    
    const accountData = {
      id: `azure-${userInfo.id}`,
      provider: 'office365' as const,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      tokens: tokens,
      isActive: true,
    }
    
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/inbox`)
    response.cookies.set('auth_account', JSON.stringify(accountData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })
    
    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login?error=auth_failed`)
  }
}
