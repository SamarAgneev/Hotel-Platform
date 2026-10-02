import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, required, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={selectId} className="text-sm font-medium text-text-primary">
          {label}
          {required && <span aria-hidden="true" className="text-state-danger"> *</span>}
        </label>
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={errorId}
          className={cn(
            "h-11 rounded-md border border-border-default bg-surface-raised px-3 text-sm text-text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
            error && "border-state-danger",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} role="alert" className="text-xs text-state-danger">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";
