import { computeAvailability, AvailabilityValidationError } from "@/domain/availability/engine";
import { addDays, nightsBetween } from "@/domain/availability/dateRange";
import { getInventoryWindow } from "@/domain/availability/inventory-repository";
import type { RoomTypeAvailability } from "@/domain/availability/types";
import { emitEvent } from "@/lib/events/bus";
import { AUTOMATION_EVENTS } from "@/lib/events/types";
import type { AvailabilitySearchInput } from "@/lib/validation/booking";

/**
 * Customer-facing availability boundary. The page calls this; this calls
 * the server-side engine. No availability logic lives in React.
 *
 * Search-policy limits (business policy, not date arithmetic, so they live
 * here rather than in the pure engine): no past check-in, at most 30
 * nights, at most ~1 year ahead.
 */

export const SEARCH_POLICY = { maxNights: 30, maxDaysAhead: 365 } as const;

export type AvailabilitySearchOutcome =
  | { status: "results"; query: AvailabilitySearchInput; results: RoomTypeAvailability[] }
  | { status: "invalid"; message: string }
  | { status: "error"; message: string };

export async function searchAvailability(query: AvailabilitySearchInput): Promise<AvailabilitySearchOutcome> {
  const today = new Date().toISOString().slice(0, 10);

  if (query.checkInDate < today) {
    return { status: "invalid", message: "Check-in can't be in the past." };
  }
  if (query.checkInDate > addDays(today, SEARCH_POLICY.maxDaysAhead)) {
    return { status: "invalid", message: "We can only show dates up to a year ahead." };
  }
  if (query.checkOutDate > query.checkInDate && nightsBetween(query.checkInDate, query.checkOutDate) > SEARCH_POLICY.maxNights) {
    return { status: "invalid", message: `Stays are limited to ${SEARCH_POLICY.maxNights} nights online.` };
  }

  try {
    const window = await getInventoryWindow(query.checkInDate, query.checkOutDate);
    const results = computeAvailability({ ...window, query });

    await emitEvent(AUTOMATION_EVENTS.AVAILABILITY_SEARCH_COMPLETED, {
      checkInDate: query.checkInDate,
      checkOutDate: query.checkOutDate,
      adults: query.adults,
      children: query.children,
      rooms: query.rooms,
      bookableRoomTypes: results.filter((r) => r.isBookable).length,
    });

    return { status: "results", query, results };
  } catch (error) {
    if (error instanceof AvailabilityValidationError) {
      return { status: "invalid", message: error.message };
    }
    return { status: "error", message: "We couldn't check availability just now." };
  }
}
