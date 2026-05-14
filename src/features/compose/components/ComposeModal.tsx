'use client'

import { X, Send, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ComposeModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'compose' | 'reply' | 'forward'
  prefill?: {
    to?: string
    subject?: string
    body?: string
  }
}

export function ComposeModal({ isOpen, onClose, mode = 'compose', prefill }: ComposeModalProps) {
  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`${mode === 'compose' ? 'Email sent!' : mode === 'reply' ? 'Reply sent!' : 'Forward sent!'}`)
    onClose()
  }

  const getTitle = () => {
    switch (mode) {
      case 'reply':
        return 'Reply'
      case 'forward':
        return 'Forward'
      default:
        return 'New Message'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-3xl sm:rounded-2xl shadow-2xl max-h-[100vh] sm:max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h2 className="text-lg font-semibold text-white">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg cursor-pointer transition-colors text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-5 sm:p-6 space-y-4 flex-shrink-0 bg-gray-50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">To</label>
              <input
                type="email"
                defaultValue={prefill?.to}
                placeholder="recipient@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white cursor-text"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
              <input
                type="text"
                defaultValue={prefill?.subject}
                placeholder="Subject"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white cursor-text"
                required
              />
            </div>
          </div>

          <div className="flex-1 p-5 sm:p-6 bg-white">
            <textarea
              defaultValue={prefill?.body}
              placeholder="Write your message..."
              className="w-full h-full px-0 py-0 border-0 rounded-none focus:outline-none focus:ring-0 resize-none text-gray-800 leading-relaxed text-base cursor-text"
              required
            />
          </div>

          <div className="p-5 sm:p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <Button 
              type="button" 
              variant="ghost" 
              className="text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attach
            </Button>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="cursor-pointer"
              >
                Discard
              </Button>
              <Button 
                type="submit" 
                className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
