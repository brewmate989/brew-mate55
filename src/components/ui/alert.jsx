import * as React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3 text-sm shadow-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default:
          "border-gray-200 bg-white text-gray-900",

        destructive:
          "border-red-300 bg-red-50 text-red-600 [&>svg]:text-red-600",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        alertVariants({ variant }),
        className
      )}
      {...props}
    />
  )
);

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        "mb-1 font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);

AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-sm text-gray-600 [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
);

AlertDescription.displayName =
  "AlertDescription";

export {
  Alert,
  AlertTitle,
  AlertDescription,
};