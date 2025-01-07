"use client"

import { toast as sonnerToast, Toaster as Sonner } from "sonner"

export type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export type ToastActionElement = React.ReactElement

export const toast = ({ title, description, variant }: ToastProps) => {
  sonnerToast(title, {
    description,
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : undefined,
  })
}

export function Toaster() {
  return (
    <Sonner
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
    />
  )
}

export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}



