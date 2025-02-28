"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

// Use type assertion to access Radix UI components
const Root = (DropdownMenuPrimitive as any).Root
const Trigger = (DropdownMenuPrimitive as any).Trigger
const Portal = (DropdownMenuPrimitive as any).Portal
const Content = (DropdownMenuPrimitive as any).Content
const Item = (DropdownMenuPrimitive as any).Item
const CheckboxItem = (DropdownMenuPrimitive as any).CheckboxItem
const RadioItem = (DropdownMenuPrimitive as any).RadioItem
const Label = (DropdownMenuPrimitive as any).Label
const Separator = (DropdownMenuPrimitive as any).Separator
const Shortcut = (DropdownMenuPrimitive as any).Shortcut
const Group = (DropdownMenuPrimitive as any).Group
const Sub = (DropdownMenuPrimitive as any).Sub
const SubTrigger = (DropdownMenuPrimitive as any).SubTrigger
const SubContent = (DropdownMenuPrimitive as any).SubContent
const RadioGroup = (DropdownMenuPrimitive as any).RadioGroup

const DropdownMenu = Root

const DropdownMenuTrigger = Trigger

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof Content>,
  React.ComponentPropsWithoutRef<typeof Content>
>(({ className, ...props }, ref) => (
  <Portal>
    <Content
      ref={ref}
      className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-md"
      {...props}
    />
  </Portal>
))
DropdownMenuContent.displayName = Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof Item>,
  React.ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => (
  <Item
    ref={ref}
    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
    {...props}
  />
))
DropdownMenuItem.displayName = Item.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
}
