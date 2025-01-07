'use client'

import * as React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { GlobalNav } from '@/components/GlobalNav'

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex h-screen">
      {isAuthenticated && <GlobalNav />}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}





