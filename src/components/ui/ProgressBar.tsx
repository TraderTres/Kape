"use client";

import { cn } from "@/lib/utils";
import type { ProgressBarProps } from "@/types";

const colorStyles = {
  espresso: "bg-espresso-900",
  gold: "bg-gold-400",
  green: "bg-emerald-500",
};

export function ProgressBar({
  value,
  max,
  className,
  color = "gold",
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-espresso-100">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colorStyles[color],
            animated && "animate-progress-fill"
          )}
          style={{
            width: `${percentage}%`,
            ["--progress-width" as string]: `${percentage}%`,
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
        {/* Shimmer effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.35) 50%, transparent 75%)",
            backgroundSize: "200% 100%",
            animation: animated ? "shimmer 2s infinite" : "none",
          }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs text-espresso-600">
          <span>{value.toLocaleString()} pts</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
}
