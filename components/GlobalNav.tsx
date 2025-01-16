"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Activity,
  UserCircle,
  LogOut,
  Video
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

const links = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Medical Records', href: '/medical-records', icon: FileText },
  { name: 'Health Profile', href: '/health-profile', icon: UserCircle },
  { name: 'Health Tracks', href: '/health-tracks', icon: Activity },
  { name: 'Videos', href: '/videos', icon: Video },
  { name: 'AI Chat', href: '/ai-chat', icon: MessageSquare },
  { name: 'Community', href: '/community', icon: Users },
]

export function GlobalNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()
  
  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <nav className="w-64 min-h-screen border-r bg-white flex flex-col">
      <div className="flex-1 space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                    pathname === link.href ? "bg-gray-100 text-gray-900" : ""
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Sign Out Button */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 text-gray-500 hover:text-gray-900"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </nav>
  )
}





