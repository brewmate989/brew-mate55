"use client";

import * as React from "react";
import {
  OTPInput,
  OTPInputContext,
} from "input-otp";

import { Minus } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef(
  (
    {
      className,
      containerClassName,
      ...props
    },
    ref
  ) => (
    <OTPInput
      ref={ref}
      containerClassName={cn(
        "flex items-center gap-3 has-[:disabled]:opacity-50",
        containerClassName
      )}
      className={cn(
        "disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
);

InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef(
  (
    { className, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2",
        className
      )}
      {...props}
    />
  )
);

InputOTPGroup.displayName =
  "InputOTPGroup";

const InputOTPSlot = React.forwardRef(
  (
    {
      index,
      className,
      ...props
    },
    ref
  ) => {
    const inputOTPContext =
      React.useContext(
        OTPInputContext
      );

    const {
      char,
      hasFakeCaret,
      isActive,
    } =
      inputOTPContext.slots[index];

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-base font-semibold text-gray-900 shadow-sm transition-all duration-200",
          "hover:border-orange-300",
          isActive &&
            "z-10 border-orange-400 ring-2 ring-orange-200 shadow-md",
          className
        )}
        {...props}
      >
        {char}

        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-[2px] animate-caret-blink bg-orange-500 duration-1000" />
          </div>
        )}
      </div>
    );
  }
);

InputOTPSlot.displayName =
  "InputOTPSlot";

const InputOTPSeparator =
  React.forwardRef(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        role="separator"
        className={cn(
          "text-gray-400",
          className
        )}
        {...props}
      >
        <Minus className="h-4 w-4" />
      </div>
    )
  );

InputOTPSeparator.displayName =
  "InputOTPSeparator";

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
};
