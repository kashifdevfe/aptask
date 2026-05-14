'use client'

import { Star, StarOff } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Email } from '@/types/email'

interface EmailListItemProps {
  email: Email
  isSelected: boolean
  onClick: () => void
  onToggleStar: () => void
}

export function EmailListItem({
  email,
  isSelected,
  onClick,
  onToggleStar,
}: EmailListItemProps) {
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

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getLabelColor = (label: string) => {
    const colors: Record<string, string> = {
      Work: 'bg-blue-50 text-blue-700',
      Personal: 'bg-green-50 text-green-700',
      Important: 'bg-red-50 text-red-700',
      Social: 'bg-purple-50 text-purple-700',
      Updates: 'bg-orange-50 text-orange-700',
    }
    return colors[label] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start p-4 sm:p-5 border-b border-gray-100 cursor-pointer transition-all duration-200 group',
        isSelected 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500' 
          : 'hover:bg-gray-50 hover:border-l-4 hover:border-l-gray-200',
        !email.isRead && 'bg-white'
      )}
    >
      <div className="mr-3 sm:mr-4 flex-shrink-0">
        <Avatar className="h-10 w-10 sm:h-11 sm:w-11 ring-2 ring-transparent group-hover:ring-blue-200 transition-all">
          <AvatarFallback className={getAvatarColor(email.from.name)}>
            {getInitials(email.from.name)}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {!email.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
            )}
            <span className={cn(
              'text-sm sm:text-base truncate',
              !email.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
            )}>
              {email.from.name}
            </span>
            {email.priority !== 'low' && (
              <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full border flex-shrink-0',
                getPriorityColor(email.priority)
              )}>
                {email.priority}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">
            {formatDate(email.receivedAt)}
          </span>
        </div>
        
        <div className={cn(
          'text-sm mb-1.5 truncate',
          !email.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
        )}>
          {email.subject}
        </div>
        
        <div className="text-sm text-gray-500 truncate line-clamp-1">
          {email.snippet}
        </div>
        
        {email.labels.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {email.labels.slice(0, 2).map((label) => (
              <span
                key={label}
                className={cn(
                  'px-2.5 py-0.5 text-xs font-medium rounded-full',
                  getLabelColor(label)
                )}
              >
                {label}
              </span>
            ))}
            {email.labels.length > 2 && (
              <span className="px-2 py-0.5 text-xs text-gray-500">
                +{email.labels.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleStar()
        }}
        className="ml-2 flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
      >
        {email.isStarred ? (
          <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
        ) : (
          <StarOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-yellow-400" />
        )}
      </button>
    </div>
  )
}
