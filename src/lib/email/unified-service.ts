import { GmailService, GmailMessage } from './gmail-service'
import { OutlookService, OutlookMessage } from './outlook-service'

export interface UnifiedEmail {
  id: string
  threadId: string
  subject: string
  from: { name: string; email: string }
  to: { name: string; email: string }[]
  receivedAt: Date
  snippet: string
  body: string
  isRead: boolean
  isStarred: boolean
  labels: string[]
  priority: 'high' | 'medium' | 'low'
}

export class UnifiedEmailService {
  private gmailService?: GmailService
  private outlookService?: OutlookService
  private provider: 'gmail' | 'office365' | 'imap'

  constructor(provider: 'gmail' | 'office365' | 'imap', accessToken?: string) {
    this.provider = provider
    
    if (accessToken) {
      if (provider === 'gmail') {
        this.gmailService = new GmailService(accessToken)
      } else if (provider === 'office365') {
        this.outlookService = new OutlookService(accessToken)
      }
    }
  }

  private getPriority(labels: string[]): 'high' | 'medium' | 'low' {
    const highPriorityLabels = ['important', 'starred', 'priority']
    const hasHighPriority = labels.some(label => 
      highPriorityLabels.some(hl => label.toLowerCase().includes(hl))
    )
    
    if (hasHighPriority) return 'high'
    return 'medium'
  }

  private convertGmailMessage(msg: GmailMessage): UnifiedEmail {
    return {
      id: msg.id,
      threadId: msg.threadId,
      subject: msg.subject,
      from: msg.from,
      to: msg.to,
      receivedAt: msg.date,
      snippet: msg.snippet,
      body: msg.body,
      isRead: msg.isRead,
      isStarred: msg.isStarred,
      labels: msg.labels,
      priority: this.getPriority(msg.labels),
    }
  }

  private convertOutlookMessage(msg: OutlookMessage): UnifiedEmail {
    return {
      id: msg.id,
      threadId: msg.conversationId,
      subject: msg.subject,
      from: msg.from,
      to: msg.to,
      receivedAt: msg.date,
      snippet: msg.snippet,
      body: msg.body,
      isRead: msg.isRead,
      isStarred: msg.isStarred,
      labels: msg.categories,
      priority: this.getPriority(msg.categories),
    }
  }

  async getEmails(maxResults: number = 50): Promise<UnifiedEmail[]> {
    if (this.provider === 'gmail' && this.gmailService) {
      const messages = await this.gmailService.getMessages(maxResults)
      return messages.map(this.convertGmailMessage.bind(this))
    } else if (this.provider === 'office365' && this.outlookService) {
      const messages = await this.outlookService.getMessages(maxResults)
      return messages.map(this.convertOutlookMessage.bind(this))
    }
    
    return this.getDemoEmails()
  }

  async markAsRead(emailId: string): Promise<void> {
    if (this.provider === 'gmail' && this.gmailService) {
      await this.gmailService.markAsRead(emailId)
    } else if (this.provider === 'office365' && this.outlookService) {
      await this.outlookService.markAsRead(emailId)
    }
  }

  async markAsUnread(emailId: string): Promise<void> {
    if (this.provider === 'gmail' && this.gmailService) {
      await this.gmailService.markAsUnread(emailId)
    } else if (this.provider === 'office365' && this.outlookService) {
      await this.outlookService.markAsUnread(emailId)
    }
  }

  async star(emailId: string): Promise<void> {
    if (this.provider === 'gmail' && this.gmailService) {
      await this.gmailService.star(emailId)
    } else if (this.provider === 'office365' && this.outlookService) {
      await this.outlookService.star(emailId)
    }
  }

  async unstar(emailId: string): Promise<void> {
    if (this.provider === 'gmail' && this.gmailService) {
      await this.gmailService.unstar(emailId)
    } else if (this.provider === 'office365' && this.outlookService) {
      await this.outlookService.unstar(emailId)
    }
  }

  async archive(emailId: string): Promise<void> {
    if (this.provider === 'gmail' && this.gmailService) {
      await this.gmailService.archive(emailId)
    } else if (this.provider === 'office365' && this.outlookService) {
      await this.outlookService.archive(emailId)
    }
  }

