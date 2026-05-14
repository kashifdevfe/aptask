'use client'

import { Sparkles } from 'lucide-react'

interface AISummaryProps {
  emailId: string
}

export function AISummary({ emailId }: AISummaryProps) {
  const mockSummaries: Record<string, string> = {
    '1': `This email from Sarah Johnson discusses the Q4 marketing strategy review. Key points include a 25% increase in social media budget, a new influencer partnership program, enhanced SEO targeting, and an email marketing automation upgrade. Sarah is requesting feedback and wants to schedule a call tomorrow.`,
    '2': `A pull request has been opened by @dev-user to add AI summarization features. The PR includes Claude API integration, summary generation UI, caching mechanism, and error handling.`,
    '3': `Your Amazon order #123-4567890-1234567 has shipped. Estimated delivery is December 20-22. The order includes Wireless Headphones ($199.99) and a Phone Case ($29.99) with free shipping.`,
    '4': `Michael Chen is reminding the team about the monthly team lunch tomorrow at 12:30 PM in the main cafeteria. He's asking about any dietary restrictions.`,
    '5': `Netflix weekly recommendations based on your viewing history: The Crown (Final Season), Squid Game: The Challenge, Leave the World Behind, The Killer, and Wednesday.`,
  }

  const summary = mockSummaries[emailId] || 'AI summary not available for this email.'

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-blue-900">AI Summary</span>
      </div>
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </div>
  )
}
