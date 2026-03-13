import * as React from "react";
import clsx from "clsx";

export type BadgeVariant = "default" | "outline" | "soft";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const baseClasses =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide";

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-lana-accent text-black border-transparent shadow shadow-lana-accent/40",
  outline: "border-lana-accent text-lana-accent",
  soft: "bg-black/5 border-black/10 text-gray-700"
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

