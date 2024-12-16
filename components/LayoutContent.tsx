'use client'

import * as React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { GlobalNav } from '@/components/GlobalNav'
import { usePathname } from 'next/navigation'

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, showSidebar } = useAuth()
  const pathname = usePathname() || ''

  const isAuthPage = 
    pathname === '/login' || 
    pathname.startsWith('/signup') || 
    pathname === '/verify-email' ||
    !user ||
    !user.email_confirmed_at

  if (isAuthPage) {
    return (
      <div className="flex-1 overflow-y-auto w-full">
        {children}
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {showSidebar && (
        <div className="flex-shrink-0 h-full">
          <GlobalNav />
        </div>
      )}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}





