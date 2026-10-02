import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export default function RoomNotFound() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <EmptyState
        title="We couldn't find that room"
        description="It may have been renamed or is no longer offered."
        action={
          <Link href="/rooms" className="text-sm font-medium text-accent-primary hover:underline">
            Back to all rooms
          </Link>
        }
      />
    </div>
  );
}
