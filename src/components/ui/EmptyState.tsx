import type { ReactNode } from "react";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

/**
 * An empty state is an invitation to act, not an apology — always pair a
 * clear title with a next step when one exists.
 */
export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border-default px-6 py-12 text-center">
      {icon && <div className="text-text-secondary">{icon}</div>}
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
