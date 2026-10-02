import {
  addDays,
  eachNight,
  isBlockingBookingStatus,
  isIsoDate,
  nightsBetween,
  rangesOverlap,
} from "./dateRange";
import type {
  AvailabilityInput,
  AvailabilityQuery,
  CalendarCellState,
  RoomBlockSnapshot,
  RoomSnapshot,
  RoomTypeAvailability,
  BookingRoomSnapshot,
} from "./types";

/**
 * Pure availability engine — no I/O, no Prisma, no React. Data access
 * lives in the repository/service layer, which hands this function
 * snapshots. That split is what makes the rules unit-testable.
 */

export class AvailabilityValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AvailabilityValidationError";
  }
}

/** Authoritative server-side validation of a search query. */
export function validateAvailabilityQuery(query: AvailabilityQuery): void {
  if (!isIsoDate(query.checkInDate) || !isIsoDate(query.checkOutDate)) {
    throw new AvailabilityValidationError("Dates must be valid calendar dates.");
  }
  if (query.checkOutDate <= query.checkInDate) {
    throw new AvailabilityValidationError("Check-out must be after check-in.");
  }
  if (!Number.isInteger(query.adults) || query.adults < 1) {
    throw new AvailabilityValidationError("At least one adult is required.");
  }
  if (!Number.isInteger(query.children) || query.children < 0) {
    throw new AvailabilityValidationError("Children cannot be negative.");
  }
  if (!Number.isInteger(query.rooms) || query.rooms < 1) {
    throw new AvailabilityValidationError("At least one room is required.");
  }
  if (query.adults < query.rooms) {
    throw new AvailabilityValidationError("Each room needs at least one adult.");
  }
}

/** True if this physical room is free for the whole [checkIn, checkOut). */
export function isRoomAvailable(
  room: RoomSnapshot,
  bookings: BookingRoomSnapshot[],
  blocks: RoomBlockSnapshot[],
  checkIn: string,
  checkOut: string,
): boolean {
  // Long-lived operational status removes the room from every search.
  if (room.status !== "ACTIVE") return false;

  const held = bookings.some(
    (b) =>
      b.roomId === room.id &&
      isBlockingBookingStatus(b.status) &&
      rangesOverlap(checkIn, checkOut, b.checkInDate, b.checkOutDate),
  );
  if (held) return false;

  const blocked = blocks.some(
    (bl) =>
      bl.roomId === room.id &&
      bl.status === "ACTIVE" &&
      rangesOverlap(checkIn, checkOut, bl.startDate, bl.endDate),
  );
  return !blocked;
}

/**
 * Party-fit rule. The party is split across `rooms` rooms; we require a
 * room type to be able to host an even-ish split, i.e. per-room
 * ceil(adults/rooms) adults and ceil(children/rooms) children, and the
 * per-room total within maxOccupancy.
 */
export function partyFitsRoomType(
  query: Pick<AvailabilityQuery, "adults" | "children" | "rooms">,
  cap: { maxAdults: number; maxChildren: number; maxOccupancy: number },
): boolean {
  const adultsPerRoom = Math.ceil(query.adults / query.rooms);
  const childrenPerRoom = Math.ceil(query.children / query.rooms);
  return (
    adultsPerRoom <= cap.maxAdults &&
    childrenPerRoom <= cap.maxChildren &&
    adultsPerRoom + childrenPerRoom <= cap.maxOccupancy
  );
}

export function computeAvailability(input: AvailabilityInput): RoomTypeAvailability[] {
  const { roomTypes, rooms, bookings, blocks, query } = input;
  validateAvailabilityQuery(query);

  const nights = nightsBetween(query.checkInDate, query.checkOutDate);

  return roomTypes.map((roomType) => {
    const sellable = rooms.filter((r) => r.roomTypeId === roomType.id && r.status === "ACTIVE");
    const availableUnits = sellable.filter((room) =>
      isRoomAvailable(room, bookings, blocks, query.checkInDate, query.checkOutDate),
    ).length;

    const fitsParty = partyFitsRoomType(query, roomType);
    const isBookable = fitsParty && availableUnits >= query.rooms;

    let unavailableReason: RoomTypeAvailability["unavailableReason"];
    if (!fitsParty) unavailableReason = "capacity";
    else if (availableUnits === 0) unavailableReason = "sold_out";
    else if (availableUnits < query.rooms) unavailableReason = "insufficient_units";

    return {
      roomTypeId: roomType.id,
      roomTypeName: roomType.name,
      availableUnits,
      totalUnits: sellable.length,
      fitsParty,
      isBookable,
      unavailableReason,
      pricing: { basePriceCents: roomType.basePriceCents, currency: roomType.currency, nights },
      occupancy: {
        maxAdults: roomType.maxAdults,
        maxChildren: roomType.maxChildren,
        maxOccupancy: roomType.maxOccupancy,
      },
      sizeSqm: roomType.sizeSqm,
    };
  });
}

/**
 * Re-check used by the (future) booking transaction: given a fresh
 * snapshot read INSIDE the transaction, can `unitsWanted` rooms of this
 * type still be sold? Never trust a result computed at search time.
 */
export function canReserve(
  input: Omit<AvailabilityInput, "query"> & { query: AvailabilityQuery; roomTypeId: string },
): boolean {
  const result = computeAvailability(input).find((r) => r.roomTypeId === input.roomTypeId);
  return !!result && result.isBookable;
}

/** Admin calendar: one state per room per night. Blocks/out-of-service win over bookings visually. */
export function buildInventoryCalendar(params: {
  rooms: RoomSnapshot[];
  bookings: BookingRoomSnapshot[];
  blocks: RoomBlockSnapshot[];
  startDate: string;
  endDate: string; // exclusive
}): { roomId: string; cells: { date: string; state: CalendarCellState }[] }[] {
  const nights = eachNight(params.startDate, params.endDate);
  return params.rooms.map((room) => ({
    roomId: room.id,
    cells: nights.map((date) => {
      const next = addDays(date, 1);
      let state: CalendarCellState = "AVAILABLE";
      if (room.status !== "ACTIVE") {
        state = "OUT_OF_SERVICE";
      } else if (
        params.blocks.some(
          (b) => b.roomId === room.id && b.status === "ACTIVE" && rangesOverlap(date, next, b.startDate, b.endDate),
        )
      ) {
        state = "BLOCKED";
      } else if (
        params.bookings.some(
          (b) =>
            b.roomId === room.id &&
            isBlockingBookingStatus(b.status) &&
            rangesOverlap(date, next, b.checkInDate, b.checkOutDate),
        )
      ) {
        state = "BOOKED";
      }
      return { date, state };
    }),
  }));
}
