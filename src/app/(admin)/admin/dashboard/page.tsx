import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getInventoryOverview } from "@/domain/availability/admin-view";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

/**
 * Dashboard-level inventory summary. Booking revenue, arrivals and
 * analytics arrive with the booking engine; this step only surfaces what
 * the inventory model can honestly answer today.
 */
export default async function AdminDashboardPage() {
  const overview = await getInventoryOverview(new Date().toISOString().slice(0, 10));
  const { totals, groups } = overview;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">Inventory tonight. Demo data — no database connected yet.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tonight&apos;s inventory</CardTitle>
          <CardDescription>{totals.sellable} sellable rooms · {totals.outOfService} out of service</CardDescription>
        </CardHeader>
        {groups.length === 0 ? (
          <EmptyState title="No rooms set up yet" description="Add room types and rooms to see occupancy here." />
        ) : (
          <>
            <dl className="grid grid-cols-3 gap-3 text-center">
              <div><dt className="text-xs text-text-secondary">Free</dt><dd className="text-2xl tabular-nums">{totals.availableTonight}</dd></div>
              <div><dt className="text-xs text-text-secondary">Booked</dt><dd className="text-2xl tabular-nums">{totals.bookedTonight}</dd></div>
              <div><dt className="text-xs text-text-secondary">Blocked</dt><dd className="text-2xl tabular-nums">{totals.blockedTonight}</dd></div>
            </dl>
            <ul className="mt-5 divide-y divide-[var(--border-subtle)] border-t border-border-subtle text-sm">
              {groups.map(({ roomType, rooms }) => {
                const free = rooms.filter((r) => r.tonight === "AVAILABLE").length;
                return (
                  <li key={roomType.id} className="flex items-center justify-between py-2">
                    <span className="text-text-primary">{roomType.name}</span>
                    <span className="text-text-secondary tabular-nums">{free} of {rooms.length} free</span>
                  </li>
                );
              })}
            </ul>
            <Link href="/admin/inventory" className="mt-4 inline-block text-sm font-medium text-accent-ops hover:underline">Open rooms &amp; inventory</Link>
          </>
        )}
      </Card>
    </div>
  );
}
