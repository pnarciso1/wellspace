"use client"

import { toast } from "sonner"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  return {
    toast: ({ title, description, variant }: ToastProps) => {
      toast(title, {
        description,
        className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : undefined,
      })
    },
  }
}

