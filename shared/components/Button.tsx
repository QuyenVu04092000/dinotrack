"use client";

import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth = false, className = "", ...props }, ref) => {
    const baseClasses =
      "inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60";

    const variantClasses =
      variant === "primary"
        ? "bg-primary text-primaryForeground hover:bg-primary/90"
        : "bg-transparent text-mutedForeground hover:bg-muted/60";

    const widthClasses = fullWidth ? "w-full" : "";

    return <button ref={ref} className={`${baseClasses} ${variantClasses} ${widthClasses} ${className}`} {...props} />;
  },
);

Button.displayName = "Button";
