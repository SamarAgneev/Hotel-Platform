import { Skeleton } from "@/components/ui/Skeleton";

export default function AvailabilityLoading() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16" role="status" aria-label="Checking availability">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-8 h-24 w-full rounded-lg" />
      <Skeleton className="mt-10 h-6 w-80 max-w-full" />
      <div className="mt-6 flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
