export interface Email {
  id: string
  threadId: string
  accountId: string
  from: {
    name: string
    email: string
  }
  to: Array<{
    name: string
    email: string
  }>
  cc?: Array<{
    name: string
    email: string
  }>
  subject: string
  body: string
  snippet: string
  isRead: boolean
  isStarred: boolean
  priority: 'high' | 'medium' | 'low'
  labels: string[]
  receivedAt: Date
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  filename: string
  mimeType: string
  size: number
  url?: string
}

export interface EmailAccount {
  id: string
  provider: 'gmail' | 'office365' | 'imap'
  email: string
  name: string
  isActive: boolean
}
