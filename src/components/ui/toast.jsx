import React from "react";
import { X } from "lucide-react";

export function Toast({ children, ...props }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-gray-900 px-5 py-3 text-white shadow-lg" {...props}>
      {children}
    </div>
  );
}

export function ToastClose() {
  return (
    <button className="absolute top-2 right-2 p-1 rounded hover:bg-gray-700">
      <X className="h-4 w-4" />
    </button>
  );
}

export function ToastTitle({ children }) {
  return <p className="font-semibold">{children}</p>;
}

export function ToastDescription({ children }) {
  return <p className="text-sm text-gray-300">{children}</p>;
}

export function ToastProvider({ children }) {
  return <>{children}</>;
}

export function ToastViewport() {
  return null;
}
