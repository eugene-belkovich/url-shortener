'use client'

import React from 'react'
import {Card, CardContent} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Copy, ExternalLink, Edit2, Trash2, MoreHorizontal} from 'lucide-react'
import {Url} from '@/types/api'
import {toast} from 'sonner'
import {format} from 'date-fns'

interface UrlCardProps {
  url: Url
  onEdit?: (url: Url) => void
  onDelete?: (url: Url) => void
}

export const UrlCard = ({url, onEdit, onDelete}: UrlCardProps) => {
  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy')
    }
  }

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="truncate font-medium text-blue-600">{url.shortUrl}</div>
              <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(url.shortUrl)} className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <span className="truncate text-sm text-gray-600">{url.originalUrl}</span>
              <Button variant="ghost" size="sm" onClick={() => handleOpenUrl(url.originalUrl)} className="h-6 w-6 p-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="font-medium">{url.clickCount || 0}</span>
                <span>clicks</span>
              </span>
              <span>Created {format(new Date(url.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
