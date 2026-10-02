/**
 * Prisma-backed availability service — the production data path.
 *
 * NOT wired into the app in this build: there is no database or seed data
 * yet, and the sandbox this was built in could not run `prisma generate`
 * (engine CDN blocked), so this file is unverified against a live schema.
 * It exists to fix the intended shape: read a narrowed window from
 * Postgres, map to snapshots, and hand them to the pure engine. Wiring it
 * in means swapping `inventory-repository.ts` for this module.
 */

import { prisma } from "@/lib/db/client";
import { computeAvailability, canReserve } from "./engine";
import type {
  AvailabilityQuery,
  BookingRoomSnapshot,
  RoomBlockSnapshot,
  RoomSnapshot,
  RoomTypeAvailability,
  RoomTypeSnapshot,
} from "./types";

const toIso = (d: Date) => d.toISOString().slice(0, 10);

// Row shapes we rely on. Declared locally so this file type-checks with or
// without a generated Prisma client (the generated types are structurally
// compatible supersets of these).
interface RoomTypeRow { id: string; name: string; maxAdults: number; maxChildren: number; maxOccupancy: number; basePriceCents: number; sizeSqm: number | null }
interface RoomRow { id: string; roomNumber: string; roomTypeId: string; status: RoomSnapshot["status"] }
interface BookingRoomRow { bookingId: string; roomId: string; booking: { checkInDate: Date; checkOutDate: Date; status: BookingRoomSnapshot["status"] } }
interface BlockRow { id: string; roomId: string; startDate: Date; endDate: Date; reason: string; notes: string | null; status: RoomBlockSnapshot["status"] }

/** Reads one property's inventory window. `tx` lets callers run this inside a transaction. */
export async function loadInventoryWindow(
  propertyId: string,
  start: string,
  end: string,
  tx: typeof prisma = prisma,
) {
  const [roomTypes, rooms, bookingRooms, blocks] = await Promise.all([
    tx.roomType.findMany({ where: { propertyId } }),
    tx.room.findMany({ where: { propertyId } }),
    // Overlap pushed into SQL: booking starts before window end AND ends after window start.
    tx.bookingRoom.findMany({
      where: {
        room: { propertyId },
        booking: {
          checkInDate: { lt: new Date(end) },
          checkOutDate: { gt: new Date(start) },
          status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
        },
      },
      include: { booking: true },
    }),
    tx.roomBlock.findMany({
      where: {
        room: { propertyId },
        status: "ACTIVE",
        startDate: { lt: new Date(end) },
        endDate: { gt: new Date(start) },
      },
    }),
  ]);

  return {
    roomTypes: (roomTypes as RoomTypeRow[]).map(
      (t): RoomTypeSnapshot => ({
        id: t.id,
        name: t.name,
        maxAdults: t.maxAdults,
        maxChildren: t.maxChildren,
        maxOccupancy: t.maxOccupancy,
        basePriceCents: t.basePriceCents,
        currency: "USD", // TODO: from Property.currency
        sizeSqm: t.sizeSqm ?? undefined,
      }),
    ),
    rooms: (rooms as RoomRow[]).map(
      (r): RoomSnapshot => ({ id: r.id, roomNumber: r.roomNumber, roomTypeId: r.roomTypeId, status: r.status }),
    ),
    bookings: (bookingRooms as BookingRoomRow[]).map(
      (br): BookingRoomSnapshot => ({
        bookingId: br.bookingId,
        roomId: br.roomId,
        checkInDate: toIso(br.booking.checkInDate),
        checkOutDate: toIso(br.booking.checkOutDate),
        status: br.booking.status,
      }),
    ),
    blocks: (blocks as BlockRow[]).map(
      (b): RoomBlockSnapshot => ({
        id: b.id,
        roomId: b.roomId,
        startDate: toIso(b.startDate),
        endDate: toIso(b.endDate),
        reason: b.reason,
        notes: b.notes ?? undefined,
        status: b.status,
      }),
    ),
  };
}

export async function searchPropertyAvailability(
  propertyId: string,
  query: AvailabilityQuery,
): Promise<RoomTypeAvailability[]> {
  const window = await loadInventoryWindow(propertyId, query.checkInDate, query.checkOutDate);
  return computeAvailability({ ...window, query });
}

/**
 * Concurrency strategy (see docs/availability-engine.md): the booking
 * transaction must re-read the window INSIDE a SERIALIZABLE transaction,
 * re-run `canReserve`, and only then insert Booking + BookingRoom rows (and
 * the RoomInventory day-rows whose UNIQUE(roomId, date) is the final
 * database-level guard). Sketch only — booking creation is a later step.
 */
export async function reserveWithRecheck(
  propertyId: string,
  roomTypeId: string,
  query: AvailabilityQuery,
): Promise<{ ok: boolean }> {
  return prisma.$transaction(
    async (tx: typeof prisma) => {
      const window = await loadInventoryWindow(propertyId, query.checkInDate, query.checkOutDate, tx);
      if (!canReserve({ ...window, query, roomTypeId })) return { ok: false };
      // TODO(booking engine): pick free rooms, create Booking + BookingRoom + RoomInventory rows.
      return { ok: true };
    },
    { isolationLevel: "Serializable" },
  );
}
