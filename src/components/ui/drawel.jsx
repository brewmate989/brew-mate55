"use client";

import * as React from "react";

import {
  Drawer as DrawerPrimitive,
} from "vaul";

import { cn } from "@/lib/utils";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={
      shouldScaleBackground
    }
    {...props}
  />
);

Drawer.displayName =
  "Drawer";

const DrawerTrigger =
  DrawerPrimitive.Trigger;

const DrawerPortal =
  DrawerPrimitive.Portal;

const DrawerClose =
  DrawerPrimitive.Close;

const DrawerOverlay =
  React.forwardRef(
    (
      {
        className,
        ...props
      },
      ref
    ) => (
      <DrawerPrimitive.Overlay
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 bg-black/70 backdrop-blur-sm",
          className
        )}
        {...props}
      />
    )
  );

DrawerOverlay.displayName =
  DrawerPrimitive.Overlay.displayName;

const DrawerContent =
  React.forwardRef(
    (
      {
        className,
        children,
        ...props
      },
      ref
    ) => (
      <DrawerPortal>

        <DrawerOverlay />

        <DrawerPrimitive.Content
          ref={ref}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-3xl border border-border bg-background shadow-2xl",
            "max-h-[90vh] min-h-[200px]",
            className
          )}
          {...props}
        >

          <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-muted" />

          <div className="overflow-y-auto">
            {children}
          </div>

        </DrawerPrimitive.Content>

      </DrawerPortal>
    )
  );

DrawerContent.displayName =
  "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "grid gap-2 p-5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

DrawerHeader.displayName =
  "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "mt-auto flex flex-col gap-3 p-5",
      className
    )}
    {...props}
  />
);

DrawerFooter.displayName =
  "DrawerFooter";

const DrawerTitle =
  React.forwardRef(
    (
      {
        className,
        ...props
      },
      ref
    ) => (
      <DrawerPrimitive.Title
        ref={ref}
        className={cn(
          "text-xl font-semibold tracking-tight",
          className
        )}
        {...props}
      />
    )
  );

DrawerTitle.displayName =
  DrawerPrimitive.Title.displayName;

const DrawerDescription =
  React.forwardRef(
    (
      {
        className,
        ...props
      },
      ref
    ) => (
      <DrawerPrimitive.Description
        ref={ref}
        className={cn(
          "text-sm leading-relaxed text-muted-foreground",
          className
        )}
        {...props}
      />
    )
  );

DrawerDescription.displayName =
  DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};