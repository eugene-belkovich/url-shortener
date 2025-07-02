'use client'

import {useAuth} from '@/contexts/auth.context'
import {ProtectedRoute} from '@/components/auth/protected-route'

export default function DashboardPage() {
  const {user} = useAuth()

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user?.email}!</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Total URLs</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
              <p className="mt-1 text-sm text-gray-600">Shortened URLs created</p>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Total Clicks</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">0</p>
              <p className="mt-1 text-sm text-gray-600">Times your URLs were clicked</p>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Top Performer</h3>
              <p className="mt-2 text-lg font-semibold text-gray-900">None yet</p>
              <p className="mt-1 text-sm text-gray-600">Most clicked URL</p>
            </div>
          </div>

          <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent URLs</h2>
            <div className="text-center py-8">
              <p className="text-gray-600">No URLs created yet.</p>
              <p className="mt-2 text-sm text-gray-500">Start by creating your first shortened URL!</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 