  async delete(emailId: string): Promise<void> {
    if (this.provider === 'gmail' && this.gmailService) {
      await this.gmailService.delete(emailId)
    } else if (this.provider === 'office365' && this.outlookService) {
      await this.outlookService.delete(emailId)
    }
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    if (this.provider === 'gmail' && this.gmailService) {
      await this.gmailService.sendMessage(to, subject, body)
    } else if (this.provider === 'office365' && this.outlookService) {
      await this.outlookService.sendMessage(to, subject, body)
    }
  }

  private getDemoEmails(): UnifiedEmail[] {
    return [
      {
        id: 'demo-1',
        threadId: 'demo-thread-1',
        subject: 'Welcome to APTASK!',
        from: { name: 'APTASK Team', email: 'team@aptask.ai' },
        to: [{ name: 'You', email: 'you@example.com' }],
        receivedAt: new Date(Date.now() - 1000 * 60 * 30),
        snippet: 'Welcome to your new AI-first email client! Here are some features you should check out...',
        body: `Welcome to APTASK! 🎉

We're excited to have you on board. Here's what you can do:

✨ AI Summaries - Get intelligent summaries of your emails
💬 Reply Suggestions - AI-generated reply drafts
🚀 Smart Inbox - Prioritized emails based on importance
🔍 Semantic Search - Find emails by meaning, not just keywords

This is a demo account showing all features. To connect your real Gmail or Office 365 account, log out and switch to "Real OAuth" mode.

Enjoy!
The APTASK Team`,
        isRead: false,
        isStarred: true,
        labels: ['Important', 'Welcome'],
        priority: 'high',
      },
      {
        id: 'demo-2',
        threadId: 'demo-thread-2',
        subject: 'Q4 Marketing Report',
        from: { name: 'Sarah Chen', email: 'sarah.chen@company.com' },
        to: [{ name: 'You', email: 'you@example.com' }],
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        snippet: 'Hi, I wanted to share the Q4 marketing report with you. The numbers are looking great...',
        body: `Hi,

I wanted to share the Q4 marketing report with you. The numbers are looking great this quarter!

Key highlights:
- 25% increase in user engagement
- 18% growth in email open rates
- New campaign exceeded targets by 32%

Let's schedule a meeting next week to discuss the strategy for Q1.

Best,
Sarah

Marketing Director`,
        isRead: true,
        isStarred: false,
        labels: ['Work'],
        priority: 'high',
      },
      {
        id: 'demo-3',
        threadId: 'demo-thread-3',
        subject: 'Your order has shipped!',
        from: { name: 'Online Store', email: 'orders@onlinestore.com' },
        to: [{ name: 'You', email: 'you@example.com' }],
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        snippet: 'Great news! Your order #12345 has shipped and is on its way to you...',
        body: `Great news! Your order #12345 has shipped and is on its way to you!

Order Details:
- Order Number: #12345
- Shipping Address: 123 Main St, City, State 12345
- Estimated Delivery: 3-5 business days

Track your package: [Tracking Link]

Thank you for your purchase!

The Online Store Team`,
        isRead: true,
        isStarred: false,
        labels: ['Updates'],
        priority: 'medium',
      },
      {
        id: 'demo-4',
        threadId: 'demo-thread-4',
        subject: 'Dinner plans this weekend?',
        from: { name: 'Alex Johnson', email: 'alex.johnson@gmail.com' },
        to: [{ name: 'You', email: 'you@example.com' }],
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        snippet: 'Hey! Want to grab dinner this weekend? I heard about a great new Italian place...',
        body: `Hey!

Want to grab dinner this weekend? I heard about a great new Italian place downtown that just opened.

How about Saturday at 7pm? They have amazing pasta and wine. Let me know if that works for you!

Looking forward to catching up,
Alex`,
        isRead: false,
        isStarred: true,
        labels: ['Personal', 'Social'],
        priority: 'medium',
      },
      {
        id: 'demo-5',
        threadId: 'demo-thread-5',
        subject: 'Newsletter: AI Trends 2025',
        from: { name: 'AI Weekly', email: 'newsletter@aiweekly.com' },
        to: [{ name: 'You', email: 'you@example.com' }],
        receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        snippet: 'This week in AI: New breakthroughs in language models, computer vision, and autonomous systems...',
        body: `This week in AI:

Top Stories:
1. New breakthroughs in large language models
2. Advances in computer vision for healthcare
3. Autonomous systems making progress
4. AI ethics and regulation updates

Read more on our website.

---
You're receiving this because you subscribed to AI Weekly.
Unsubscribe: [Link]`,
        isRead: true,
        isStarred: false,
        labels: ['Updates'],
        priority: 'low',
      },
    ]
  }
}
