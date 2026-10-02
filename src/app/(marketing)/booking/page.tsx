import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Booking",
  robots: { index: false },
};

/**
 * Route reserved for the booking engine (Step 3+). Not linked from
 * navigation yet — /availability is today's entry point, and points
 * guests to a direct enquiry instead.
 */
export default function BookingPage() {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <EmptyState
        title="Booking isn't available yet"
        description="This is a reserved page for the upcoming booking engine. For now, check availability and enquire directly."
        action={
          <Link href="/availability" className="text-sm font-medium text-accent-primary hover:underline">
            Check availability
          </Link>
        }
      />
    </div>
  );
}
