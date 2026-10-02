import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const VARIANT_CLASSES = {
  primary:
    "bg-accent-primary text-text-on-accent hover:bg-accent-primary-hover",
  ops: "bg-accent-ops text-text-on-accent hover:bg-accent-ops-hover",
  secondary:
    "bg-surface-raised text-text-primary border border-border-default hover:bg-surface-sunken",
  ghost: "bg-transparent text-text-primary hover:bg-surface-sunken",
  danger: "bg-state-danger text-white hover:opacity-90",
} as const;

const SIZE_CLASSES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_CLASSES;
  size?: keyof typeof SIZE_CLASSES;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading, disabled, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          VARIANT_CLASSES[variant],
          SIZE_CLASSES[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
