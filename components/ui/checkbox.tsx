"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Icons } from "@/lib/icons"
import { cn } from "@/lib/utils"

// Use type assertion to access Root and Indicator
const Root = (CheckboxPrimitive as any).Root
const Indicator = (CheckboxPrimitive as any).Indicator

const Checkbox = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cn(
      "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <Indicator className="flex items-center justify-center text-current">
      <Icons.Check className="h-4 w-4" />
    </Indicator>
  </Root>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
