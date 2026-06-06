"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef(
  ({ className, value = 0, showValue = false, ...props }, ref) => (
    <div className="w-full space-y-2">
      {showValue && (
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Loading</span>
          <span>{value}%</span>
        </div>
      )}

      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-muted shadow-inner",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full rounded-full bg-primary transition-all duration-500 ease-in-out"
          style={{
            width: `${value}%`,
          }}
        />
      </ProgressPrimitive.Root>
    </div>
  )
)

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }