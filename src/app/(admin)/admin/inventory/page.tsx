import type { Metadata } from "next";
import Link from "next/link";
import { getInventoryOverview } from "@/domain/availability/admin-view";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { StateChip } from "@/components/admin/InventoryStateMark";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateLabel, formatPriceFromCents } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Rooms & inventory" };
export const dynamic = "force-dynamic"; // "tonight" must be computed per request

const ROOM_STATUS_LABEL = { ACTIVE: "In service", OUT_OF_SERVICE: "Out of service", MAINTENANCE: "Under maintenance", RETIRED: "Retired" } as const;

export default async function InventoryPage() {
  const today = new Date().toISOString().slice(0, 10);
  const overview = await getInventoryOverview(today);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl text-text-primary">Rooms &amp; inventory</h1>
          <p className="mt-1 text-sm text-text-secondary">Physical rooms grouped by room type, with tonight&apos;s state.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/inventory/calendar" className="inline-flex h-10 items-center rounded-md border border-border-default px-4 text-sm font-medium hover:bg-surface-sunken">
            Open calendar
          </Link>
          <Link href="/admin/inventory/blocks" className="inline-flex h-10 items-center rounded-md bg-accent-ops px-4 text-sm font-medium text-text-on-accent hover:bg-accent-ops-hover">
            Block a room
          </Link>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Rooms", overview.totals.rooms],
          ["Free tonight", overview.totals.availableTonight],
          ["Booked tonight", overview.totals.bookedTonight],
          ["Blocked / out of service", overview.totals.blockedTonight + overview.totals.outOfService],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border-subtle bg-surface-raised px-4 py-3">
            <dt className="text-xs text-text-secondary">{label}</dt>
            <dd className="mt-1 text-2xl text-text-primary tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      {overview.groups.length === 0 ? (
        <EmptyState title="No rooms yet" description="Add room types and physical rooms to start managing inventory." />
      ) : (
        overview.groups.map(({ roomType, rooms }) => (
          <section key={roomType.id} aria-labelledby={`type-${roomType.id}`}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id={`type-${roomType.id}`} className="text-lg text-text-primary">
                {roomType.name}
                <span className="ml-2 text-sm text-text-secondary">
                  {rooms.length} {rooms.length === 1 ? "room" : "rooms"} · up to {roomType.maxOccupancy} guests · from {formatPriceFromCents(roomType.basePriceCents, roomType.currency)}
                </span>
              </h2>
            </div>
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Room</TableHeaderCell>
                  <TableHeaderCell>Room status</TableHeaderCell>
                  <TableHeaderCell>Tonight</TableHeaderCell>
                  <TableHeaderCell>Next reservation</TableHeaderCell>
                  <TableHeaderCell>Next block</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {rooms.map(({ room, tonight, nextStay, nextBlock }) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.roomNumber}</TableCell>
                    <TableCell>{ROOM_STATUS_LABEL[room.status]}</TableCell>
                    <TableCell><StateChip state={tonight} /></TableCell>
                    <TableCell className="text-text-secondary">
                      {nextStay ? `${formatDateLabel(nextStay.checkInDate)} → ${formatDateLabel(nextStay.checkOutDate)}` : "None upcoming"}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {nextBlock ? `${nextBlock.reason}, ${formatDateLabel(nextBlock.startDate)} → ${formatDateLabel(nextBlock.endDate)}` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        ))
      )}
    </div>
  );
}
