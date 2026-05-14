/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OutlookMessage {
  id: string
  conversationId: string
  subject: string
  from: { name: string; email: string }
  to: { name: string; email: string }[]
  date: Date
  snippet: string
  body: string
  isRead: boolean
  isStarred: boolean
  categories: string[]
}

export class OutlookService {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`https://graph.microsoft.com/v1.0/me${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Outlook API error: ${response.status}`)
    }

    return response.json()
  }

  async getMessages(maxResults: number = 50): Promise<OutlookMessage[]> {
    try {
      const data = await this.request<{ value: any[] }>(
        `/messages?$top=${maxResults}&$select=id,conversationId,subject,from,toRecipients,receivedDateTime,bodyPreview,isRead,hasAttachments,categories&$orderby=receivedDateTime desc`
      )

      if (!data.value) {
        return []
      }

      const messages = await Promise.all(
        data.value.map(async (msg) => this.getMessage(msg.id))
      )

      return messages.filter((msg): msg is OutlookMessage => msg !== null)
    } catch (error) {
      console.error('Error fetching Outlook messages:', error)
      return []
    }
  }

  private async getMessage(id: string): Promise<OutlookMessage | null> {
    try {
      const data = await this.request<any>(`/messages/${id}?$select=id,conversationId,subject,from,toRecipients,receivedDateTime,body,isRead,hasAttachments,categories,flag`)

      const subject = data.subject || '(No subject)'
      const from = this.parseEmailAddress(data.from)
      const to = data.toRecipients?.map((r: any) => this.parseEmailAddress(r)) || []
      const date = new Date(data.receivedDateTime)
      const snippet = data.bodyPreview || ''
      const body = data.body?.content || ''
      const isRead = data.isRead
      const isStarred = data.flag?.flagStatus === 'flagged'
      const categories = data.categories || []

      return {
        id: data.id,
        conversationId: data.conversationId,
        subject,
        from,
        to,
        date,
        snippet,
        body: this.stripHtml(body),
        isRead,
        isStarred,
        categories,
      }
    } catch (error) {
      console.error('Error fetching Outlook message:', error)
      return null
    }
  }

  private parseEmailAddress(recipient: any): { name: string; email: string } {
    if (!recipient?.emailAddress) {
      return { name: 'Unknown', email: 'unknown@example.com' }
    }
    return {
      name: recipient.emailAddress.name || recipient.emailAddress.address || '',
      email: recipient.emailAddress.address?.toLowerCase() || '',
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        isRead: true,
      }),
    })
  }

  async markAsUnread(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        isRead: false,
      }),
    })
  }

  async star(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}/flag`, {
      method: 'PATCH',
      body: JSON.stringify({
        flagStatus: 'flagged',
      }),
    })
  }

  async unstar(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}/flag`, {
      method: 'PATCH',
      body: JSON.stringify({
        flagStatus: 'notFlagged',
      }),
    })
  }

  async archive(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}/move`, {
      method: 'POST',
      body: JSON.stringify({
        destinationId: 'archive',
      }),
    })
  }

  async delete(messageId: string): Promise<void> {
    await this.request(`/messages/${messageId}`, {
      method: 'DELETE',
    })
  }

  async sendMessage(to: string, subject: string, body: string): Promise<void> {
    await this.request('/sendMail', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          subject: subject,
          body: {
            contentType: 'Text',
            content: body,
          },
          toRecipients: [
            {
              emailAddress: {
                address: to,
              },
            },
          ],
        },
      }),
    })
  }
}
