import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { QueryProvider } from '@/components/providers/query-provider'
import { MainLayout } from '@/components/layout'
import { AuthProvider } from '@/contexts/auth.context'
import { Toaster } from 'sonner'

import './globals.css'
import React from 'react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Url Shortener',
  description: 'Shorten your URLs easily and efficiently',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
