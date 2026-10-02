import type { Metadata } from "next";
import { RoomCard } from "@/components/marketing/RoomCard";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { getRooms } from "@/domain/hotel/repository";

export const metadata: Metadata = {
  title: "Rooms",
  description: "Four room types at Royal Horizon Hotel, from the Garden Twin to the Penthouse Terrace.",
};

export default async function RoomsPage() {
  const rooms = await getRooms();

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-6 py-16">
      <SectionHeading
        title="Rooms"
        description="Every room shares the same quiet materials palette — walnut, undyed linen, brushed brass — sized and laid out differently for how you're staying."
      />

      {rooms.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No rooms are currently available"
            description="Check back shortly, or get in touch and we'll help directly."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.slug} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
