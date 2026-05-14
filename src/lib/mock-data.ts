import type { Email } from '@/types/email'

export const mockEmails: Email[] = [
  {
    id: '1',
    threadId: 'thread-1',
    accountId: 'acc-1',
    from: { name: 'Sarah Johnson', email: 'sarah.j@company.com' },
    to: [{ name: 'You', email: 'you@company.com' }],
    subject: 'Q4 Marketing Strategy Review',
    body: `Hi there,

I wanted to share our Q4 marketing strategy for your review. We've made some significant changes based on the last quarter's performance.

Key highlights:
- Increased social media budget by 25%
- New influencer partnership program
- Enhanced SEO targeting
- Email marketing automation upgrade

Would love to get your feedback before we finalize this. Let's schedule a call for tomorrow if possible.

Best regards,
Sarah Johnson
Marketing Director`,
    snippet: 'I wanted to share our Q4 marketing strategy for your review...',
    isRead: false,
    isStarred: true,
    priority: 'high',
    labels: ['Work', 'Important'],
    receivedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    threadId: 'thread-2',
    accountId: 'acc-1',
    from: { name: 'GitHub', email: 'noreply@github.com' },
    to: [{ name: 'You', email: 'you@company.com' }],
    subject: '[aptask] Pull Request #42: Add AI summarization feature',
    body: `@dev-user opened a pull request:

Add AI summarization feature

This PR implements the AI summarization feature for emails, including:
- Claude API integration
- Summary generation UI
- Caching mechanism
- Error handling

Please review when you get a chance!`,
    snippet: '@dev-user opened a pull request: Add AI summarization feature...',
    isRead: true,
    isStarred: false,
    priority: 'medium',
    labels: ['GitHub', 'Development'],
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '3',
    threadId: 'thread-3',
    accountId: 'acc-2',
    from: { name: 'Amazon', email: 'ship-confirm@amazon.com' },
    to: [{ name: 'You', email: 'personal@email.com' }],
    subject: 'Your Amazon order has shipped!',
    body: `Hello,

Great news! Your order #123-4567890-1234567 has shipped and is on its way.

Estimated delivery: December 20-22

Order summary:
- Wireless Headphones: $199.99
- Phone Case: $29.99
- Shipping: FREE

Thank you for shopping with Amazon!`,
    snippet: 'Great news! Your order has shipped and is on its way...',
    isRead: true,
    isStarred: false,
    priority: 'low',
    labels: ['Personal', 'Shopping'],
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: '4',
    threadId: 'thread-4',
    accountId: 'acc-1',
    from: { name: 'Michael Chen', email: 'michael.c@company.com' },
    to: [{ name: 'You', email: 'you@company.com' }],
    subject: 'Team Lunch Tomorrow',
    body: `Hey team,

Just a reminder that we're having our monthly team lunch tomorrow at 12:30 PM in the main cafeteria.

Please let me know if you have any dietary restrictions I should know about!

Looking forward to seeing everyone there.

Best,
Michael`,
    snippet: 'Just a reminder that we\'re having our monthly team lunch tomorrow...',
    isRead: false,
    isStarred: false,
    priority: 'medium',
    labels: ['Work', 'Team'],
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '5',
    threadId: 'thread-5',
    accountId: 'acc-2',
    from: { name: 'Netflix', email: 'info@netflix.com' },
    to: [{ name: 'You', email: 'personal@email.com' }],
    subject: 'New on Netflix: Your weekly recommendations',
    body: `Hi there!

Here are your weekly Netflix recommendations based on what you've been watching:

1. The Crown - Final Season
2. Squid Game: The Challenge
3. Leave the World Behind
4. The Killer
5. Wednesday

Enjoy your weekend!`,
    snippet: 'Here are your weekly Netflix recommendations based on what you\'ve been watching...',
    isRead: true,
    isStarred: false,
    priority: 'low',
    labels: ['Personal', 'Entertainment'],
    receivedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
]
