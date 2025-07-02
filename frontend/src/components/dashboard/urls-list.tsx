'use client'

import {useState} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {UrlService} from '@/services/url.service'
import {UrlCard} from './url-card'
import {Url} from '@/types/api'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Search, RefreshCw} from 'lucide-react'
import {toast} from 'sonner'

export const UrlsList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const {
    data: urlsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['urls'],
    queryFn: UrlService.getUrls,
  })

  const filteredUrls =
    urlsData?.urls?.filter(
      url =>
        url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? []

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEdit = (url: Url) => {
    toast.info('Edit functionality coming soon!')
  }

  const handleRefresh = () => {
    refetch()
    toast.success('URLs refreshed!')
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your URLs</h2>
          <Button variant="outline" disabled>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-lg border bg-white p-6">
                <div className="space-y-3">
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                  <div className="h-3 w-1/4 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your URLs</h2>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <div className="py-8 text-center">
          <p className="mb-4 text-red-600">Failed to load URLs</p>
          <Button variant="outline" onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const totalUrls = urlsData?.total ?? 0
  const hasUrls = filteredUrls.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Your URLs</h2>
          <p className="text-sm text-gray-600">{totalUrls === 0 ? 'No URLs created yet' : `${totalUrls} URL${totalUrls === 1 ? '' : 's'} total`}</p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {totalUrls > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search URLs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      )}

      {totalUrls === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">No URLs yet</h3>
          <p className="mb-4 text-gray-600">Start by creating your first shortened URL using the form above.</p>
        </div>
      ) : !hasUrls && searchTerm ? (
        <div className="py-8 text-center">
          <p className="text-gray-600">No URLs match your search.</p>
          <Button variant="ghost" onClick={() => setSearchTerm('')} className="mt-2">
            Clear search
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUrls.map(url => (
            <UrlCard key={url.id} url={url} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
