import { describe, expect, it } from "vitest";
import { computeAvailability, canReserve, buildInventoryCalendar, AvailabilityValidationError } from "./engine";
import { rangesOverlap } from "./dateRange";
import type {
  AvailabilityQuery,
  BookingRoomSnapshot,
  RoomBlockSnapshot,
  RoomSnapshot,
  RoomTypeSnapshot,
} from "./types";
import { availabilitySearchSchema } from "@/lib/validation/booking";

const deluxe: RoomTypeSnapshot = {
  id: "deluxe",
  name: "Deluxe King",
  maxAdults: 2,
  maxChildren: 1,
  maxOccupancy: 3,
  basePriceCents: 399900,
  currency: "INR",
  sizeSqm: 42,
};

const room = (id: string, over: Partial<RoomSnapshot> = {}): RoomSnapshot => ({
  id,
  roomNumber: id,
  roomTypeId: "deluxe",
  status: "ACTIVE",
  ...over,
});

const booking = (roomId: string, checkIn: string, checkOut: string, status: BookingRoomSnapshot["status"] = "CONFIRMED"): BookingRoomSnapshot => ({
  bookingId: `b-${roomId}-${checkIn}`,
  roomId,
  checkInDate: checkIn,
  checkOutDate: checkOut,
  status,
});

const block = (roomId: string, start: string, end: string, reason = "Maintenance"): RoomBlockSnapshot => ({
  id: `bl-${roomId}-${start}`,
  roomId,
  startDate: start,
  endDate: end,
  reason,
  status: "ACTIVE",
});

const query = (over: Partial<AvailabilityQuery> = {}): AvailabilityQuery => ({
  checkInDate: "2026-10-12",
  checkOutDate: "2026-10-14",
  adults: 2,
  children: 0,
  rooms: 1,
  ...over,
});

function run(opts: {
  rooms?: RoomSnapshot[];
  bookings?: BookingRoomSnapshot[];
  blocks?: RoomBlockSnapshot[];
  query?: AvailabilityQuery;
  roomTypes?: RoomTypeSnapshot[];
}) {
  const result = computeAvailability({
    roomTypes: opts.roomTypes ?? [deluxe],
    rooms: opts.rooms ?? [room("101")],
    bookings: opts.bookings ?? [],
    blocks: opts.blocks ?? [],
    query: opts.query ?? query(),
  });
  return result[0];
}

