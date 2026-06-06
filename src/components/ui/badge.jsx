import * as React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-orange-500 text-white hover:bg-orange-600",

        secondary:
          "bg-gray-100 text-gray-700 hover:bg-gray-200",

        destructive:
          "bg-red-500 text-white hover:bg-red-600",

        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}) {
  return (
    <div
      className={cn(
        badgeVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}

export {
  Badge,
  badgeVariants,
};