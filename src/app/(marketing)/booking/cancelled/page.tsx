import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Booking cancelled",
  robots: { index: false },
};

export default function BookingCancelledPage() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <EmptyState
        title="Reserved for cancelled bookings"
        description="The booking engine will redirect here once cancellations are implemented."
      />
    </div>
  );
}
