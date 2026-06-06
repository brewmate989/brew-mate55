import * as React from "react";

import { Slot } from "@radix-ui/react-slot";

import {
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef(
  ({ ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      {...props}
    />
  )
);

Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-2 break-words text-sm text-gray-500",
        className
      )}
      {...props}
    />
  )
);

BreadcrumbList.displayName =
  "BreadcrumbList";

const BreadcrumbItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "inline-flex items-center gap-2",
        className
      )}
      {...props}
    />
  )
);

BreadcrumbItem.displayName =
  "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef(
  (
    { asChild, className, ...props },
    ref
  ) => {

    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        className={cn(
          "transition-colors hover:text-orange-500",
          className
        )}
        {...props}
      />
    );
  }
);

BreadcrumbLink.displayName =
  "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "font-medium text-gray-900",
        className
      )}
      {...props}
    />
  )
);

BreadcrumbPage.displayName =
  "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn(
      "[&>svg]:h-3.5 [&>svg]:w-3.5 text-gray-400",
      className
    )}
    {...props}
  >

    {children ?? <ChevronRight />}

  </li>
);

BreadcrumbSeparator.displayName =
  "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      "flex h-9 w-9 items-center justify-center text-gray-400",
      className
    )}
    {...props}
  >

    <MoreHorizontal className="h-4 w-4" />

    <span className="sr-only">
      More
    </span>

  </span>
);

BreadcrumbEllipsis.displayName =
  "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};