'use client'

import { Sparkles } from 'lucide-react'

interface AIReplySuggestionsProps {
  emailId: string
}

export function AIReplySuggestions({ emailId }: AIReplySuggestionsProps) {
  const suggestions: Record<string, string[]> = {
    '1': [
      'Thanks for sharing this, Sarah! The strategy looks solid. I\'ll review today and we can discuss tomorrow at 2 PM.',
      'Great work on the Q4 strategy! I have a few thoughts on the influencer program - can we hop on a quick call?',
      'This looks excellent. I\'ve added my comments inline. Let\'s proceed with the proposed budget increase.',
    ],
    '2': [
      'Thanks for the PR! I\'ll review it today and get back to you.',
      'Great work! Left a few minor comments, otherwise looks good to merge.',
      'Excellent implementation! Let\'s get this merged and deploy to staging.',
    ],
    '3': [
      'Thanks for the update! Looking forward to receiving the package.',
      'Excited for the delivery! Will keep an eye out for it.',
    ],
    '4': [
      'Looking forward to it! No dietary restrictions for me.',
      'Can\'t wait! Just a heads up - I\'m vegetarian.',
      'Sounds great! I should be there on time.',
    ],
    '5': [
      'Thanks for the recommendations! The Crown sounds perfect for the weekend.',
    ],
  }

  const emailSuggestions = suggestions[emailId] || [
    'Thanks for your email! I\'ll get back to you soon.',
    'Got it, thanks!',
  ]

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-green-600" />
        <span className="font-semibold text-gray-900">AI Reply Suggestions</span>
      </div>
      <div className="space-y-2">
        {emailSuggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => alert(`Reply suggestion selected! Opening composer...`)}
            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors text-sm text-gray-700 cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
