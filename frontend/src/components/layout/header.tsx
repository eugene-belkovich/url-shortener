'use client'

import Link from 'next/link'
import {Button} from '@/components/ui/button'

export const Header = () => {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">Url Shortener</h1>
          </Link>

          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
