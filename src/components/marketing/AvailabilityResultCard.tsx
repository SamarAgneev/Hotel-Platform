import Link from "next/link";
import type { RoomTypeAvailability } from "@/domain/availability/types";
import { formatPriceFromCents } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";

export interface AvailabilityResultCardProps {
  result: RoomTypeAvailability;
  /** Query string carried to the room page so the choice keeps its dates. */
  searchParams: string;
}

const LOW_STOCK_THRESHOLD = 2;

/** Renders ONLY values computed by the availability engine — no counts in JSX. */
export function AvailabilityResultCard({ result, searchParams }: AvailabilityResultCardProps) {
  const { availableUnits, pricing, occupancy } = result;
  const total = pricing.basePriceCents * pricing.nights;

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-raised p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-xl text-text-primary">{result.roomTypeName}</h3>
        <p className="mt-1 text-sm text-text-secondary">
          Up to {occupancy.maxOccupancy} guests
          {result.sizeSqm ? ` · ${result.sizeSqm} m²` : ""}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-text-primary">
            {availableUnits} {availableUnits === 1 ? "room" : "rooms"} available
          </span>
          {availableUnits <= LOW_STOCK_THRESHOLD && <Badge tone="warning">Almost gone</Badge>}
        </p>
      </div>

      <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end sm:justify-center">
        <div className="sm:text-right">
          <p className="text-lg text-text-primary">
            {formatPriceFromCents(pricing.basePriceCents, pricing.currency)}
            <span className="text-sm text-text-secondary"> / night</span>
          </p>
          <p className="text-xs text-text-secondary">
            {formatPriceFromCents(total, pricing.currency)} for {pricing.nights} {pricing.nights === 1 ? "night" : "nights"}
          </p>
        </div>
        <Link
          href={`/rooms/${result.roomTypeId}?${searchParams}`}
          className="inline-flex h-11 items-center rounded-md bg-accent-primary px-5 text-sm font-medium text-text-on-accent transition-colors hover:bg-accent-primary-hover"
        >
          Select room
        </Link>
      </div>
    </article>
  );
}
