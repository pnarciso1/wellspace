"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'
import { Home, MessageCircle, Users, Activity, FileText, Settings, LogOut, UserCircle } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/ai-chat', label: 'AI Chat', icon: MessageCircle },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/health-tracks', label: 'Health Tracks', icon: Activity },
  { href: '/medical-records', label: 'Medical Records', icon: FileText },
  { href: '/health-profile', label: 'Health Profile', icon: UserCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function GlobalNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className="flex flex-col h-full bg-gray-100 w-64 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Wellspace</h1>
      </div>
      <ul className="space-y-2 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`flex items-center p-2 rounded-lg ${
                  pathname === item.href 
                    ? 'bg-gray-200 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="mr-2 h-5 w-5" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
      {user && (
        <div className="mt-auto">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center" 
            onClick={handleSignOut}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </Button>
        </div>
      )}
    </nav>
  )
}





