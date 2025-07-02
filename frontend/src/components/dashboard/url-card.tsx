'use client'

import React, {useState} from 'react'
import {Card, CardContent} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Copy, ExternalLink, Edit2, Check, X} from 'lucide-react'
import {Url} from '@/types/api'
import {toast} from 'sonner'
import {format} from 'date-fns'
import {isValidUrl} from '@/utils'
import {useRouter} from 'next/navigation'

interface UrlCardProps {
  url: Url
  onEdit?: (slug: string, newSlug: string) => void
}

export const UrlCard = ({url, onEdit}: UrlCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editSlug, setEditSlug] = useState(url.slug)
  const router = useRouter()

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy')
    }
  }

  const handleRedirect = (url: string) => {
    if (url && isValidUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      toast.error('Invalid short URL received')
      router.push('/not-found')
    }
  }

  const handleStartEdit = () => {
    setIsEditing(true)
    setEditSlug(url.slug)
  }

  const handleSaveEdit = () => {
    if (editSlug.trim() === '') {
      toast.error('Slug cannot be empty')
      return
    }
    if (editSlug === url.slug) {
      setIsEditing(false)
      return
    }
    onEdit?.(url.slug, editSlug.trim())
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditSlug(url.slug)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              {isEditing ? (
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-sm text-gray-500">{window.location.origin}/</span>
                  <Input value={editSlug} onChange={e => setEditSlug(e.target.value)} onKeyDown={handleKeyDown} className="h-7 text-sm font-medium text-blue-600" autoFocus />
                  <Button variant="ghost" size="sm" onClick={handleSaveEdit} className="h-6 w-6 p-0 text-green-600 hover:text-green-700">
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-6 w-6 p-0 text-red-600 hover:text-red-700">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <>
                  <a className="truncate font-medium text-blue-600 hover:underline dark:text-blue-800" onClick={() => handleRedirect(url.shortUrl)}>
                    {url.shortUrl}
                  </a>
                  <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(url.shortUrl)} className="h-6 w-6 p-0">
                    <Copy className="h-3 w-3" />
                  </Button>
                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={handleStartEdit} className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </>
              )}
            </div>

            <div className="mb-3 flex items-center gap-2">
              <span className="truncate text-sm text-gray-600">{url.originalUrl}</span>
              <Button variant="ghost" size="sm" onClick={() => handleRedirect(url.originalUrl)} className="h-6 w-6 p-0">
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
