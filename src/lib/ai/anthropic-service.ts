const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1'
const ANTHROPIC_VERSION = '2023-06-01'
const DEFAULT_MODEL = 'claude-3-haiku-20240307'

interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AnthropicRequest {
  model: string
  messages: AnthropicMessage[]
  max_tokens: number
  temperature?: number
  system?: string
}

interface AnthropicResponse {
  id: string
  type: 'message'
  role: 'assistant'
  content: Array<{
    type: 'text'
    text: string
  }>
  model: string
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export class AnthropicAIService {
  private apiKey: string
  private model: string

  constructor(apiKey?: string, model: string = DEFAULT_MODEL) {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || ''
    this.model = model
  }

  private async makeRequest(request: AnthropicRequest): Promise<AnthropicResponse> {
    if (!this.apiKey) {
      throw new Error('Anthropic API key is required')
    }

    const response = await fetch(`${ANTHROPIC_API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Anthropic API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async summarizeEmail(subject: string, body: string): Promise<string> {
    const systemPrompt = `You are an AI email assistant. Your job is to provide clear, concise summaries of emails.

Guidelines:
- Summarize in 2-3 sentences max
- Capture the key points and action items
- Be clear and direct
- Avoid jargon
- Use simple language`

    const userPrompt = `Please summarize this email:

Subject: ${subject}

${body}`

    try {
      const response = await this.makeRequest({
        model: this.model,
        max_tokens: 200,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      })

      return response.content[0].text
    } catch (error) {
      console.error('Error summarizing email:', error)
      return this.getFallbackSummary(subject, body)
    }
  }

  async generateReplySuggestions(
    subject: string,
    body: string,
    senderName: string
  ): Promise<string[]> {
    const systemPrompt = `You are an AI email assistant. Your job is to generate helpful reply suggestions for emails.

Guidelines:
- Generate 3 distinct reply options
- Make them realistic and professional
- Vary the tone (professional, friendly, brief)
- Each should be 1-3 sentences
- Make them actionable and relevant`

    const userPrompt = `Generate 3 reply suggestions for this email from ${senderName}:

Subject: ${subject}

${body}`

    try {
      const response = await this.makeRequest({
        model: this.model,
        max_tokens: 500,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      })

      const content = response.content[0].text
      return this.parseReplySuggestions(content)
    } catch (error) {
      console.error('Error generating reply suggestions:', error)
      return this.getFallbackReplySuggestions(senderName)
    }
  }

  async classifyPriority(subject: string, body: string, sender: string): Promise<'high' | 'medium' | 'low'> {
    const systemPrompt = `You are an AI email assistant. Your job is to classify email priority.

Classification:
- HIGH: Urgent, time-sensitive, from important contacts, requires immediate action
- MEDIUM: Important but not urgent, regular business, informational
- LOW: Newsletter, marketing, non-urgent, low priority

Respond with ONLY ONE word: high, medium, or low`

    const userPrompt = `Classify this email priority:

From: ${sender}
Subject: ${subject}

${body}`

    try {
      const response = await this.makeRequest({
        model: this.model,
        max_tokens: 10,
        temperature: 0.1,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      })

      const priority = response.content[0].text.toLowerCase().trim()
      if (priority === 'high') return 'high'
      if (priority === 'medium') return 'medium'
      return 'low'
    } catch (error) {
      console.error('Error classifying priority:', error)
      return this.getFallbackPriority(subject)
    }
  }

  private parseReplySuggestions(content: string): string[] {
    const suggestions: string[] = []
    const lines = content.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      const cleanLine = line
        .replace(/^\d+\.\s*/, '')
        .replace(/^[-*•]\s*/, '')
        .replace(/^["']|["']$/g, '')
        .trim()
      
      if (cleanLine && cleanLine.length > 10) {
        suggestions.push(cleanLine)
        if (suggestions.length >= 3) break
      }
    }
    
    return suggestions.length >= 2 ? suggestions : this.getFallbackReplySuggestions('Contact')
  }

  private getFallbackSummary(subject: string, body: string): string {
    const snippet = body.substring(0, 150)
    return `This email is about "${subject}". ${snippet}...`
  }

  private getFallbackReplySuggestions(senderName: string): string[] {
    return [
      `Thanks for reaching out, ${senderName}! I'll review this and get back to you soon.`,
      `Great to hear from you! Let me circle back on this after I've had a chance to review properly.`,
      `Appreciate you sending this over. I'll follow up with any questions or next steps.`,
    ]
  }

  private getFallbackPriority(subject: string): 'high' | 'medium' | 'low' {
    const urgentWords = ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'important']
    const lowWords = ['newsletter', 'unsubscribe', 'promotion', 'sale', 'spam', 'marketing']
    
    const lowerSubject = subject.toLowerCase()
    
    if (urgentWords.some(word => lowerSubject.includes(word))) return 'high'
    if (lowWords.some(word => lowerSubject.includes(word))) return 'low'
    
    return 'medium'
  }
}

export const aiService = new AnthropicAIService()
