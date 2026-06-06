"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition-all duration-200",
          "placeholder:text-gray-400",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-orange-400",
          "focus-visible:border-orange-400",
          "hover:border-orange-300",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
          "file:border-0",
          "file:bg-transparent",
          "file:text-sm",
          "file:font-medium",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };