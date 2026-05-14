'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { useInboxStore } from '@/features/inbox/stores/inbox-store'
import { useAIStore } from '@/features/ai/stores/ai-store'

interface AISummaryProps {
  emailId: string
}

export function AISummary({ emailId }: AISummaryProps) {
  const { emails } = useInboxStore()
  const { summarizeEmail, isLoading, useMockAI } = useAIStore()
  const [summary, setSummary] = useState<string>('Generating summary...')
  const [hasGenerated, setHasGenerated] = useState(false)

  const email = emails.find(e => e.id === emailId)

  useEffect(() => {
    if (email && !hasGenerated) {
      const generate = async () => {
        const result = await summarizeEmail(email.subject, email.body)
        setSummary(result)
        setHasGenerated(true)
      }
      generate()
    }
  }, [email, hasGenerated, summarizeEmail])

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-blue-900">AI Summary</span>
        {isLoading && (
          <div className="flex items-center gap-1 ml-2">
            <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
            <span className="text-xs text-blue-700">
              {useMockAI ? 'Simulating' : 'Generating'}...
            </span>
          </div>
        )}
      </div>
      <p className="text-gray-700 leading-relaxed">{summary}</p>
    </div>
  )
}
