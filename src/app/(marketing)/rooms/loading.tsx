import { Skeleton } from "@/components/ui/Skeleton";

export default function RoomsLoading() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
