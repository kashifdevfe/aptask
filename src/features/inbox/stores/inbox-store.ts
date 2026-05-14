import { create } from 'zustand'
import type { Email } from '@/types/email'
import { mockEmails } from '@/lib/mock-data'

interface InboxState {
  emails: Email[]
  selectedEmail: Email | null
  isLoading: boolean
  setEmails: (emails: Email[]) => void
  setSelectedEmail: (email: Email | null) => void
  setLoading: (loading: boolean) => void
  markAsRead: (emailId: string) => void
  markAsUnread: (emailId: string) => void
  toggleStar: (emailId: string) => void
  archiveEmail: (emailId: string) => void
  deleteEmail: (emailId: string) => void
  loadMockData: () => void
}

export const useInboxStore = create<InboxState>((set) => ({
  emails: [],
  selectedEmail: null,
  isLoading: false,
  setEmails: (emails) => set({ emails }),
  setSelectedEmail: (email) => set({ selectedEmail: email }),
  setLoading: (loading) => set({ isLoading: loading }),
  markAsRead: (emailId) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === emailId ? { ...email, isRead: true } : email
      ),
    })),
  markAsUnread: (emailId) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === emailId ? { ...email, isRead: false } : email
      ),
    })),
  toggleStar: (emailId) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      ),
    })),
  archiveEmail: (emailId) =>
    set((state) => {
      const wasSelected = state.selectedEmail?.id === emailId
      return {
        emails: state.emails.filter((email) => email.id !== emailId),
        selectedEmail: wasSelected ? null : state.selectedEmail,
      }
    }),
  deleteEmail: (emailId) =>
    set((state) => {
      const wasSelected = state.selectedEmail?.id === emailId
      return {
        emails: state.emails.filter((email) => email.id !== emailId),
        selectedEmail: wasSelected ? null : state.selectedEmail,
      }
    }),
  loadMockData: () => {
    set({ isLoading: true })
    setTimeout(() => {
      set({ emails: mockEmails, isLoading: false })
    }, 500)
  },
}))
