import * as React from "react";

import { Slot } from "@radix-ui/react-slot";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-orange-500 text-white shadow hover:bg-orange-600",

        destructive:
          "bg-red-500 text-white shadow hover:bg-red-600",

        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",

        secondary:
          "bg-gray-100 text-gray-700 hover:bg-gray-200",

        ghost:
          "hover:bg-gray-100 hover:text-gray-900",

        link:
          "text-orange-500 underline-offset-4 hover:underline",
      },

      size: {
        default:
          "h-10 px-5 py-2",

        sm:
          "h-8 px-3 text-xs rounded-lg",

        lg:
          "h-12 px-8 text-base rounded-xl",

        icon:
          "h-10 w-10 rounded-full",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref
  ) => {

    const Comp = asChild
      ? Slot
      : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          })
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export {
  Button,
  buttonVariants,
};