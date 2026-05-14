'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Search, Plus, Mail, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/stores/auth-store'
import { AccountSwitcher } from '@/features/auth/components/AccountSwitcher'
import { useInboxStore } from '@/features/inbox/stores/inbox-store'
import { EmailListItem } from '@/features/inbox/components/EmailListItem'
import { EmailDetail } from '@/features/inbox/components/EmailDetail'
import { ComposeModal } from '@/features/compose/components/ComposeModal'

export default function InboxPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const {
    emails,
    selectedEmail,
    isLoading,
    setSelectedEmail,
    toggleStar,
    markAsRead,
    archiveEmail,
    deleteEmail,
    loadMockData,
  } = useInboxStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [composeMode, setComposeMode] = useState<'compose' | 'reply' | 'forward'>('compose')
  const [composePrefill, setComposePrefill] = useState<{
    to?: string
    subject?: string
    body?: string
  }>()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    loadMockData()
  }, [isAuthenticated, loadMockData, router])

  const filteredEmails = emails.filter((email) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      email.subject.toLowerCase().includes(query) ||
      email.from.name.toLowerCase().includes(query) ||
      email.from.email.toLowerCase().includes(query) ||
      email.snippet.toLowerCase().includes(query)
    )
  })

  const handleEmailClick = (email: typeof emails[0]) => {
    setSelectedEmail(email)
    if (!email.isRead) {
      markAsRead(email.id)
    }
  }

  const handleBack = () => {
    setSelectedEmail(null)
  }

  const handleToggleStar = (emailId: string) => {
    toggleStar(emailId)
  }

  const handleArchive = () => {
    if (selectedEmail) {
      archiveEmail(selectedEmail.id)
      alert('Email archived!')
    }
  }

  const handleDelete = () => {
    if (selectedEmail) {
      if (confirm('Are you sure you want to delete this email?')) {
        deleteEmail(selectedEmail.id)
        alert('Email deleted!')
      }
    }
  }

  const handleCompose = () => {
    setComposeMode('compose')
    setComposePrefill(undefined)
    setIsComposeOpen(true)
  }

  const handleAddAccount = () => {
    router.push('/login')
  }

  const handleReply = () => {
    if (selectedEmail) {
      setComposeMode('reply')
      setComposePrefill({
        to: selectedEmail.from.email,
        subject: `Re: ${selectedEmail.subject}`,
        body: `\n\n---\nOn ${selectedEmail.receivedAt.toLocaleString()}, ${selectedEmail.from.name} wrote:\n> ${selectedEmail.body.split('\n').join('\n> ')}`,
      })
      setIsComposeOpen(true)
    }
  }

  const handleForward = () => {
    if (selectedEmail) {
      setComposeMode('forward')
      setComposePrefill({
        subject: `Fwd: ${selectedEmail.subject}`,
        body: `\n\n---\nForwarded message:\nFrom: ${selectedEmail.from.name} <${selectedEmail.from.email}>\nDate: ${selectedEmail.receivedAt.toLocaleString()}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`,
      })
      setIsComposeOpen(true)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Inbox</h1>
          </div>
          {searchQuery && !isSearchOpen && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredEmails.length} result{filteredEmails.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="sm:hidden">
            {isSearchOpen ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                  className="cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                className="cursor-pointer"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="relative hidden sm:block">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-text bg-gray-50"
            />
          </div>
          <Button 
            onClick={handleCompose} 
            className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Compose</span>
          </Button>
          <AccountSwitcher onAddAccount={handleAddAccount} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className={`${selectedEmail ? 'hidden md:block' : 'block'} w-full md:w-96 border-r bg-white overflow-y-auto`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading emails...</div>
            </div>
          ) : (
            <div>
              {filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <div className="text-lg text-gray-600 mb-2">No emails found</div>
                  <div className="text-sm text-gray-500">
                    Try adjusting your search query
                  </div>
                </div>
              ) : (
                <div>
                  {filteredEmails.map((email) => (
                    <EmailListItem
                      key={email.id}
                      email={email}
                      isSelected={selectedEmail?.id === email.id}
                      onClick={() => handleEmailClick(email)}
                      onToggleStar={() => handleToggleStar(email.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`${selectedEmail ? 'block' : 'hidden md:block'} flex-1`}>
          {selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onBack={handleBack}
              onToggleStar={() => handleToggleStar(selectedEmail.id)}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onReply={handleReply}
              onForward={handleForward}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <div className="text-lg">Select an email to read</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        mode={composeMode}
        prefill={composePrefill}
      />
    </div>
  )
}
