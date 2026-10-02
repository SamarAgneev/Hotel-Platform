"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Built on the native <dialog> element: focus trapping, Escape-to-close,
 * and top-layer stacking come from the browser rather than reimplemented
 * JS, which is what keeps this accessible by default.
 */
export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
      className={cn(
        "w-full max-w-md rounded-lg border border-border-subtle bg-surface-raised p-6 shadow-lg backdrop:bg-black/40",
        className,
      )}
    >
      <h2 id="dialog-title" className="text-lg font-semibold text-text-primary">
        {title}
      </h2>
      {description && (
        <p id="dialog-description" className="mt-1 text-sm text-text-secondary">
          {description}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </dialog>
  );
}
