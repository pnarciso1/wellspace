'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type LayoutContextType = {
  sidebarVisible: boolean
  setSidebarVisible: (visible: boolean) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true)

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setSidebarVisible(true)  // Force sidebar to be visible when tab is active
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleVisibilityChange)
    }
  }, [])

  return (
    <LayoutContext.Provider value={{ sidebarVisible, setSidebarVisible }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}