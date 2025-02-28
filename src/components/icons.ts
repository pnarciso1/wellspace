'use client'

import {
  Plus,
  FileText,
  ChevronLeft,
  Activity,
  User,
  MessageSquare,
  Check,
  XCircle
} from 'lucide-react'

// Re-export icons with descriptive names
export const icons = {
  // Action icons
  PlusIcon: Plus,
  FileTextIcon: FileText,
  ChevronLeftIcon: ChevronLeft,
  
  // Medical/Symptom icons
  ActivityIcon: Activity,
  UserIcon: User,
  MessageIcon: MessageSquare,
  
  // Status icons
  CheckIcon: Check,
  XIcon: XCircle
}

export type IconName = keyof typeof icons
