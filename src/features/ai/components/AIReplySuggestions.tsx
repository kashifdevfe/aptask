'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { useInboxStore } from '@/features/inbox/stores/inbox-store'
import { useAIStore } from '@/features/ai/stores/ai-store'
import { useComposeStore } from '@/features/compose/stores/compose-store'

interface AIReplySuggestionsProps {
  emailId: string
}

export function AIReplySuggestions({ emailId }: AIReplySuggestionsProps) {
  const { emails } = useInboxStore()
  const { generateReplySuggestions, isLoading, useMockAI } = useAIStore()
  const { openCompose } = useComposeStore()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)

  const email = emails.find(e => e.id === emailId)

  useEffect(() => {
    if (email && !hasGenerated) {
      const generate = async () => {
        const result = await generateReplySuggestions(
          email.subject,
          email.body,
          email.from.name
        )
        setSuggestions(result)
        setHasGenerated(true)
      }
      generate()
    }
  }, [email, hasGenerated, generateReplySuggestions])

  const handleSuggestionClick = (suggestion: string) => {
    if (email) {
      openCompose('reply', email, suggestion)
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-green-600" />
        <span className="font-semibold text-gray-900">AI Reply Suggestions</span>
        {isLoading && (
          <div className="flex items-center gap-1 ml-2">
            <Loader2 className="h-3 w-3 text-green-600 animate-spin" />
            <span className="text-xs text-green-700">
              {useMockAI ? 'Simulating' : 'Generating'}...
            </span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors text-sm text-gray-700 cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
