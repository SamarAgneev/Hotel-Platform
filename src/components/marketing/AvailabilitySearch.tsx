"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { availabilitySearchSchema } from "@/lib/validation/booking";
import { DateRangePicker, type DateRangeValue } from "./DateRangePicker";
import { GuestSelector, type GuestCounts } from "./GuestSelector";

export interface AvailabilitySearchProps {
  className?: string;
  variant?: "hero" | "page";
  /** Pre-fill from a previous search (e.g. the URL on the results page). */
  initial?: { checkInDate: string; checkOutDate: string; adults: number; children: number; rooms: number };
}

function defaultDates(): DateRangeValue {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 14);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 2);
  return {
    checkInDate: checkIn.toISOString().slice(0, 10),
    checkOutDate: checkOut.toISOString().slice(0, 10),
  };
}

/**
 * UI-flow only, as required: submitting navigates to /availability with
 * the query in the URL. That page calls the same `searchAvailability`
 * integration boundary and is where a real booking engine will plug in —
 * this component never fabricates results itself.
 */
export function AvailabilitySearch({ className, variant = "page", initial }: AvailabilitySearchProps) {
  const router = useRouter();
  const [dates, setDates] = useState<DateRangeValue>(
    initial ? { checkInDate: initial.checkInDate, checkOutDate: initial.checkOutDate } : defaultDates(),
  );
  const [guests, setGuests] = useState<GuestCounts>(
    initial ? { adults: initial.adults, children: initial.children, rooms: initial.rooms } : { adults: 2, children: 0, rooms: 1 },
  );
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const result = availabilitySearchSchema.safeParse({
      checkInDate: dates.checkInDate,
      checkOutDate: dates.checkOutDate,
      adults: guests.adults,
      children: guests.children,
      rooms: guests.rooms,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Check your search details.");
      return;
    }

    setStatus("submitting");
    const params = new URLSearchParams({
      checkIn: result.data.checkInDate,
      checkOut: result.data.checkOutDate,
      adults: String(result.data.adults),
      children: String(result.data.children),
      rooms: String(result.data.rooms),
    });
    router.push(`/availability?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Check availability"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-raised p-4 shadow-sm sm:flex-row sm:items-end sm:gap-3 sm:p-5",
        variant === "hero" && "sm:shadow-lg",
        className,
      )}
    >
      <div className="flex-1">
        <DateRangePicker value={dates} onChange={setDates} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary" htmlFor="guests-selector">
          Guests
        </label>
        <div id="guests-selector">
          <GuestSelector value={guests} onChange={setGuests} />
        </div>
      </div>
      <Button type="submit" size="lg" isLoading={status === "submitting"} className="sm:self-end">
        Check availability
      </Button>
      {error && (
        <p role="alert" className="basis-full text-sm text-state-danger">
          {error}
        </p>
      )}
    </form>
  );
}
