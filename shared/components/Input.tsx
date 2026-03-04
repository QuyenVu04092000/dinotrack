"use client";

import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, className = "", ...props }, ref) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <label htmlFor={id} className="text-xs font-medium text-mutedForeground">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={id}
        className={`h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-mutedForeground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";
