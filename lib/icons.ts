/**
 * Shared icons configuration for Wellspace
 * This file centralizes all icon imports and provides consistent naming across the application
 * Icons are imported from lucide-react and re-exported with standardized names
 */

import {
  Activity,
  Check,
  CheckCircle,
  ChevronRight,
  FileText,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Trophy,
  User,
  Users,
  Video,
  XCircle,
  Settings,
  Plus,
  X,
  ChevronLeft
} from 'lucide-react'

/**
 * Icons object containing all application icons
 * Use this for consistent icon usage across the application
 * 
 * Example usage:
 * import { Icons } from '@/lib/icons'
 * 
 * <Icons.MapPin className="h-4 w-4" />
 */
export const Icons = {
  Activity,
  Check,
  CheckCircle,
  ChevronRight,
  FileText,
  Heart,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Trophy,
  User,
  Users,
  Video,
  XCircle,
  Settings,
  Plus,
  X,
  ChevronLeft
} as const

/**
 * Type definition for icon names
 * Use this for type-safe icon name references
 * 
 * Example usage:
 * function IconButton({ icon: IconName }) {
 *   const Icon = Icons[icon]
 *   return <Icon className="h-4 w-4" />
 * }
 */
export type IconName = keyof typeof Icons

/**
 * Type for icon components
 * Use this when you need to type a variable or prop as an icon component
 * 
 * Example usage:
 * const MyIcon: IconComponent = Icons.MapPin
 */
export type IconComponent = typeof Icons[IconName]

/**
 * Helper function to get an icon component by name
 * Use this when you need to dynamically select an icon
 * 
 * Example usage:
 * const Icon = getIcon('MapPin')
 */
export function getIcon(name: IconName): IconComponent {
  return Icons[name]
} 