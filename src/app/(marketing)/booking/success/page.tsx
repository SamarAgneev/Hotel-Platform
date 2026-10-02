import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Booking confirmed",
  robots: { index: false },
};

export default function BookingSuccessPage() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <EmptyState
        title="Reserved for booking confirmations"
        description="The booking engine will redirect here once a reservation is completed."
      />
    </div>
  );
}
