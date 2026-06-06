"use client"

import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full rounded-xl border bg-background overflow-hidden",
      "data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle = true,
  className,
  ...props
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex items-center justify-center bg-border/70 transition-colors",
      "hover:bg-primary/30",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",

      // Horizontal
      "w-px",
      "after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2",

      // Vertical
      "data-[panel-group-direction=vertical]:h-px",
      "data-[panel-group-direction=vertical]:w-full",
      "data-[panel-group-direction=vertical]:after:left-0",
      "data-[panel-group-direction=vertical]:after:h-2",
      "data-[panel-group-direction=vertical]:after:w-full",
      "data-[panel-group-direction=vertical]:after:-translate-y-1/2",
      "data-[panel-group-direction=vertical]:after:translate-x-0",

      "[&[data-panel-group-direction=vertical]>div]:rotate-90",

      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-6 w-5 items-center justify-center rounded-md border bg-background shadow-sm">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
}