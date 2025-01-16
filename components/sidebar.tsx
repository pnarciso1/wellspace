"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, FileText, Activity, Video, MessageSquare, Users, Activity as HealthTracks } from "lucide-react"

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Medical Records', href: '/medical-records', icon: FileText },
  { name: 'Health Profile', href: '/health-profile', icon: Activity },
  { name: 'Health Tracks', href: '/health-tracks', icon: HealthTracks },
  { name: 'Videos', href: '/videos', icon: Video },
  { name: 'AI Chat', href: '/chat', icon: MessageSquare },
  { name: 'Community', href: '/community', icon: Users }
]

export function Sidebar() {
  console.log("lowercase sidebar component rendered");
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-4">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors",
              isActive && "text-white bg-white/10"
            )}
          >
            <Icon className="w-5 h-5" />
            {item.name}
          </Link>
        )
      })}
    </div>
  )
} 
