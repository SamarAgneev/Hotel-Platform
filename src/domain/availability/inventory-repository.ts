/**
 * Inventory repository — the data-access seam for availability.
 *
 * Same pattern as `domain/hotel/repository.ts`: callers depend on these
 * functions, today they resolve from demo inventory, and the Prisma
 * implementation (`service.ts`) is the drop-in replacement once a database
 * is connected. Reads are narrowed to the requested window here so a real
 * implementation never loads the whole reservation history.
 */

import { rangesOverlap } from "./dateRange";
import {
  DEMO_PHYSICAL_ROOMS,
  DEMO_ROOM_TYPES,
  getDemoBlocks,
  getDemoBookings,
} from "./demo-inventory";
import type {
  BookingRoomSnapshot,
  RoomBlockSnapshot,
  RoomSnapshot,
  RoomTypeSnapshot,
} from "./types";

export interface InventoryWindow {
  roomTypes: RoomTypeSnapshot[];
  rooms: RoomSnapshot[];
  bookings: BookingRoomSnapshot[];
  blocks: RoomBlockSnapshot[];
}

/** Everything needed to compute availability for [start, end). */
export async function getInventoryWindow(start: string, end: string): Promise<InventoryWindow> {
  return {
    roomTypes: DEMO_ROOM_TYPES,
    rooms: DEMO_PHYSICAL_ROOMS,
    bookings: getDemoBookings().filter((b) => rangesOverlap(start, end, b.checkInDate, b.checkOutDate)),
    blocks: getDemoBlocks().filter((b) => rangesOverlap(start, end, b.startDate, b.endDate)),
  };
}

/** Admin: every block (active and cancelled), newest window first. */
export async function listRoomBlocks(): Promise<RoomBlockSnapshot[]> {
  return [...getDemoBlocks()].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

/** Admin: upcoming reservations per room, for the inventory table. */
export async function listBookingsFrom(start: string): Promise<BookingRoomSnapshot[]> {
  return getDemoBookings()
    .filter((b) => b.checkOutDate > start)
    .sort((a, b) => (a.checkInDate < b.checkInDate ? -1 : 1));
}
