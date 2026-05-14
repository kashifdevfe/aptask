import { create } from 'zustand'
import { aiService } from '@/lib/ai/anthropic-service'

interface AIState {
  isLoading: boolean
  hasApiKey: boolean
  useMockAI: boolean
  error: string | null
  
  checkApiKey: () => void
  toggleMockAI: () => void
  summarizeEmail: (subject: string, body: string) => Promise<string>
  generateReplySuggestions: (subject: string, body: string, senderName: string) => Promise<string[]>
  classifyPriority: (subject: string, body: string, sender: string) => Promise<'high' | 'medium' | 'low'>
}

export const useAIStore = create<AIState>((set, get) => ({
  isLoading: false,
  hasApiKey: false,
  useMockAI: true,
  error: null,

  checkApiKey: () => {
    const hasKey = !!process.env.ANTHROPIC_API_KEY
    set({ hasApiKey: hasKey, useMockAI: !hasKey })
  },

  toggleMockAI: () => {
    set(state => ({ useMockAI: !state.useMockAI }))
  },

  summarizeEmail: async (subject: string, body: string) => {
    const { useMockAI } = get()
    
    set({ isLoading: true, error: null })
    
    try {
      if (useMockAI) {
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const summaries = [
          `This email discusses ${subject.toLowerCase()}. The sender outlines key points and requests follow-up on the main topics discussed.`,
          `Important update regarding ${subject}. The message contains details about next steps and asks for confirmation on the proposed plan.`,
          `This is a follow-up about ${subject}. The sender provides additional context and requests your input on the matter.`,
        ]
        
        return summaries[Math.floor(Math.random() * summaries.length)]
      }
      
      return await aiService.summarizeEmail(subject, body)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to summarize email'
      set({ error: errorMessage })
      
      const summaries = [
        `This email is about "${subject}".`,
      ]
      return summaries[0]
    } finally {
      set({ isLoading: false })
    }
  },

  generateReplySuggestions: async (subject: string, body: string, senderName: string) => {
    const { useMockAI } = get()
    
    set({ isLoading: true, error: null })
    
    try {
      if (useMockAI) {
        await new Promise(resolve => setTimeout(resolve, 700))
        
        return [
          `Thanks for reaching out, ${senderName}! I'll review this and get back to you soon with my thoughts.`,
          `Great to hear from you! Let me circle back on this after I've had a chance to review properly.`,
          `Appreciate you sending this over. I'll follow up with any questions or next steps shortly.`,
        ]
      }
      
      return await aiService.generateReplySuggestions(subject, body, senderName)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate reply suggestions'
      set({ error: errorMessage })
      
      return [
        `Thanks for your email, ${senderName}! I'll get back to you soon.`,
      ]
    } finally {
      set({ isLoading: false })
    }
  },

  classifyPriority: async (subject: string, body: string, sender: string) => {
    const { useMockAI } = get()
    
    set({ isLoading: true, error: null })
    
    try {
      if (useMockAI) {
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const urgentWords = ['urgent', 'asap', 'immediately', 'critical', 'emergency']
        const lowWords = ['newsletter', 'unsubscribe', 'promotion', 'sale']
        
        const lowerSubject = subject.toLowerCase()
        
        if (urgentWords.some(word => lowerSubject.includes(word))) return 'high'
        if (lowWords.some(word => lowerSubject.includes(word))) return 'low'
        
        const priorities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'medium', 'medium', 'low']
        return priorities[Math.floor(Math.random() * priorities.length)]
      }
      
      return await aiService.classifyPriority(subject, body, sender)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to classify priority'
      set({ error: errorMessage })
      return 'medium'
    } finally {
      set({ isLoading: false })
    }
  },
}))
