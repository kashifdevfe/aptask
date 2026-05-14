/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GmailMessage {
  id: string
  threadId: string
  subject: string
  from: { name: string; email: string }
  to: { name: string; email: string }[]
  date: Date
  snippet: string
  body: string
  isRead: boolean
  isStarred: boolean
  labels: string[]
}

export class GmailService {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.status}`)
    }

    return response.json()
  }

  async getMessages(maxResults: number = 50): Promise<GmailMessage[]> {
    try {
      const data = await this.request<{ messages: { id: string; threadId: string }[] }>(
        `/messages?maxResults=${maxResults}&labelIds=INBOX`
      )

      if (!data.messages) {
        return []
      }

      const messages = await Promise.all(
        data.messages.map(async (msg) => this.getMessage(msg.id))
      )

      return messages.filter((msg): msg is GmailMessage => msg !== null)
    } catch (error) {
      console.error('Error fetching Gmail messages:', error)
      return []
    }
  }

  private async getMessage(id: string): Promise<GmailMessage | null> {
    try {
      const data = await this.request<any>(`/messages/${id}?format=full`)

      const headers = data.payload.headers || []
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No subject)'
      const from = this.parseEmailHeader(headers.find((h: any) => h.name === 'From')?.value || '')
      const to = this.parseEmailList(headers.find((h: any) => h.name === 'To')?.value || '')
      const date = new Date(headers.find((h: any) => h.name === 'Date')?.value || Date.now())

      const body = this.getBody(data.payload)
      const snippet = data.snippet || ''

      const isRead = !data.labelIds?.includes('UNREAD')
      const isStarred = data.labelIds?.includes('STARRED') || false
      const labels = (data.labelIds || []).filter((l: string) => 
        !['INBOX', 'UNREAD', 'STARRED'].includes(l)
      )

      return {
        id: data.id,
        threadId: data.threadId,
        subject,
        from,
        to,
        date,
        snippet,
        body,
        isRead,
        isStarred,
        labels,
      }
    } catch (error) {
      console.error('Error fetching Gmail message:', error)
      return null
    }
  }

  private parseEmailHeader(header: string): { name: string; email: string } {
    const match = header.match(/^(.*?)\s*<([^>]+)>$/)
    if (match) {
      return { name: match[1].trim(), email: match[2].toLowerCase() }
    }
    return { name: header, email: header.toLowerCase() }
  }

  private parseEmailList(header: string): { name: string; email: string }[] {
    return header.split(',').map((email) => this.parseEmailHeader(email.trim())).filter(e => e.email)
  }

  private getBody(payload: any): string {
    if (payload.parts) {
      const textPart = payload.parts.find((p: any) => p.mimeType === 'text/plain')
      if (textPart?.body?.data) {
        return Buffer.from(textPart.body.data, 'base64').toString('utf-8')
      }
      const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html')
      if (htmlPart?.body?.data) {
        return this.stripHtml(Buffer.from(htmlPart.body.data, 'base64').toString('utf-8'))
      }
    }
    if (payload.body?.data) {
      return Buffer.from(payload.body.data, 'base64').toString('utf-8')
    }
    return ''
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        removeLabelIds: ['UNREAD'],
      }),
    })
  }

  async markAsUnread(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        addLabelIds: ['UNREAD'],
      }),
    })
  }

  async star(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        addLabelIds: ['STARRED'],
      }),
    })
  }

  async unstar(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        removeLabelIds: ['STARRED'],
      }),
    })
  }

  async archive(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        removeLabelIds: ['INBOX'],
      }),
    })
  }

  async delete(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}/trash`, {
      method: 'POST',
    })
  }

  async sendMessage(to: string, subject: string, body: string): Promise<void> {
    const raw = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body,
    ].join('\n')

    const encodedRaw = Buffer.from(raw)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    await this.request('/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        raw: encodedRaw,
      }),
    })
  }
}
