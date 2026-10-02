import type { Metadata } from "next";
import { RoomBlockForm } from "@/components/admin/RoomBlockForm";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { getBlocksView, getRoomOptions } from "@/domain/availability/admin-view";
import { formatDateLabel } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Room blocks" };
export const dynamic = "force-dynamic";

export default async function RoomBlocksPage() {
  const [blocks, roomOptions] = await Promise.all([getBlocksView(), getRoomOptions()]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl text-text-primary">Room blocks</h1>
        <p className="mt-1 text-sm text-text-secondary">Take a room out of sale for a date range — maintenance, deep clean, owner hold.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_1fr]">
        <RoomBlockForm roomOptions={roomOptions} />

        <section aria-labelledby="existing-blocks">
          <h2 id="existing-blocks" className="mb-3 text-lg text-text-primary">Existing blocks</h2>
          {blocks.length === 0 ? (
            <EmptyState title="No room blocks" description="Rooms you block will be listed here." />
          ) : (
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Room</TableHeaderCell>
                  <TableHeaderCell>Dates</TableHeaderCell>
                  <TableHeaderCell>Reason</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {blocks.map(({ block, roomNumber, roomTypeName }) => (
                  <TableRow key={block.id}>
                    <TableCell>
                      <span className="font-medium">{roomNumber}</span>
                      <span className="block text-xs text-text-secondary">{roomTypeName}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{formatDateLabel(block.startDate)} → {formatDateLabel(block.endDate)}</TableCell>
                    <TableCell>
                      {block.reason}
                      {block.notes && <span className="block text-xs text-text-secondary">{block.notes}</span>}
                    </TableCell>
                    <TableCell><Badge tone={block.status === "ACTIVE" ? "warning" : "neutral"}>{block.status === "ACTIVE" ? "Active" : "Cancelled"}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </div>
    </div>
  );
}
