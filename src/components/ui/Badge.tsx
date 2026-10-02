import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const TONE_CLASSES = {
  neutral: "bg-surface-sunken text-text-secondary",
  success: "bg-[#e4f2e9] text-state-success",
  warning: "bg-[#f7ecd9] text-state-warning",
  danger: "bg-[#f7e3de] text-state-danger",
  accent: "bg-[#f3e6d3] text-accent-primary",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof TONE_CLASSES;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    />
  );
}
