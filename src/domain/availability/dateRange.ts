import type { BookingStatus } from "./types";

/**
 * Stay semantics: a stay from A to B occupies the half-open interval
 * [A, B) — the check-in night is included, the check-out date is not.
 * 12 Oct -> 14 Oct occupies the nights of 12 and 13 Oct; the room can be
 * sold again with check-in on 14 Oct.
 *
 * Two half-open intervals overlap iff each starts before the other ends.
 * This single expression yields correct results for containment, partial
 * overlap on either side, and the "touching" edge cases (checkout day ==
 * next check-in day), which do NOT overlap.
 */
export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Number of nights in [checkIn, checkOut). */
export function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = new Date(`${checkOut}T00:00:00Z`).getTime() - new Date(`${checkIn}T00:00:00Z`).getTime();
  return Math.round(ms / 86_400_000);
}

/** Each occupied night in [start, end), as ISO dates. */
export function eachNight(start: string, end: string): string[] {
  const nights: string[] = [];
  for (let d = start; d < end; d = addDays(d, 1)) nights.push(d);
  return nights;
}

/**
 * Booking statuses that HOLD inventory.
 * - PENDING: reserved, awaiting confirmation/payment — must hold the room or
 *   two guests could both be promised it.
 * - CONFIRMED, CHECKED_IN: obviously hold it.
 * - CHECKED_OUT: the stay occupied those nights; the range stays blocked
 *   (matters for historical/calendar views; future searches never overlap it).
 * Statuses that RELEASE inventory:
 * - CANCELLED: guest/hotel cancelled.
 * - NO_SHOW: guest never arrived; the room is treated as free again.
 *   (Business rule chosen here — revisit if the hotel bills no-shows and
 *   wants to keep the nights held.)
 */
const BLOCKING_STATUSES: ReadonlySet<BookingStatus> = new Set([
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
]);

export function isBlockingBookingStatus(status: BookingStatus): boolean {
  return BLOCKING_STATUSES.has(status);
}
