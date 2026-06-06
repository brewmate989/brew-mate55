import * as React from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

import {
  buttonVariants,
} from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "rounded-2xl bg-white p-4 shadow-sm",
        className
      )}
      classNames={{
        months:
          "flex flex-col gap-4 sm:flex-row sm:gap-6",

        month:
          "space-y-4",

        caption:
          "relative flex items-center justify-center pt-1",

        caption_label:
          "text-sm font-semibold text-gray-900",

        nav:
          "flex items-center gap-1",

        nav_button: cn(
          buttonVariants({
            variant: "outline",
            size: "icon",
          }),
          "h-8 w-8 rounded-full border-gray-200 bg-white hover:bg-orange-50 hover:text-orange-500"
        ),

        nav_button_previous:
          "absolute left-1",

        nav_button_next:
          "absolute right-1",

        table:
          "w-full border-collapse",

        head_row:
          "flex",

        head_cell:
          "w-9 rounded-md text-xs font-medium text-gray-400",

        row:
          "mt-2 flex w-full",

        cell: cn(
          "relative p-0 text-center text-sm focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-xl [&:has(>.day-range-start)]:rounded-l-xl"
            : "[&:has([aria-selected])]:rounded-xl"
        ),

        day: cn(
          buttonVariants({
            variant: "ghost",
          }),
          "h-9 w-9 rounded-xl p-0 font-normal text-gray-700 hover:bg-orange-100 hover:text-orange-600"
        ),

        day_selected:
          "bg-orange-500 text-white hover:bg-orange-600 hover:text-white",

        day_today:
          "bg-orange-100 text-orange-600 font-bold",

        day_outside:
          "text-gray-300 opacity-70",

        day_disabled:
          "text-gray-300 opacity-40",

        day_range_start:
          "day-range-start",

        day_range_end:
          "day-range-end",

        day_range_middle:
          "bg-orange-100 text-orange-700",

        day_hidden:
          "invisible",

        ...classNames,
      }}

      components={{
        IconLeft: ({
          className,
          ...props
        }) => (
          <ChevronLeft
            className={cn(
              "h-4 w-4",
              className
            )}
            {...props}
          />
        ),

        IconRight: ({
          className,
          ...props
        }) => (
          <ChevronRight
            className={cn(
              "h-4 w-4",
              className
            )}
            {...props}
          />
        ),
      }}

      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };