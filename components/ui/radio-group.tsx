"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

// Use type assertion to access Radix UI components
const Root = (RadioGroupPrimitive as any).Root
const Item = (RadioGroupPrimitive as any).Item
const Indicator = (RadioGroupPrimitive as any).Indicator

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => {
  return (
    <Root
      className={className}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof Item>,
  React.ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => {
  return (
    <Item
      ref={ref}
      className={className}
      {...props}
    >
      <Indicator className="flex items-center justify-center">
        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
      </Indicator>
    </Item>
  )
})
RadioGroupItem.displayName = Item.displayName

export { RadioGroup, RadioGroupItem }
