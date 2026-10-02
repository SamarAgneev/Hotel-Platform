import type { Metadata } from "next";
import Link from "next/link";
import { getCalendarView } from "@/domain/availability/admin-view";
import { addDays, isIsoDate } from "@/domain/availability/dateRange";
import { STATE_META, StateLegend } from "@/components/admin/InventoryStateMark";
import { cn } from "@/lib/utils/cn";
import { formatDateLabel } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Inventory calendar" };
export const dynamic = "force-dynamic";

const DAYS = 14;

export default async function InventoryCalendarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const raw = Array.isArray(params.start) ? params.start[0] : params.start;
  const start = raw && isIsoDate(raw) ? raw : today;
  const view = await getCalendarView(start, DAYS);
  const dayLabel = (iso: string) => ({ d: iso.slice(8), m: new Date(`${iso}T00:00:00Z`).toLocaleString("en-US", { month: "short", timeZone: "UTC" }), w: new Date(`${iso}T00:00:00Z`).toLocaleString("en-US", { weekday: "short", timeZone: "UTC" }) });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl text-text-primary">Inventory calendar</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {formatDateLabel(view.start)} – {formatDateLabel(addDays(view.end, -1))}. Each column is a night; a stay&apos;s check-out day shows as free.
          </p>
        </div>
        <nav aria-label="Calendar range" className="flex gap-2">
          <Link href={`?start=${addDays(start, -DAYS)}`} className="inline-flex h-10 items-center rounded-md border border-border-default px-3 text-sm hover:bg-surface-sunken">← Earlier</Link>
          <Link href="?" className="inline-flex h-10 items-center rounded-md border border-border-default px-3 text-sm hover:bg-surface-sunken">Today</Link>
          <Link href={`?start=${addDays(start, DAYS)}`} className="inline-flex h-10 items-center rounded-md border border-border-default px-3 text-sm hover:bg-surface-sunken">Later →</Link>
        </nav>
      </div>

      <StateLegend />

      <div className="overflow-x-auto rounded-lg border border-border-subtle bg-surface-raised">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Room availability by night. A = available, B = booked, M = blocked or maintenance, X = out of service.</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 min-w-28 border-b border-r border-border-subtle bg-surface-sunken px-3 py-2 text-left text-xs font-semibold text-text-secondary">Room</th>
              {view.dates.map((date) => {
                const l = dayLabel(date);
                return (
                  <th key={date} scope="col" className={cn("min-w-11 border-b border-border-subtle bg-surface-sunken px-1 py-2 text-center text-xs font-normal text-text-secondary", date === today && "text-text-primary font-semibold")}>
                    <span className="block">{l.w}</span>
                    <span className="block text-text-primary">{l.d}</span>
                    <span className="block">{l.m}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {view.groups.map(({ roomType, rooms }) => (
              <RoomGroup key={roomType.id} name={roomType.name} colSpan={view.dates.length + 1} rooms={rooms} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoomGroup({ name, colSpan, rooms }: { name: string; colSpan: number; rooms: Awaited<ReturnType<typeof getCalendarView>>["groups"][number]["rooms"] }) {
  return (
    <>
      <tr>
        <th colSpan={colSpan} scope="colgroup" className="sticky left-0 border-b border-border-subtle bg-surface-page px-3 py-2 text-left text-xs font-semibold text-text-primary">
          {name}
        </th>
      </tr>
      {rooms.map(({ room, cells }) => (
        <tr key={room.id}>
          <th scope="row" className="sticky left-0 z-10 border-b border-r border-border-subtle bg-surface-raised px-3 py-1.5 text-left font-medium text-text-primary">{room.roomNumber}</th>
          {cells.map((cell) => {
            const meta = STATE_META[cell.state];
            return (
              <td key={cell.date} className="border-b border-border-subtle p-0.5 text-center">
                <span
                  title={`${room.roomNumber}, ${cell.date}: ${meta.label}`}
                  className={cn("flex h-8 items-center justify-center rounded text-xs", meta.cell)}
                >
                  <span aria-hidden="true">{meta.letter}</span>
                  <span className="sr-only">{meta.label}</span>
                </span>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
