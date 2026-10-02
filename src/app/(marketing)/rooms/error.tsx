"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function RoomsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <ErrorState
        title="Rooms couldn't be loaded"
        description="Please try again."
        onRetry={reset}
      />
    </div>
  );
}
