'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Chrome, Monitor, Globe, ArrowRight, CheckCircle2, Info, Zap, Database } from 'lucide-react'
import { useAuthStore } from '@/features/auth/stores/auth-store'

function LoginContent() {
  const router = useRouter()
  const { addAccount, setActiveAccount } = useAuthStore()
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [connectedProvider, setConnectedProvider] = useState<string | null>(null)
  const [useDemoMode, setUseDemoMode] = useState(true)

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'gmail':
        return 'border-red-200 hover:border-red-300 hover:bg-red-50'
      case 'office365':
        return 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'
      default:
        return 'border-purple-200 hover:border-purple-300 hover:bg-purple-50'
    }
  }

  const handleRealOAuthConnect = (provider: 'google' | 'azure-ad') => {
    window.location.href = `/api/auth/${provider}`
  }

  const handleDemoConnect = async (provider: string, name: string) => {
    setIsConnecting(provider)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const account = {
      id: `${provider}-${Date.now()}`,
      provider: provider as 'gmail' | 'office365' | 'imap',
      email: `user@${provider === 'gmail' ? 'gmail.com' : provider === 'office365' ? 'outlook.com' : 'yahoo.com'}`,
      name: name,
      isActive: true,
    }
    
    addAccount(account)
    setActiveAccount(account.id)
    setConnectedProvider(name)
    setIsConnecting(null)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/inbox')
  }

  const handleProviderClick = (provider: string, name: string, realProvider?: 'google' | 'azure-ad') => {
    if (useDemoMode) {
      handleDemoConnect(provider, name)
    } else if (realProvider) {
      handleRealOAuthConnect(realProvider)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Mail className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to APTASK</h1>
          <p className="text-gray-600 mb-6">Connect your email accounts to get started</p>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setUseDemoMode(true)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                useDemoMode 
                  ? 'border-blue-500 bg-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Database className={`w-6 h-6 ${useDemoMode ? 'text-blue-600' : 'text-gray-500'}`} />
              <div className={`font-medium text-sm ${useDemoMode ? 'text-blue-900' : 'text-gray-700'}`}>
                Demo Mode
              </div>
              <div className="text-xs text-gray-500">
                Quick, no credentials needed
              </div>
            </button>
            
            <button
              onClick={() => setUseDemoMode(false)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                !useDemoMode 
                  ? 'border-blue-500 bg-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Zap className={`w-6 h-6 ${!useDemoMode ? 'text-blue-600' : 'text-gray-500'}`} />
              <div className={`font-medium text-sm ${!useDemoMode ? 'text-blue-900' : 'text-gray-700'}`}>
                Real OAuth
              </div>
              <div className="text-xs text-gray-500">
                Connect real email accounts
              </div>
            </button>
          </div>
        </div>

        {connectedProvider ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connected!</h2>
            <p className="text-gray-600 mb-4">Your {connectedProvider} account is now connected</p>
            <div className="text-sm text-gray-500">Redirecting to inbox...</div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Connect an Email Account
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={() => handleProviderClick('gmail', 'Gmail', 'google')}
                disabled={isConnecting !== null}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                  isConnecting === 'gmail' 
                    ? 'border-red-300 bg-red-50 opacity-70 cursor-not-allowed' 
                    : getProviderColor('gmail')
                } cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    {isConnecting === 'gmail' ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Chrome className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Gmail</div>
                    <div className="text-sm text-gray-500">
                      {useDemoMode ? 'Demo Gmail account' : 'Connect your Google account'}
                    </div>
                  </div>
                </div>
                {isConnecting !== 'gmail' && (
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                )}
              </button>

              <button
                onClick={() => handleProviderClick('office365', 'Office 365', 'azure-ad')}
                disabled={isConnecting !== null}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                  isConnecting === 'office365' 
                    ? 'border-blue-300 bg-blue-50 opacity-70 cursor-not-allowed' 
                    : getProviderColor('office365')
                } cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {isConnecting === 'office365' ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Monitor className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Office 365</div>
                    <div className="text-sm text-gray-500">
                      {useDemoMode ? 'Demo Office 365 account' : 'Connect your Microsoft account'}
                    </div>
                  </div>
                </div>
                {isConnecting !== 'office365' && (
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                )}
              </button>

              <button
                onClick={() => handleProviderClick('imap', 'IMAP')}
                disabled={isConnecting !== null}
                className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                  isConnecting === 'imap' 
                    ? 'border-purple-300 bg-purple-50 opacity-70 cursor-not-allowed' 
                    : getProviderColor('imap')
                } cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    {isConnecting === 'imap' ? (
                      <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Globe className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">IMAP</div>
                    <div className="text-sm text-gray-500">
                      {useDemoMode ? 'Demo IMAP account (Yahoo/AOL)' : 'Yahoo, AOL, or other IMAP providers'}
                    </div>
                  </div>
                </div>
                {isConnecting !== 'imap' && (
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {!useDemoMode && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <div className="font-medium">Setup Required</div>
                    <div>Copy .env.example to .env.local and add your OAuth credentials.</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-center text-gray-500">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