describe("availability engine", () => {
  it("1. no bookings -> room available", () => {
    const r = run({});
    expect(r.availableUnits).toBe(1);
    expect(r.isBookable).toBe(true);
  });

  it("2. booking completely overlaps search -> unavailable", () => {
    const r = run({ bookings: [booking("101", "2026-10-10", "2026-10-15")] });
    expect(r.availableUnits).toBe(0);
    expect(r.unavailableReason).toBe("sold_out");
  });

  it("3. booking starts before search and ends during it -> unavailable", () => {
    const r = run({ bookings: [booking("101", "2026-10-10", "2026-10-13")] });
    expect(r.availableUnits).toBe(0);
  });

  it("4. booking starts during search and ends after it -> unavailable", () => {
    const r = run({ bookings: [booking("101", "2026-10-13", "2026-10-16")] });
    expect(r.availableUnits).toBe(0);
  });

  it("5. booking ends exactly on check-in -> available", () => {
    const r = run({ bookings: [booking("101", "2026-10-10", "2026-10-12")] });
    expect(r.availableUnits).toBe(1);
  });

  it("6. booking starts exactly on check-out -> available", () => {
    const r = run({ bookings: [booking("101", "2026-10-14", "2026-10-16")] });
    expect(r.availableUnits).toBe(1);
  });

  it("7. room block -> unavailable, and free again after the block ends", () => {
    const blocks = [block("101", "2026-10-20", "2026-10-22", "Owner hold")];
    expect(run({ blocks, query: query({ checkInDate: "2026-10-20", checkOutDate: "2026-10-22" }) }).availableUnits).toBe(0);
    expect(run({ blocks, query: query({ checkInDate: "2026-10-22", checkOutDate: "2026-10-24" }) }).availableUnits).toBe(1);
  });

  it("8. maintenance -> unavailable (date-scoped block AND room-level status)", () => {
    const q = query({ checkInDate: "2026-10-20", checkOutDate: "2026-10-22" });
    expect(run({ blocks: [block("103", "2026-10-20", "2026-10-22")], rooms: [room("103")], query: q }).availableUnits).toBe(0);
    expect(run({ rooms: [room("103", { status: "MAINTENANCE" })] }).availableUnits).toBe(0);
    expect(run({ rooms: [room("103", { status: "OUT_OF_SERVICE" })] }).availableUnits).toBe(0);
  });

  it("9. cancelled booking (and cancelled block) does not block inventory", () => {
    expect(run({ bookings: [booking("101", "2026-10-10", "2026-10-15", "CANCELLED")] }).availableUnits).toBe(1);
    const cancelledBlock: RoomBlockSnapshot = { ...block("101", "2026-10-10", "2026-10-15"), status: "CANCELLED" };
    expect(run({ blocks: [cancelledBlock] }).availableUnits).toBe(1);
  });

  it("9b. PENDING/CHECKED_IN block; NO_SHOW releases", () => {
    expect(run({ bookings: [booking("101", "2026-10-12", "2026-10-14", "PENDING")] }).availableUnits).toBe(0);
    expect(run({ bookings: [booking("101", "2026-10-12", "2026-10-14", "CHECKED_IN")] }).availableUnits).toBe(0);
    expect(run({ bookings: [booking("101", "2026-10-12", "2026-10-14", "NO_SHOW")] }).availableUnits).toBe(1);
  });

  it("10. guest capacity exceeded -> room type not bookable", () => {
    const r = run({ query: query({ adults: 3 }) });
    expect(r.availableUnits).toBe(1); // inventory exists...
    expect(r.fitsParty).toBe(false); // ...but the party does not fit
    expect(r.isBookable).toBe(false);
    expect(r.unavailableReason).toBe("capacity");
  });

  it("10b. children and total occupancy limits are enforced", () => {
    expect(run({ query: query({ adults: 2, children: 2 }) }).fitsParty).toBe(false); // maxChildren 1
    expect(run({ query: query({ adults: 2, children: 1 }) }).fitsParty).toBe(true); // total 3
    expect(run({ query: query({ adults: 4, children: 0, rooms: 2 }) }).fitsParty).toBe(true); // 2 per room
  });

  it("11. multiple physical rooms of one type -> correct available quantity", () => {
    const rooms = [room("101"), room("102"), room("103"), room("104")];
    const bookings = [booking("101", "2026-10-10", "2026-10-15"), booking("102", "2026-10-13", "2026-10-20")];
    const r = run({ rooms, bookings, blocks: [block("103", "2026-10-01", "2026-10-13")] });
    expect(r.totalUnits).toBe(4);
    expect(r.availableUnits).toBe(1); // only 104 is free
  });

  it("11b. requested room count larger than free units -> not bookable", () => {
    const rooms = [room("101"), room("102")];
    const r = run({ rooms, bookings: [booking("101", "2026-10-12", "2026-10-14")], query: query({ adults: 2, rooms: 2 }) });
    expect(r.availableUnits).toBe(1);
    expect(r.isBookable).toBe(false);
    expect(r.unavailableReason).toBe("insufficient_units");
  });

  it("12. no available inventory -> nothing bookable", () => {
    const rooms = [room("101"), room("102")];
    const bookings = [booking("101", "2026-10-01", "2026-10-30"), booking("102", "2026-10-01", "2026-10-30")];
    const results = computeAvailability({ roomTypes: [deluxe], rooms, bookings, blocks: [], query: query() });
    expect(results.filter((r) => r.isBookable)).toHaveLength(0);
    expect(results[0].availableUnits).toBe(0);
  });

  it("12b. a room type with no physical rooms is never bookable", () => {
    const r = run({ rooms: [] });
    expect(r.totalUnits).toBe(0);
    expect(r.isBookable).toBe(false);
  });

  it("13. invalid date range -> validation error (engine and schema)", () => {
    expect(() => run({ query: query({ checkInDate: "2026-10-14", checkOutDate: "2026-10-12" }) })).toThrow(AvailabilityValidationError);
    expect(() => run({ query: query({ checkInDate: "2026-10-12", checkOutDate: "2026-10-12" }) })).toThrow(AvailabilityValidationError);
    expect(() => run({ query: query({ checkInDate: "not-a-date" }) })).toThrow(AvailabilityValidationError);
    const parsed = availabilitySearchSchema.safeParse({ checkInDate: "2026-10-14", checkOutDate: "2026-10-12", adults: 2, children: 0, rooms: 1 });
    expect(parsed.success).toBe(false);
  });

  it("13b. rejects impossible guest/room combos", () => {
    expect(() => run({ query: query({ adults: 0 }) })).toThrow(AvailabilityValidationError);
    expect(() => run({ query: query({ adults: 1, rooms: 2 }) })).toThrow(AvailabilityValidationError);
  });

  it("overbooking guard: 4 rooms, 4 overlapping bookings -> a fifth cannot be reserved", () => {
    const rooms = [room("101"), room("102"), room("103"), room("104")];
    const bookings = rooms.map((r) => booking(r.id, "2026-10-12", "2026-10-14"));
    const base = { roomTypes: [deluxe], rooms, bookings, blocks: [], query: query(), roomTypeId: "deluxe" };
    expect(canReserve(base)).toBe(false);
    expect(canReserve({ ...base, bookings: bookings.slice(0, 3) })).toBe(true);
  });

  it("prices are per-night with the stay length reported", () => {
    expect(run({}).pricing).toEqual({ basePriceCents: 399900, currency: "INR", nights: 2 });
  });
});

describe("rangesOverlap (half-open [start, end))", () => {
  it("touching ranges do not overlap; intersecting ones do", () => {
    expect(rangesOverlap("2026-10-12", "2026-10-14", "2026-10-14", "2026-10-16")).toBe(false);
    expect(rangesOverlap("2026-10-12", "2026-10-14", "2026-10-10", "2026-10-12")).toBe(false);
    expect(rangesOverlap("2026-10-12", "2026-10-14", "2026-10-13", "2026-10-15")).toBe(true);
    expect(rangesOverlap("2026-10-12", "2026-10-14", "2026-10-12", "2026-10-14")).toBe(true);
    expect(rangesOverlap("2026-10-12", "2026-10-14", "2026-10-01", "2026-10-30")).toBe(true);
  });
});

describe("inventory calendar", () => {
  it("marks booked nights, blocked nights and leaves the checkout night free", () => {
    const [row] = buildInventoryCalendar({
      rooms: [room("101")],
      bookings: [booking("101", "2026-10-12", "2026-10-14")],
      blocks: [block("101", "2026-10-15", "2026-10-16")],
      startDate: "2026-10-12",
      endDate: "2026-10-17",
    });
    expect(row.cells.map((c) => c.state)).toEqual(["BOOKED", "BOOKED", "AVAILABLE", "BLOCKED", "AVAILABLE"]);
  });
});
