'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Plus, LogOut, Chrome, Monitor, Globe, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/features/auth/stores/auth-store'
import { useRouter } from 'next/navigation'

interface AccountSwitcherProps {
  onAddAccount?: () => void
}

export function AccountSwitcher({ onAddAccount }: AccountSwitcherProps) {
  const { accounts, activeAccountId, setActiveAccount, logout } = useAuthStore()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const activeAccount = accounts.find(a => a.id === activeAccountId)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'gmail':
        return <Chrome className="h-4 w-4 text-red-600" />
      case 'office365':
        return <Monitor className="h-4 w-4 text-blue-600" />
      default:
        return <Globe className="h-4 w-4 text-purple-600" />
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-green-500',
      'bg-teal-500',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
      >
        {activeAccount ? (
          <>
            <Avatar className="h-8 w-8">
              <AvatarFallback className={getAvatarColor(activeAccount.name)}>
                {getInitials(activeAccount.name)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-900">{activeAccount.name}</div>
              <div className="text-xs text-gray-500">{activeAccount.email}</div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="hidden sm:inline text-gray-700">Account</span>
          </div>
        )}
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-900">Email Accounts</div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => {
                  setActiveAccount(account.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                  account.isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className={getAvatarColor(account.name)}>
                    {getInitials(account.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${account.isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                      {account.name}
                    </span>
                    {account.isActive && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate">{account.email}</div>
                </div>
                <div className="flex-shrink-0">
                  {getProviderIcon(account.provider)}
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-100 space-y-2">
            <button
              onClick={() => {
                setIsOpen(false)
                onAddAccount?.()
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4 text-gray-600" />
              <span className="font-medium text-gray-700">Add Another Account</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                handleLogout()
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-600">Sign Out All Accounts</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
