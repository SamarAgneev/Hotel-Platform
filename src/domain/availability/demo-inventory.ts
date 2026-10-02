/**
 * DEMO INVENTORY — physical rooms, bookings and blocks for the fictional
 * Royal Horizon Hotel. Room TYPES are derived from the Step 2 room content
 * (`domain/hotel/demo-data.ts`) so there is exactly one source of truth for
 * names, sizes and prices; this file only adds what Step 2 lacked: physical
 * rooms, capacity split, and reservations/blocks.
 *
 * Stay/block dates are offsets from "today" so the demo always has live,
 * near-future data. Everything here is replaced by Prisma reads once a
 * database is connected (see `service.ts`).
 */

import { DEMO_ROOMS } from "@/domain/hotel/demo-data";
import { addDays } from "./dateRange";
import type {
  BookingRoomSnapshot,
  RoomBlockSnapshot,
  RoomSnapshot,
  RoomTypeSnapshot,
} from "./types";

/** roomTypeId === Step 2 room slug, so results link straight to /rooms/[slug]. */
const CAPACITY: Record<string, { maxAdults: number; maxChildren: number }> = {
  "skyline-king": { maxAdults: 2, maxChildren: 1 },
  "harbor-suite": { maxAdults: 3, maxChildren: 2 },
  "garden-twin": { maxAdults: 2, maxChildren: 1 },
  "penthouse-terrace": { maxAdults: 2, maxChildren: 1 },
};

export const DEMO_ROOM_TYPES: RoomTypeSnapshot[] = DEMO_ROOMS.map((room) => ({
  id: room.slug,
  name: room.name,
  maxAdults: CAPACITY[room.slug]?.maxAdults ?? room.maxOccupancy,
  maxChildren: CAPACITY[room.slug]?.maxChildren ?? 0,
  maxOccupancy: room.maxOccupancy,
  basePriceCents: room.startingPriceCents,
  currency: room.currency,
  sizeSqm: room.sizeSqm,
}));

export const DEMO_PHYSICAL_ROOMS: RoomSnapshot[] = [
  ...["501", "502", "503", "504", "505", "506"].map((n) => ({
    id: `room-${n}`, roomNumber: n, roomTypeId: "skyline-king", status: "ACTIVE" as const,
  })),
  ...["401", "402", "403", "404"].map((n) => ({
    id: `room-${n}`, roomNumber: n, roomTypeId: "harbor-suite", status: "ACTIVE" as const,
  })),
  ...["G01", "G02", "G03", "G04"].map((n) => ({
    id: `room-${n}`, roomNumber: n, roomTypeId: "garden-twin", status: "ACTIVE" as const,
  })),
  // One garden room is out of service until repaired: never sellable.
  { id: "room-G05", roomNumber: "G05", roomTypeId: "garden-twin", status: "MAINTENANCE" as const },
  { id: "room-PH1", roomNumber: "PH1", roomTypeId: "penthouse-terrace", status: "ACTIVE" as const },
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Demo reservations, offset from today so they always fall in the near future. */
export function getDemoBookings(): BookingRoomSnapshot[] {
  const d = (n: number) => addDays(today(), n);
  const b = (
    id: string, roomId: string, from: number, to: number, status: BookingRoomSnapshot["status"] = "CONFIRMED",
  ): BookingRoomSnapshot => ({ bookingId: id, roomId, checkInDate: d(from), checkOutDate: d(to), status });

  return [
    b("demo-bk-1", "room-501", 13, 17),
    b("demo-bk-2", "room-502", 14, 16),
    b("demo-bk-3", "room-503", 15, 18, "PENDING"),
    b("demo-bk-4", "room-504", 10, 20, "CANCELLED"), // cancelled: must NOT block
    b("demo-bk-5", "room-PH1", 20, 23),
    b("demo-bk-6", "room-401", 14, 15),
    b("demo-bk-7", "room-G01", 12, 14),
    b("demo-bk-8", "room-G02", 14, 21),
  ];
}

export function getDemoBlocks(): RoomBlockSnapshot[] {
  const d = (n: number) => addDays(today(), n);
  return [
    { id: "demo-blk-1", roomId: "room-402", startDate: d(14), endDate: d(18), reason: "Maintenance", notes: "Bathroom refit", status: "ACTIVE" },
    { id: "demo-blk-2", roomId: "room-505", startDate: d(30), endDate: d(32), reason: "Owner hold", status: "ACTIVE" },
    { id: "demo-blk-3", roomId: "room-506", startDate: d(5), endDate: d(8), reason: "Deep clean", status: "CANCELLED" },
  ];
}
