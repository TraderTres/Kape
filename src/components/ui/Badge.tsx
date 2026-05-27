import { cn } from "@/lib/utils";
import type { BadgeProps } from "@/types";

const variantStyles = {
  espresso: "bg-espresso-100 text-espresso-900 border border-espresso-200",
  gold: "bg-gold-100 text-gold-800 border border-gold-300",
  green: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  blue: "bg-blue-50 text-blue-800 border border-blue-200",
  gray: "bg-gray-100 text-gray-700 border border-gray-200",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export function Badge({
  variant = "espresso",
  size = "md",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
