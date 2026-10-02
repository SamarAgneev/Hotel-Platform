import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Booking status",
  robots: { index: false },
};

export default async function BookingStatusPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  await params; // reserved: will look up a real Booking by id once the engine exists

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <EmptyState
        title="Booking lookup isn't available yet"
        description="This page will show a guest's booking status once the booking engine is connected."
      />
    </div>
  );
}
