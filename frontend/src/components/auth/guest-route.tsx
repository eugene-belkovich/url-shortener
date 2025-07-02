'use client'

import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {useAuth} from '@/contexts/auth.context'
import {ROUTES} from '@/lib/constants'

interface GuestRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const GuestRoute = ({children, fallback}: GuestRouteProps) => {
  const {isAuthenticated, isLoading} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(ROUTES.DASHBOARD)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      fallback || (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}
