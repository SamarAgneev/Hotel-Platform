import { Skeleton } from "@/components/ui/Skeleton";

export default function GalleryLoading() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-3 h-5 w-64" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
