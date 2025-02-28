/**
 * Shared icons configuration for Wellspace
 * This file centralizes all icon imports and provides consistent naming across the application
 * Icons are imported from lucide-react and re-exported with standardized names
 */

import React from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  FileText,
  Heart,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Phone,
  Plus,
  Star,
  Trash,
  Trophy,
  User,
  Users,
  Video,
  XCircle
} from 'lucide-react';

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
  logo: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 13h6" />
      <path d="m2 16 4.5-9 4.5 9" />
      <path d="M18 16V7" />
      <path d="m14 11 4-4 4 4" />
    </svg>
  ),
  // Lowercase versions for backward compatibility
  heart: Heart,
  activity: Activity,
  check: Check,
  user: User,
  dashboard: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  grid: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  ),
  
  // Uppercase versions for components that use them
  Heart: Heart,
  Activity: Activity,
  Check: Check,
  User: User,
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  FileText,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Phone,
  Plus,
  Star,
  Trash2: Trash,
  Trash,
  Trophy,
  Users,
  Video,
  XCircle
} as const;

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
export type IconName = keyof typeof Icons;

/**
 * Type for icon components
 * Use this when you need to type a variable or prop as an icon component
 * 
 * Example usage:
 * const MyIcon: IconComponent = Icons.MapPin
 */
export type IconComponent = React.ComponentType<React.ComponentProps<typeof Activity>> | (() => JSX.Element);

/**
 * Helper function to get an icon component by name
 * Use this when you need to dynamically select an icon
 * 
 * Example usage:
 * const Icon = getIcon('MapPin')
 */
export function getIcon(name: IconName): IconComponent {
  return Icons[name];
}

// Default export for compatibility
export default Icons; 