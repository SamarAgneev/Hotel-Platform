/**
 * Read models for the admin inventory screens. Composition only: data comes
 * from the repository, every availability/occupancy decision comes from the
 * engine — nothing is re-derived in the UI.
 */

import { addDays } from "./dateRange";
import { buildInventoryCalendar } from "./engine";
import { getInventoryWindow, listBookingsFrom, listRoomBlocks } from "./inventory-repository";
import type { CalendarCellState, RoomBlockSnapshot, RoomSnapshot, RoomTypeSnapshot } from "./types";

export interface InventoryRoomRow {
  room: RoomSnapshot;
  tonight: CalendarCellState;
  nextStay?: { checkInDate: string; checkOutDate: string; status: string };
  nextBlock?: { startDate: string; endDate: string; reason: string };
}

export interface InventoryOverview {
  today: string;
  groups: { roomType: RoomTypeSnapshot; rooms: InventoryRoomRow[] }[];
  totals: { rooms: number; sellable: number; outOfService: number; bookedTonight: number; blockedTonight: number; availableTonight: number };
}

export async function getInventoryOverview(today: string): Promise<InventoryOverview> {
  const horizon = addDays(today, 90);
  const [window, upcoming] = await Promise.all([getInventoryWindow(today, horizon), listBookingsFrom(today)]);
  const tonightRows = buildInventoryCalendar({
    rooms: window.rooms,
    bookings: window.bookings,
    blocks: window.blocks,
    startDate: today,
    endDate: addDays(today, 1),
  });
  const tonight = new Map(tonightRows.map((r) => [r.roomId, r.cells[0].state]));

  const groups = window.roomTypes.map((roomType) => ({
    roomType,
    rooms: window.rooms
      .filter((room) => room.roomTypeId === roomType.id)
      .map((room): InventoryRoomRow => {
        const stay = upcoming.find((b) => b.roomId === room.id && b.status !== "CANCELLED" && b.status !== "NO_SHOW");
        const block = window.blocks
          .filter((b) => b.roomId === room.id && b.status === "ACTIVE" && b.endDate > today)
          .sort((a, b) => (a.startDate < b.startDate ? -1 : 1))[0];
        return {
          room,
          tonight: tonight.get(room.id) ?? "AVAILABLE",
          nextStay: stay && { checkInDate: stay.checkInDate, checkOutDate: stay.checkOutDate, status: stay.status },
          nextBlock: block && { startDate: block.startDate, endDate: block.endDate, reason: block.reason },
        };
      }),
  }));

  const all = groups.flatMap((g) => g.rooms);
  return {
    today,
    groups,
    totals: {
      rooms: all.length,
      sellable: all.filter((r) => r.room.status === "ACTIVE").length,
      outOfService: all.filter((r) => r.room.status !== "ACTIVE").length,
      bookedTonight: all.filter((r) => r.tonight === "BOOKED").length,
      blockedTonight: all.filter((r) => r.tonight === "BLOCKED").length,
      availableTonight: all.filter((r) => r.tonight === "AVAILABLE").length,
    },
  };
}

export async function getCalendarView(start: string, days: number) {
  const end = addDays(start, days);
  const window = await getInventoryWindow(start, end);
  const rows = buildInventoryCalendar({ ...window, startDate: start, endDate: end });
  const byRoom = new Map(rows.map((r) => [r.roomId, r.cells]));
  return {
    start,
    end,
    dates: rows[0]?.cells.map((c) => c.date) ?? [],
    groups: window.roomTypes.map((roomType) => ({
      roomType,
      rooms: window.rooms
        .filter((r) => r.roomTypeId === roomType.id)
        .map((room) => ({ room, cells: byRoom.get(room.id) ?? [] })),
    })),
  };
}

export async function getBlocksView(): Promise<{ block: RoomBlockSnapshot; roomNumber: string; roomTypeName: string }[]> {
  const [blocks, window] = await Promise.all([listRoomBlocks(), getInventoryWindow("1900-01-01", "2999-12-31")]);
  return blocks.map((block) => {
    const room = window.rooms.find((r) => r.id === block.roomId);
    const type = window.roomTypes.find((t) => t.id === room?.roomTypeId);
    return { block, roomNumber: room?.roomNumber ?? "?", roomTypeName: type?.name ?? "Unknown" };
  });
}

export async function getRoomOptions() {
  const window = await getInventoryWindow("1900-01-01", "1900-01-02");
  return window.rooms
    .filter((r) => r.status === "ACTIVE")
    .map((r) => ({
      value: r.id,
      label: `Room ${r.roomNumber} — ${window.roomTypes.find((t) => t.id === r.roomTypeId)?.name ?? ""}`,
    }));
}
