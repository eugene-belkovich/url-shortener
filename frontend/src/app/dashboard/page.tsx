'use client'

import {useAuth} from '@/contexts/auth.context'
import {ProtectedRoute} from '@/components/auth/protected-route'
import {CreateShortUrlForm} from '@/components/forms'
import {UrlsList} from '@/components/dashboard'

export default function DashboardPage() {
  const {user} = useAuth()

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user?.email}!</p>
          </div>

          <div>
            <CreateShortUrlForm />
          </div>

          <div>
            <UrlsList />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
