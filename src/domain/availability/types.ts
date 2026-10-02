/**
 * Availability domain types.
 *
 * These are plain snapshots of the data the engine needs. They are
 * deliberately independent of Prisma's generated types so the engine is a
 * pure function that can be unit-tested (and run) without a database.
 *
 * All dates are ISO calendar dates ("YYYY-MM-DD"), never timestamps: hotel
 * stays are counted in nights, and comparing fixed-width ISO date strings
 * lexicographically is exactly chronological, with no timezone pitfalls.
 */

export type RoomOperationalStatus = "ACTIVE" | "OUT_OF_SERVICE" | "MAINTENANCE" | "RETIRED";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "NO_SHOW";

export type RoomBlockStatus = "ACTIVE" | "CANCELLED";

export interface RoomTypeSnapshot {
  id: string;
  name: string;
  maxAdults: number;
  maxChildren: number;
  maxOccupancy: number;
  basePriceCents: number;
  currency: string;
  sizeSqm?: number;
}

export interface RoomSnapshot {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  status: RoomOperationalStatus;
}

/** One row per (booking, physical room). Stay is [checkInDate, checkOutDate). */
export interface BookingRoomSnapshot {
  bookingId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
}

/** Block occupies [startDate, endDate). */
export interface RoomBlockSnapshot {
  id: string;
  roomId: string;
  startDate: string;
  endDate: string;
  reason: string;
  notes?: string;
  status: RoomBlockStatus;
}

export interface AvailabilityQuery {
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  /** Number of physical rooms the party wants to book. */
  rooms: number;
}

export type UnavailableReason = "capacity" | "sold_out" | "insufficient_units";

export interface RoomTypeAvailability {
  roomTypeId: string;
  roomTypeName: string;
  /** Physical rooms of this type free for the ENTIRE requested range. */
  availableUnits: number;
  /** Sellable inventory ignoring the party (active rooms of this type). */
  totalUnits: number;
  fitsParty: boolean;
  /** fitsParty && availableUnits >= query.rooms */
  isBookable: boolean;
  unavailableReason?: UnavailableReason;
  pricing: { basePriceCents: number; currency: string; nights: number };
  occupancy: { maxAdults: number; maxChildren: number; maxOccupancy: number };
  sizeSqm?: number;
}

export interface AvailabilityInput {
  roomTypes: RoomTypeSnapshot[];
  rooms: RoomSnapshot[];
  bookings: BookingRoomSnapshot[];
  blocks: RoomBlockSnapshot[];
  query: AvailabilityQuery;
}

/** Per-day cell for the admin inventory calendar. */
export type CalendarCellState = "AVAILABLE" | "BOOKED" | "BLOCKED" | "OUT_OF_SERVICE";
