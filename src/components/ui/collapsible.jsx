"use client";

import * as React from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Collapsible =
  CollapsiblePrimitive.Root;

const CollapsibleTrigger =
  React.forwardRef(
    (
      {
        className,
        children,
        ...props
      },
      ref
    ) => (

      <CollapsiblePrimitive.Trigger
        ref={ref}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border border-orange-100 bg-white px-4 py-3 text-left text-sm font-medium shadow-sm transition-all duration-300",
          "hover:border-orange-300 hover:bg-orange-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
          "[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >

        <span>{children}</span>

        <ChevronDown
          className="h-4 w-4 shrink-0 text-orange-500 transition-transform duration-300"
        />

      </CollapsiblePrimitive.Trigger>
    )
  );

CollapsibleTrigger.displayName =
  "CollapsibleTrigger";

const CollapsibleContent =
  React.forwardRef(
    (
      {
        className,
        children,
        ...props
      },
      ref
    ) => (

      <CollapsiblePrimitive.Content
        ref={ref}
        className={cn(
          "overflow-hidden text-sm",
          "data-[state=open]:animate-accordion-down",
          "data-[state=closed]:animate-accordion-up",
          className
        )}
        {...props}
      >

        <div className="rounded-b-xl border border-t-0 border-orange-100 bg-white px-4 py-4 shadow-sm">
          {children}
        </div>

      </CollapsiblePrimitive.Content>
    )
  );

CollapsibleContent.displayName =
  "CollapsibleContent";

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
};