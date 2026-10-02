import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * Errors state what happened and how to fix it — never vague, never
 * apologetic filler.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "That didn't load. Try again, or come back in a moment.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-lg border border-border-subtle bg-surface-raised px-6 py-12 text-center"
    >
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
