import { create } from 'zustand'
import { Email } from '@/types/email'

interface ComposeState {
  isOpen: boolean
  mode: 'compose' | 'reply' | 'forward'
  to: string
  subject: string
  body: string
  originalEmail: Email | null

  openCompose: (
    mode?: 'compose' | 'reply' | 'forward',
    originalEmail?: Email | null,
    prefilledBody?: string
  ) => void
  closeCompose: () => void
  setTo: (to: string) => void
  setSubject: (subject: string) => void
  setBody: (body: string) => void
}

export const useComposeStore = create<ComposeState>((set) => ({
  isOpen: false,
  mode: 'compose' as const,
  to: '',
  subject: '',
  body: '',
  originalEmail: null,

  openCompose: (
    mode: 'compose' | 'reply' | 'forward' = 'compose',
    originalEmail: Email | null = null,
    prefilledBody: string = ''
  ) => {
    if (mode === 'reply' && originalEmail) {
      set({
        isOpen: true,
        mode: 'reply',
        to: originalEmail.from.email,
        subject: `Re: ${originalEmail.subject}`,
        body: prefilledBody || `\n\n---\n\nOn ${new Date(originalEmail.receivedAt).toLocaleString()}, ${originalEmail.from.name} wrote:\n${originalEmail.body}`,
        originalEmail,
      })
    } else if (mode === 'forward' && originalEmail) {
      set({
        isOpen: true,
        mode: 'forward',
        to: '',
        subject: `Fwd: ${originalEmail.subject}`,
        body: prefilledBody || `\n\n---\n\nForwarded message:\nFrom: ${originalEmail.from.name} <${originalEmail.from.email}>\nDate: ${new Date(originalEmail.receivedAt).toLocaleString()}\nSubject: ${originalEmail.subject}\n\n${originalEmail.body}`,
        originalEmail,
      })
    } else {
      set({
        isOpen: true,
        mode: 'compose',
        to: '',
        subject: '',
        body: prefilledBody || '',
        originalEmail: null,
      })
    }
  },

  closeCompose: () => {
    set({
      isOpen: false,
      mode: 'compose',
      to: '',
      subject: '',
      body: '',
      originalEmail: null,
    })
  },

  setTo: (to: string) => set({ to }),
  setSubject: (subject: string) => set({ subject }),
  setBody: (body: string) => set({ body }),
}))
