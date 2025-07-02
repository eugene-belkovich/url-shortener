'use client'

import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {useAuth} from '@/contexts/auth.context'
import {ROUTES} from '@/lib/constants'

export const Header = () => {
  const {isAuthenticated, user, logout} = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">Url Shortener</h1>
          </Link>

          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <>
                <span className="text-sm text-gray-600">Welcome, {user?.email}</span>
              </>
            )}
            <Button variant="outline" asChild>
              <Link href={ROUTES.HOME}>Home</Link>
            </Button>
            {isAuthenticated ? (
              <>
                <Button variant="outline" asChild>
                  <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href={ROUTES.SIGNIN}>Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href={ROUTES.SIGNUP}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
