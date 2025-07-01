'use client'

import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mb-4 text-6xl font-bold text-gray-300">404</div>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>The page you&apos;re looking for doesn&apos;t exist or has been moved.</CardDescription>
          <CardDescription>Short link is broken. Please contact support.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-4 text-4xl">🔍</div>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
