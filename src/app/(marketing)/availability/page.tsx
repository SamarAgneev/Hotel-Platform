import type { Metadata } from "next";
import Link from "next/link";
import { AvailabilitySearch } from "@/components/marketing/AvailabilitySearch";
import { AvailabilityResultCard } from "@/components/marketing/AvailabilityResultCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { WhatsAppCTA } from "@/components/marketing/WhatsAppCTA";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { searchAvailability } from "@/lib/integrations/availability";
import { availabilitySearchSchema } from "@/lib/validation/booking";
import { formatDateLabel } from "@/lib/utils/format";
import type { UnavailableReason } from "@/domain/availability/types";

export const metadata: Metadata = {
  title: "Check availability",
  robots: { index: false }, // query-string results page, not meant to rank
};

interface AvailabilityPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const REASON_LABEL: Record<UnavailableReason, string> = {
  capacity: "Too small for your group",
  sold_out: "Fully booked for these dates",
  insufficient_units: "Not enough rooms left for your request",
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AvailabilityPage({ searchParams }: AvailabilityPageProps) {
  const params = await searchParams;
  const hasQuery = !!(first(params.checkIn) || first(params.checkOut));

  const parsed = hasQuery
    ? availabilitySearchSchema.safeParse({
        checkInDate: first(params.checkIn),
        checkOutDate: first(params.checkOut),
        adults: Number(first(params.adults) ?? 2),
        children: Number(first(params.children) ?? 0),
        rooms: Number(first(params.rooms) ?? 1),
      })
    : null;

  // Server-side re-validation happens twice: schema here, engine + policy in searchAvailability.
  const outcome = parsed?.success ? await searchAvailability(parsed.data) : null;

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <SectionHeading title="Check availability" />

      <div className="mt-8">
        <AvailabilitySearch variant="page" initial={parsed?.success ? parsed.data : undefined} key={parsed?.success ? `${parsed.data.checkInDate}-${parsed.data.checkOutDate}-${parsed.data.adults}-${parsed.data.children}-${parsed.data.rooms}` : "empty"} />
      </div>

      <div className="mt-10" aria-live="polite">
        {!hasQuery && (
          <EmptyState
            title="Choose your dates"
            description="Pick check-in, check-out and guests above to see the rooms you can book."
          />
        )}

        {hasQuery && parsed && !parsed.success && (
          <div role="alert" className="rounded-lg border border-state-danger/30 bg-surface-raised p-6">
            <h2 className="text-lg text-text-primary">Those dates don&apos;t look right</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {parsed.error.issues[0]?.message ?? "Check your dates and guests, then search again."}
            </p>
          </div>
        )}

        {outcome?.status === "invalid" && (
          <div role="alert" className="rounded-lg border border-state-danger/30 bg-surface-raised p-6">
            <h2 className="text-lg text-text-primary">Please adjust your search</h2>
            <p className="mt-1 text-sm text-text-secondary">{outcome.message}</p>
          </div>
        )}

        {outcome?.status === "error" && (
          <ErrorState
            title="We couldn't check availability"
            description="Something went wrong on our side. Reload to try again, or contact us and we'll check by hand."
          />
        )}

        {outcome?.status === "results" && (() => {
          const { query, results } = outcome;
          const bookable = results.filter((r) => r.isBookable);
          const unavailable = results.filter((r) => !r.isBookable);
          const carry = new URLSearchParams({
            checkIn: query.checkInDate,
            checkOut: query.checkOutDate,
            adults: String(query.adults),
            children: String(query.children),
            rooms: String(query.rooms),
          }).toString();
          const summary = `${formatDateLabel(query.checkInDate)} → ${formatDateLabel(query.checkOutDate)} · ${query.adults} Adult${query.adults !== 1 ? "s" : ""}${query.children ? ` · ${query.children} Child${query.children !== 1 ? "ren" : ""}` : ""} · ${query.rooms} Room${query.rooms !== 1 ? "s" : ""}`;

          return (
            <section aria-labelledby="results-heading">
              <h2 id="results-heading" className="text-lg text-text-primary">{summary}</h2>

              {bookable.length === 0 ? (
                <div className="mt-6">
                  <EmptyState
                    title="No rooms are available for these dates"
                    description="Try different dates, or a shorter stay. We can also check by hand."
                    action={<WhatsAppCTA message={`Hi, I'm looking for a room ${summary}. Can you help?`} />}
                  />
                </div>
              ) : (
                <>
                  <p className="mt-1 text-sm text-text-secondary">
                    {bookable.length} room {bookable.length === 1 ? "type" : "types"} available
                  </p>
                  <div className="mt-6 flex flex-col gap-4">
                    {bookable.map((result) => (
                      <AvailabilityResultCard key={result.roomTypeId} result={result} searchParams={carry} />
                    ))}
                  </div>
                </>
              )}

              {unavailable.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-sm font-medium text-text-secondary">Not available for this search</h3>
                  <ul className="mt-3 divide-y divide-[var(--border-subtle)] rounded-lg border border-border-subtle">
                    {unavailable.map((result) => (
                      <li key={result.roomTypeId} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                        <span className="text-text-primary">{result.roomTypeName}</span>
                        <span className="text-text-secondary">
                          {result.unavailableReason ? REASON_LABEL[result.unavailableReason] : "Unavailable"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-text-secondary">
                    Different plans? <Link href="/contact" className="underline">Contact us</Link>.
                  </p>
                </div>
              )}
            </section>
          );
        })()}
      </div>
    </div>
  );
}
