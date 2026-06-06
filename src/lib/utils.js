// src/lib/utils.js

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// cek apakah app berjalan di iframe
export const isIframe =
  typeof window !== "undefined"
    ? window.self !== window.top
    : false;