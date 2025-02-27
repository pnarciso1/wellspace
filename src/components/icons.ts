'use client'

import {
  Plus,
  FileText,
  ClipboardList,
  ChevronLeft,
  Brain,
  Eye,
  Stethoscope,
  HeartPulse,
  Lungs,
  Activity,
  Pill,
  Bone,
  Frown,
  Smile,
  Meh
} from 'lucide-react'

// Re-export icons with descriptive names
export const icons = {
  // Action icons
  PlusIcon: Plus,
  FileTextIcon: FileText,
  ClipboardListIcon: ClipboardList,
  ChevronLeftIcon: ChevronLeft,
  
  // Medical/Symptom icons
  BrainIcon: Brain,
  EyeIcon: Eye,
  StethoscopeIcon: Stethoscope,
  HeartIcon: HeartPulse,
  LungsIcon: Lungs,
  ActivityIcon: Activity,
  PillIcon: Pill,
  BoneIcon: Bone,
  
  // Emotion/Status icons
  FrownIcon: Frown,
  SmileIcon: Smile,
  MehIcon: Meh
}

export type IconName = keyof typeof icons
