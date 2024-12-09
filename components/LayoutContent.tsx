'use client'

import * as React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { GlobalNav } from '@/components/GlobalNav'
import { usePathname } from 'next/navigation'

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()

  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/verify-email'

  if (!user || !user.email_confirmed_at) {
    return (
      <div className="flex-1 overflow-y-auto w-full">
        {children}
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {!isAuthPage && <GlobalNav />}
      <main className={`flex-1 overflow-y-auto ${isAuthPage ? 'w-full' : ''}`}>
        {children}
      </main>
    </div>
  )
}





