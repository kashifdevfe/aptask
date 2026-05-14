'use client'

import { ArrowLeft, Star, StarOff, Reply, Forward, Archive, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AISummary } from '@/features/ai/components/AISummary'
import { AIReplySuggestions } from '@/features/ai/components/AIReplySuggestions'
import { cn } from '@/lib/utils'
import type { Email } from '@/types/email'

interface EmailDetailProps {
  email: Email
  onBack: () => void
  onToggleStar: () => void
  onArchive: () => void
  onDelete: () => void
  onReply: () => void
  onForward: () => void
}

export function EmailDetail({ 
  email, 
  onBack, 
  onToggleStar, 
  onArchive, 
  onDelete, 
  onReply, 
  onForward 
}: EmailDetailProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-green-500',
      'bg-teal-500',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const getLabelColor = (label: string) => {
    const colors: Record<string, string> = {
      Work: 'bg-blue-100 text-blue-700',
      Personal: 'bg-green-100 text-green-700',
      Important: 'bg-red-100 text-red-700',
      Social: 'bg-purple-100 text-purple-700',
      Updates: 'bg-orange-100 text-orange-700',
    }
    return colors[label] || 'bg-gray-100 text-gray-600'
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="cursor-pointer hover:bg-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900 hidden sm:block">Email</h2>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleStar} 
            className="cursor-pointer hover:bg-white"
          >
            {email.isStarred ? (
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ) : (
              <StarOff className="h-5 w-5 text-gray-500" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onArchive} 
            className="cursor-pointer hover:bg-white"
          >
            <Archive className="h-5 w-5 text-gray-500" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDelete} 
            className="cursor-pointer hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-8 py-6 sm:py-8">
          <div className="mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-tight">
              {email.subject}
            </h1>
            
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
                <AvatarFallback className={getAvatarColor(email.from.name)}>
                  {getInitials(email.from.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-base">
                      {email.from.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {email.from.email}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(email.receivedAt)}
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-500">
                  <span className="text-gray-400">To:</span> {email.to.map((t) => t.email).join(', ')}
                </div>
              </div>
            </div>
          </div>

          {email.labels.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {email.labels.map((label) => (
                <span
                  key={label}
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-full',
                    getLabelColor(label)
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-8">
            <AISummary 
              emailId={email.id}
            />

            <AIReplySuggestions emailId={email.id} />

            <div className="prose prose-sm sm:prose-base max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-100">
                {email.body}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onReply} 
            className="flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-1"
          >
            <Reply className="h-4 w-4" />
            Reply
          </Button>
          <Button 
            variant="outline" 
            onClick={onForward} 
            className="flex items-center justify-center gap-2 cursor-pointer flex-1"
          >
            <Forward className="h-4 w-4" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  )
}
