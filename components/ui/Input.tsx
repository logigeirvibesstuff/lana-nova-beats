import * as React from "react";
import clsx from "clsx";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={clsx(
          "flex h-9 w-full rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-foreground shadow-sm ring-offset-background placeholder:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lana-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

